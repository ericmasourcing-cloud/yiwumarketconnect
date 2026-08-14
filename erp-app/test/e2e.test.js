import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const dataDir = mkdtempSync(join(tmpdir(), 'hangmao-erp-test-'));
const port = 4197;
let child;

async function waitForServer() {
  for (let i = 0; i < 50; i++) {
    try { const response = await fetch(`http://127.0.0.1:${port}/api/health`); if (response.ok) return; } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error('测试服务未启动');
}

async function login(email, password) {
  const response = await fetch(`http://127.0.0.1:${port}/api/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password }) });
  assert.equal(response.status, 200);
  const result = await response.json();
  return { cookie: response.headers.get('set-cookie').split(';')[0], csrf: result.csrf, user: result.user };
}

async function request(session, path, method = 'GET', input) {
  const response = await fetch(`http://127.0.0.1:${port}${path}`, { method, headers: { cookie: session?.cookie || '', 'x-csrf-token': session?.csrf || '', 'content-type': 'application/json' }, body: input === undefined ? undefined : JSON.stringify(input) });
  const data = await response.json();
  return { status: response.status, data };
}

before(async () => {
  child = spawn(process.execPath, ['src/server.js'], { cwd: process.cwd(), env: { ...process.env, PORT: String(port), ERP_DATA_DIR: dataDir }, stdio: 'ignore' });
  await waitForServer();
});
after(() => { child?.kill(); rmSync(dataDir, { recursive: true, force: true }); });

test('未登录不能读取经营数据', async () => {
  const result = await request(null, '/api/dashboard');
  assert.equal(result.status, 401);
});

test('核心业务链与职责分离', async () => {
  const admin = await login('admin@hangmao.local', 'Admin@2026');
  const manager = await login('manager@hangmao.local', 'Manager@2026');
  const settings = await request(admin, '/api/settings');
  assert.equal(settings.data.low_margin_bps.value, 1500);
  const updatedSetting = await request(admin, '/api/settings', 'PUT', { key: 'approval_reminder_hours', value: 18 });
  assert.equal(updatedSetting.status, 200);
  const newUser = await request(admin, '/api/users', 'POST', { name: '测试运营', email: 'ops-test@hangmao.local', role: 'operations', password: 'Operations@2026' });
  assert.equal(newUser.status, 201);

  const supplier = await request(admin, '/api/suppliers', 'POST', { name: '宁波精工制造', country: '中国', riskLevel: 'low' });
  assert.equal(supplier.status, 201);
  const product = await request(admin, '/api/products', 'POST', { sku: 'HM-001', name: '折叠露营灯', category: '户外照明', unit: 'pcs', salePrice: 12, costPrice: 9, currency: 'USD', supplierId: supplier.data.id });
  assert.equal(product.status, 201);
  const customer = await request(admin, '/api/customers', 'POST', { name: 'Nordlicht GmbH', country: '德国', contactName: 'Anna', email: 'anna@nordlicht.example', nextFollowupAt: '2026-08-20' });
  assert.equal(customer.status, 201);
  const customerDetail = await request(admin, `/api/customers/${customer.data.id}`);
  assert.equal(customerDetail.data.customer.name, 'Nordlicht GmbH');
  const customerUpdate = await request(admin, `/api/customers/${customer.data.id}`, 'PUT', { version: customerDetail.data.customer.version, name: 'Nordlicht Europe GmbH', country: '德国', contactName: 'Anna', email: 'anna@nordlicht.example', stage: 'contacted', level: 'A', nextAction: '发送样品方案', nextFollowupAt: '2026-08-22' });
  assert.equal(customerUpdate.status, 200);
  const staleCustomerUpdate = await request(admin, `/api/customers/${customer.data.id}`, 'PUT', { version: customerDetail.data.customer.version, name: '过期修改', country: '德国', email: 'anna@nordlicht.example' });
  assert.equal(staleCustomerUpdate.status, 409);

  const quote = await request(admin, '/api/quotes', 'POST', { customerId: customer.data.id, currency: 'USD', exchangeRate: 7.2, incoterm: 'FOB', validUntil: '2026-09-01', items: [{ productId: product.data.id, description: '折叠露营灯', quantity: 1000, unitPrice: 10, unitCost: 8.8 }] });
  assert.equal(quote.status, 201);
  assert.equal(quote.data.marginBps, 1200);
  const quoteDetail = await request(admin, `/api/quotes/${quote.data.id}`);
  assert.equal(quoteDetail.data.items.length, 1);
  const submitted = await request(admin, `/api/quotes/${quote.data.id}/submit`, 'POST');
  assert.deepEqual(submitted.data, { status: 'approval_pending' });
  const approvals = await request(admin, '/api/approvals');
  const approval = approvals.data.find(item => item.object_id === quote.data.id);
  assert.ok(approval);

  const selfDecision = await request(admin, `/api/approvals/${approval.id}/decision`, 'POST', { decision: 'approved', note: '自己审批' });
  assert.equal(selfDecision.status, 403);
  const decision = await request(manager, `/api/approvals/${approval.id}/decision`, 'POST', { decision: 'approved', note: '成本证据完整，同意执行' });
  assert.equal(decision.status, 200);

  const converted = await request(admin, `/api/quotes/${quote.data.id}/convert`, 'POST');
  assert.equal(converted.status, 201);
  const orderDetail = await request(admin, `/api/orders/${converted.data.id}`);
  assert.equal(orderDetail.data.items.length, 1);
  assert.equal(orderDetail.data.finance[0].type, 'receivable');

  const purchase = await request(admin, '/api/purchases', 'POST', { salesOrderId: converted.data.id, supplierId: supplier.data.id, currency: 'USD', items: [{ salesOrderItemId: orderDetail.data.items[0].id, quantity: 600, unitCost: 8.8 }] });
  assert.equal(purchase.status, 201);
  const overPurchase = await request(admin, '/api/purchases', 'POST', { salesOrderId: converted.data.id, supplierId: supplier.data.id, currency: 'USD', items: [{ salesOrderItemId: orderDetail.data.items[0].id, quantity: 500, unitCost: 8.8 }] });
  assert.equal(overPurchase.status, 422);
  const purchaseDetail = await request(admin, `/api/purchases/${purchase.data.id}`);
  assert.equal(purchaseDetail.data.items[0].quantity, 600);
  const purchaseUpdate = await request(admin, `/api/purchases/${purchase.data.id}`, 'PUT', { version: purchaseDetail.data.purchase.version, expectedAt: '2026-09-15', status: 'production', note: '原料已到厂，开始生产' });
  assert.equal(purchaseUpdate.status, 200);

  const delivery = await request(admin, '/api/deliveries', 'POST', { salesOrderId: converted.data.id, forwarder: '海程国际物流', transportMode: 'sea', currency: 'CNY', freight: 6000, items: [{ salesOrderItemId: orderDetail.data.items[0].id, quantity: 600 }] });
  assert.equal(delivery.status, 201);
  const deliveryDetail = await request(admin, `/api/deliveries/${delivery.data.id}`);
  const deliveryUpdate = await request(admin, `/api/deliveries/${delivery.data.id}`, 'PUT', { version: deliveryDetail.data.delivery.version, forwarder: '海程国际物流', transportMode: 'sea', trackingNo: 'HM-SHIP-001', plannedAt: '2026-09-20', shippedAt: '2026-09-21', status: 'arrived', note: '船舶已抵港' });
  assert.equal(deliveryUpdate.status, 200);
  const receipt = await request(admin, '/api/finance', 'POST', { salesOrderId: converted.data.id, type: 'receipt', currency: 'USD', amount: 3000, exchangeRate: 7.2, reference: 'BANK-001' });
  assert.equal(receipt.data.status, 'confirmed');
  const payment = await request(admin, '/api/finance', 'POST', { salesOrderId: converted.data.id, type: 'payment', currency: 'CNY', amount: 5000, exchangeRate: 1, reference: 'BANK-PY-001' });
  assert.equal(payment.data.status, 'pending');
  const confirmed = await request(admin, `/api/finance/${payment.data.id}/confirm`, 'POST');
  assert.equal(confirmed.status, 200);
  const afterSales = await request(admin, '/api/after-sales', 'POST', { salesOrderId: converted.data.id, type: 'quality', severity: 'medium', description: '外箱轻微挤压', responsibility: '承运商', resolution: '下批加固包装' });
  assert.equal(afterSales.status, 201);
  const attachment = await request(admin, '/api/attachments', 'POST', { objectType: 'after_sales', objectId: afterSales.data.id, fileName: 'evidence.txt', mimeType: 'text/plain', dataBase64: Buffer.from('inspection evidence').toString('base64') });
  assert.equal(attachment.status, 201);
  const attachments = await request(admin, `/api/attachments?objectType=after_sales&objectId=${afterSales.data.id}`);
  assert.equal(attachments.data.length, 1);
  const profits = await request(admin, '/api/profits');
  assert.equal(profits.data[0].grossProfit, 16600);
  const share = await request(admin, '/api/shares', 'POST', { salesOrderId: converted.data.id, beneficiaryId: 'user_sales', amount: 2000 });
  assert.equal(share.status, 201);
  const shareApprovals = await request(admin, '/api/approvals');
  const shareApproval = shareApprovals.data.find(item => item.object_id === share.data.id);
  assert.equal(shareApproval.total_steps, 2);
  const operations = await login('ops-test@hangmao.local', 'Operations@2026');
  const firstStep = await request(operations, `/api/approvals/${shareApproval.id}/decision`, 'POST', { decision: 'approved', note: '运营确认业绩归属' });
  assert.deepEqual(firstStep.data, { ok: true, complete: false });
  const finance = await login('finance@hangmao.local', 'Finance@2026');
  const secondStep = await request(finance, `/api/approvals/${shareApproval.id}/decision`, 'POST', { decision: 'approved', note: '财务复核利润口径' });
  assert.deepEqual(secondStep.data, { ok: true, complete: true });

  const voidRequest = await request(admin, `/api/purchases/${purchase.data.id}/void`, 'POST', { reason: '供应商无法按期交货，取消采购' });
  assert.equal(voidRequest.status, 202);
  const approvalsAfterVoid = await request(admin, '/api/approvals');
  const voidApproval = approvalsAfterVoid.data.find(item => item.object_type === 'purchase_order_void' && item.object_id === purchase.data.id);
  assert.ok(voidApproval);
  const voidDecision = await request(manager, `/api/approvals/${voidApproval.id}/decision`, 'POST', { decision: 'approved', note: '已确认无付款，批准作废' });
  assert.equal(voidDecision.status, 200);
  const purchasesAfterVoid = await request(admin, '/api/purchases');
  assert.equal(purchasesAfterVoid.data.some(item => item.id === purchase.data.id), true);
  assert.equal(purchasesAfterVoid.data.find(item => item.id === purchase.data.id).status, 'void');

  const orderProgress = await request(admin, `/api/orders/${converted.data.id}/status`, 'POST', { status: 'in_progress', note: '采购与物流进入执行阶段' });
  assert.equal(orderProgress.status, 200);

  const dashboard = await request(admin, '/api/dashboard');
  assert.equal(dashboard.data.metrics.customers, 1);
  assert.equal(dashboard.data.metrics.activeOrders, 1);
  assert.equal(dashboard.data.metrics.revenue, 21600);
  assert.equal(dashboard.data.metrics.grossCash, 16600);
  const logs = await request(admin, '/api/audit');
  assert.ok(logs.data.some(log => log.action === 'approved'));
  assert.ok(logs.data.some(log => log.object_type === 'sales_order'));
  const weakPassword = await request(admin, '/api/me/password', 'POST', { currentPassword: 'Admin@2026', newPassword: 'too-short' });
  assert.equal(weakPassword.status, 400);
  const changedPassword = await request(admin, '/api/me/password', 'POST', { currentPassword: 'Admin@2026', newPassword: 'Safer-Admin@2026' });
  assert.equal(changedPassword.status, 200);
});
