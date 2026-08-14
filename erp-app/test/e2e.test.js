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
  const operations = await login('ops-test@hangmao.local', 'Operations@2026');
  const finance = await login('finance@hangmao.local', 'Finance@2026');

  const supplier = await request(admin, '/api/suppliers', 'POST', { name: '宁波精工制造', country: '中国', contactName: '王工', phone: '13800000000', wechat: 'nb-jinggong', shopUrl: 'https://example.com/store', address: '宁波市北仑区', mainCategories: '户外照明,小家电', taxNo: '91330200TEST', bankName: '中国银行宁波分行', bankAccount: '6222-TEST', paymentTerms: '30% 定金，70% 出货前', cooperationNotes: '交期稳定，包装需抽检', riskLevel: 'low' });
  assert.equal(supplier.status, 201);
  const product = await request(admin, '/api/products', 'POST', { sku: 'HM-001', name: '折叠露营灯', category: '户外照明', specifications: '双色温 / USB-C / 4000mAh', unit: 'pcs', salePrice: 12, costPrice: 9, currency: 'USD', supplierId: supplier.data.id, supplierSku: 'NB-LAMP-01', leadDays: 25, imageUrl: 'https://example.com/lamp.jpg', qrCode: 'HM-001', notes: '礼盒包装' });
  assert.equal(product.status, 201);
  const secondSupplier = await request(admin, '/api/suppliers', 'POST', { name: '义乌星光电器', country: '中国', phone: '13900000000', riskLevel: 'medium' });
  const supplierQuote = await request(admin, `/api/products/${product.data.id}/supplier-quotes`, 'POST', { supplierId: secondSupplier.data.id, supplierSku: 'YW-STAR-88', currency: 'USD', unitCost: 8.7, moq: 500, leadDays: 20, validUntil: '2026-10-01', isPreferred: true });
  assert.equal(supplierQuote.status, 201);
  const productDetail = await request(admin, `/api/products/${product.data.id}`);
  assert.equal(productDetail.data.supplierQuotes.length, 2);
  assert.equal(productDetail.data.product.specifications, '双色温 / USB-C / 4000mAh');
  const customer = await request(admin, '/api/customers', 'POST', { name: 'Nordlicht GmbH', companyName: 'Nordlicht Europe GmbH', contactName: 'Anna', country: '德国', email: 'anna@nordlicht.example', whatsapp: '+49 170 0000000', source: 'exhibition', sourceDetail: '科隆户外用品展', website: 'https://nordlicht.example', tags: '德国,A级,户外', coreNeeds: '春季露营新品', projectBackground: '连锁零售渠道', followupNotes: '重视环保包装', shippingAddress: 'Hamburg, Germany', nextFollowupAt: '2026-08-20' });
  assert.equal(customer.status, 201);
  const customerDetail = await request(admin, `/api/customers/${customer.data.id}`);
  assert.equal(customerDetail.data.customer.name, 'Nordlicht GmbH');
  assert.equal(customerDetail.data.customer.source, 'exhibition');
  const customerUpdate = await request(admin, `/api/customers/${customer.data.id}`, 'PUT', { version: customerDetail.data.customer.version, name: 'Nordlicht Europe GmbH', country: '德国', contactName: 'Anna', email: 'anna@nordlicht.example', stage: 'contacted', level: 'A', nextAction: '发送样品方案', nextFollowupAt: '2026-08-01' });
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
  const managerNotices = await request(manager, '/api/notifications');
  assert.ok(managerNotices.data.items.some(item => item.type === 'approval_todo'));

  const selfDecision = await request(admin, `/api/approvals/${approval.id}/decision`, 'POST', { decision: 'approved', note: '自己审批' });
  assert.equal(selfDecision.status, 403);
  const decision = await request(manager, `/api/approvals/${approval.id}/decision`, 'POST', { decision: 'approved', note: '成本证据完整，同意执行' });
  assert.equal(decision.status, 200);
  const withdrawQuote = await request(admin, '/api/quotes', 'POST', { customerId: customer.data.id, currency: 'USD', exchangeRate: 7.2, incoterm: 'FOB', validUntil: '2026-09-02', items: [{ productId: product.data.id, description: '撤回测试报价', quantity: 10, unitPrice: 10, unitCost: 9 }] });
  await request(admin, `/api/quotes/${withdrawQuote.data.id}/submit`, 'POST');
  const withdrawApprovals = await request(admin, '/api/approvals?scope=mine');
  const withdrawApproval = withdrawApprovals.data.find(item => item.object_id === withdrawQuote.data.id);
  const withdrawn = await request(admin, `/api/approvals/${withdrawApproval.id}/withdraw`, 'POST');
  assert.equal(withdrawn.status, 200);
  const withdrawnQuoteDetail = await request(admin, `/api/quotes/${withdrawQuote.data.id}`);
  assert.equal(withdrawnQuoteDetail.data.quote.status, 'draft');

  const converted = await request(admin, `/api/quotes/${quote.data.id}/convert`, 'POST');
  assert.equal(converted.status, 201);
  const draftOrder = await request(admin, `/api/orders/${converted.data.id}`);
  assert.equal(draftOrder.data.order.document_status, 'draft');
  assert.equal(draftOrder.data.finance.length, 0);
  const orderSubmitted = await request(admin, `/api/orders/${converted.data.id}/submit`, 'POST');
  assert.equal(orderSubmitted.data.status, 'approval_pending');
  const managerTodo = await request(manager, '/api/approvals?scope=todo');
  assert.ok(managerTodo.data.some(item => item.object_type === 'sales_order' && item.object_id === converted.data.id));
  const orderApprovals = await request(admin, '/api/approvals');
  const orderApproval = orderApprovals.data.find(item => item.object_type === 'sales_order' && item.object_id === converted.data.id);
  const orderFirstApproval = await request(manager, `/api/approvals/${orderApproval.id}/decision`, 'POST', { decision: 'approved', note: '合同金额及条款核对无误' });
  assert.equal(orderFirstApproval.data.complete, false);
  const orderSecondApproval = await request(operations, `/api/approvals/${orderApproval.id}/decision`, 'POST', { decision: 'approved', note: '运营确认可以进入履约' });
  assert.equal(orderSecondApproval.data.complete, true);
  const orderDetail = await request(admin, `/api/orders/${converted.data.id}`);
  assert.equal(orderDetail.data.items.length, 1);
  assert.equal(orderDetail.data.finance[0].type, 'receivable');
  const procurementPending = await request(admin, '/api/procurement/pending');
  const deliveryPending = await request(admin, '/api/delivery/pending');
  assert.equal(procurementPending.data[0].remaining_quantity, 1000);
  assert.equal(deliveryPending.data[0].remaining_quantity, 1000);

  const purchase = await request(admin, '/api/purchases', 'POST', { salesOrderId: converted.data.id, supplierId: supplier.data.id, currency: 'USD', orderedAt: '2026-08-14', procurementMethod: 'direct', taxIncluded: true, taxRate: 13, paymentTerms: '30% 定金，70% 出货前', notes: '首批验货后付尾款', expenses: [{ name: '国内运费', category: 'freight', amount: 100 }], items: [{ salesOrderItemId: orderDetail.data.items[0].id, quantity: 600, unitCost: 8.8 }] });
  assert.equal(purchase.status, 201);
  const overPurchase = await request(admin, '/api/purchases', 'POST', { salesOrderId: converted.data.id, supplierId: supplier.data.id, currency: 'USD', items: [{ salesOrderItemId: orderDetail.data.items[0].id, quantity: 500, unitCost: 8.8 }] });
  assert.equal(overPurchase.status, 422);
  const procurementPendingAfter = await request(admin, '/api/procurement/pending');
  assert.equal(procurementPendingAfter.data[0].remaining_quantity, 400);
  const purchaseDetail = await request(admin, `/api/purchases/${purchase.data.id}`);
  assert.equal(purchaseDetail.data.items[0].quantity, 600);
  assert.equal(purchaseDetail.data.expenses[0].amount, 100);
  assert.equal(purchaseDetail.data.purchase.document_status, 'draft');
  const purchaseSubmitted = await request(admin, `/api/purchases/${purchase.data.id}/submit`, 'POST');
  assert.equal(purchaseSubmitted.data.status, 'approval_pending');
  const purchaseApprovals = await request(admin, '/api/approvals');
  const purchaseApproval = purchaseApprovals.data.find(item => item.object_type === 'purchase_order' && item.object_id === purchase.data.id);
  await request(manager, `/api/approvals/${purchaseApproval.id}/decision`, 'POST', { decision: 'approved', note: '采购数量与成本合理' });
  const purchaseFinalApproval = await request(finance, `/api/approvals/${purchaseApproval.id}/decision`, 'POST', { decision: 'approved', note: '财务确认付款口径' });
  assert.equal(purchaseFinalApproval.data.complete, true);
  const purchaseApprovedDetail = await request(admin, `/api/purchases/${purchase.data.id}`);
  const purchaseUpdate = await request(admin, `/api/purchases/${purchase.data.id}`, 'PUT', { version: purchaseApprovedDetail.data.purchase.version, expectedAt: '2026-09-15', status: 'production', note: '原料已到厂，开始生产' });
  assert.equal(purchaseUpdate.status, 200);

  const delivery = await request(admin, '/api/deliveries', 'POST', { salesOrderId: converted.data.id, forwarder: '海程国际物流', transportMode: 'sea', currency: 'CNY', freight: 6000, originLocation: '宁波港', incoterm: 'FOB', packageMaterials: '五层瓦楞纸箱 + 托盘', packageCount: 50, grossWeight: 820, volumeCbm: 6.5, notes: '需要拍装柜照片', expenses: [{ name: '进仓费', category: 'warehouse', amount: 200 }], items: [{ salesOrderItemId: orderDetail.data.items[0].id, quantity: 600 }] });
  assert.equal(delivery.status, 201);
  const deliveryDetail = await request(admin, `/api/deliveries/${delivery.data.id}`);
  assert.equal(deliveryDetail.data.delivery.package_count, 50);
  assert.equal(deliveryDetail.data.expenses[0].amount, 200);
  const deliveryPendingAfter = await request(admin, '/api/delivery/pending');
  assert.equal(deliveryPendingAfter.data[0].remaining_quantity, 400);
  const deliverySubmitted = await request(admin, `/api/deliveries/${delivery.data.id}/submit`, 'POST');
  assert.equal(deliverySubmitted.data.status, 'approval_pending');
  const deliveryApprovals = await request(admin, '/api/approvals');
  const deliveryApproval = deliveryApprovals.data.find(item => item.object_type === 'delivery_order' && item.object_id === delivery.data.id);
  await request(manager, `/api/approvals/${deliveryApproval.id}/decision`, 'POST', { decision: 'approved', note: '物流费用和包装资料完整' });
  await request(operations, `/api/approvals/${deliveryApproval.id}/decision`, 'POST', { decision: 'approved', note: '运营确认订舱资料' });
  const deliveryApprovedDetail = await request(admin, `/api/deliveries/${delivery.data.id}`);
  const deliveryUpdate = await request(admin, `/api/deliveries/${delivery.data.id}`, 'PUT', { version: deliveryApprovedDetail.data.delivery.version, forwarder: '海程国际物流', transportMode: 'sea', trackingNo: 'HM-SHIP-001', plannedAt: '2026-09-20', shippedAt: '2026-09-21', status: 'arrived', note: '船舶已抵港' });
  assert.equal(deliveryUpdate.status, 200);
  const workbench = await request(admin, '/api/finance/workbench');
  const receivableSchedule = workbench.data.receivables.find(item => item.object_id === converted.data.id);
  const deliverySchedule = workbench.data.payables.find(item => item.object_id === delivery.data.id);
  assert.equal(receivableSchedule.outstanding, 10000);
  assert.equal(deliverySchedule.outstanding, 6200);
  const receipt = await request(admin, '/api/finance', 'POST', { scheduleId: receivableSchedule.id, type: 'receipt', currency: 'USD', amount: 3000, exchangeRate: 7.2, paymentChannel: 'bank', reference: 'BANK-001', note: '30% 定金' });
  assert.equal(receipt.data.status, 'confirmed');
  const payment = await request(admin, '/api/finance', 'POST', { scheduleId: deliverySchedule.id, type: 'payment', currency: 'CNY', amount: 5000, exchangeRate: 1, paymentChannel: 'bank', reference: 'BANK-PY-001', note: '货代首付款' });
  assert.equal(payment.data.status, 'pending');
  const confirmed = await request(admin, `/api/finance/${payment.data.id}/confirm`, 'POST');
  assert.equal(confirmed.status, 200);
  const workbenchAfter = await request(admin, '/api/finance/workbench');
  assert.equal(workbenchAfter.data.receivables.find(item => item.id === receivableSchedule.id).outstanding, 7000);
  assert.equal(workbenchAfter.data.payables.find(item => item.id === deliverySchedule.id).outstanding, 1200);
  const exchangeReceipt = await request(admin, '/api/finance', 'POST', { scheduleId: receivableSchedule.id, type: 'receipt', currency: 'USD', amount: 100, exchangeRate: 7.3, paymentChannel: 'bank', reference: 'BANK-FX-001', note: '测试结算汇率差异' });
  assert.equal(exchangeReceipt.data.status, 'confirmed');
  assert.equal(exchangeReceipt.data.exchangeDifference, 10);
  const withExchange = await request(admin, '/api/finance/workbench');
  assert.equal(withExchange.data.summary.exchangeDifference, 10);
  assert.equal(withExchange.data.receivables.find(item => item.id === receivableSchedule.id).outstanding, 6900);
  const reversed = await request(finance, `/api/finance/${exchangeReceipt.data.id}/reverse`, 'POST', { reason: '测试重复入账冲正' });
  assert.equal(reversed.status, 201);
  const afterReversal = await request(admin, '/api/finance/workbench');
  assert.equal(afterReversal.data.summary.exchangeDifference, 0);
  assert.equal(afterReversal.data.receivables.find(item => item.id === receivableSchedule.id).outstanding, 7000);
  assert.equal(afterReversal.data.history.find(item => item.id === exchangeReceipt.data.id).status, 'reversed');
  assert.ok(afterReversal.data.history.some(item => item.reversal_of_id === exchangeReceipt.data.id && item.status === 'reversal'));
  const notices = await request(admin, '/api/notifications');
  assert.ok(notices.data.items.some(item => item.type === 'followup_overdue'));
  const afterSales = await request(admin, '/api/after-sales', 'POST', { salesOrderId: converted.data.id, type: 'quality', severity: 'medium', description: '外箱轻微挤压', responsibility: '承运商', resolution: '下批加固包装' });
  assert.equal(afterSales.status, 201);
  const attachment = await request(admin, '/api/attachments', 'POST', { objectType: 'after_sales', objectId: afterSales.data.id, fileName: 'evidence.txt', mimeType: 'text/plain', dataBase64: Buffer.from('inspection evidence').toString('base64') });
  assert.equal(attachment.status, 201);
  const attachments = await request(admin, `/api/attachments?objectType=after_sales&objectId=${afterSales.data.id}`);
  assert.equal(attachments.data.length, 1);
  const profits = await request(admin, '/api/profits');
  assert.equal(profits.data[0].grossProfit, 16600);
  const share = await request(admin, '/api/shares', 'POST', { salesOrderId: converted.data.id, beneficiaryId: 'user_sales', amount: 2000, applicationMonth: '2026-08', customerConfirmedAt: '2026-08-28', notes: '客户已确认本月业绩归属', evidenceRef: 'CONFIRM-2026-08-001' });
  assert.equal(share.status, 201);
  assert.ok(share.data.allocationPercent > 0);
  const allocationBeforeApproval = await request(admin, '/api/performance/workbench?month=2026-08');
  assert.equal(allocationBeforeApproval.data.summary.pendingApproval, 1);
  assert.equal(allocationBeforeApproval.data.people[0].beneficiary_id, 'user_sales');
  assert.equal(allocationBeforeApproval.data.shares[0].evidence_ref, 'CONFIRM-2026-08-001');
  const shareApprovals = await request(admin, '/api/approvals');
  const shareApproval = shareApprovals.data.find(item => item.object_id === share.data.id);
  assert.equal(shareApproval.total_steps, 2);
  const firstStep = await request(operations, `/api/approvals/${shareApproval.id}/decision`, 'POST', { decision: 'approved', note: '运营确认业绩归属' });
  assert.deepEqual(firstStep.data, { ok: true, complete: false });
  const secondStep = await request(finance, `/api/approvals/${shareApproval.id}/decision`, 'POST', { decision: 'approved', note: '财务复核利润口径' });
  assert.deepEqual(secondStep.data, { ok: true, complete: true });
  const allocationAfterApproval = await request(admin, '/api/performance/workbench?month=2026-08');
  assert.equal(allocationAfterApproval.data.summary.pendingApproval, 0);
  assert.equal(allocationAfterApproval.data.summary.pendingPayment, 1);
  assert.equal(allocationAfterApproval.data.shares[0].settlement_status, 'outstanding');

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
