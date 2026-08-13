import http from 'node:http';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { db, id, docNo, now, transaction, audit } from './db.js';
import { token, tokenHash, verifyPassword, hashPassword } from './security.js';

const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || '127.0.0.1';
const publicDir = resolve('./public');
const uploadDir = resolve(process.env.ERP_UPLOAD_DIR || './uploads');
mkdirSync(uploadDir, { recursive: true });
const sessionHours = Number(process.env.ERP_SESSION_HOURS || 8);
const loginAttempts = new Map();
const writeRoles = {
  customers: ['admin', 'manager', 'sales'], suppliers: ['admin', 'manager', 'procurement'],
  products: ['admin', 'manager', 'procurement'], quotes: ['admin', 'manager', 'sales'],
  purchases: ['admin', 'manager', 'procurement'], deliveries: ['admin', 'manager', 'operations'],
  finance: ['admin', 'finance'], approvals: ['admin', 'manager', 'finance', 'operations']
};

class ApiError extends Error { constructor(status, message, details) { super(message); this.status = status; this.details = details; } }
const assert = (condition, status, message, details) => { if (!condition) throw new ApiError(status, message, details); };
const money = value => { const n = Number(value); assert(Number.isFinite(n) && n >= 0, 400, '金额格式不正确'); return Math.round(n * 100); };
const dateOrNull = value => value ? new Date(value).toISOString() : null;

function json(res, status, payload, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers });
  res.end(JSON.stringify(payload));
}
function parseCookies(req) {
  return Object.fromEntries((req.headers.cookie || '').split(';').filter(Boolean).map(v => { const i = v.indexOf('='); return [v.slice(0, i).trim(), decodeURIComponent(v.slice(i + 1))]; }));
}
async function body(req) {
  let raw = ''; for await (const chunk of req) { raw += chunk; if (raw.length > 6_000_000) throw new ApiError(413, '请求内容过大'); }
  try { return raw ? JSON.parse(raw) : {}; } catch { throw new ApiError(400, 'JSON 格式无效'); }
}
function currentUser(req) {
  const raw = parseCookies(req).erp_session;
  if (!raw) return null;
  const row = db.prepare(`SELECT s.csrf_token, s.expires_at, u.id, u.company_id, u.email, u.name, u.role
    FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.id_hash=? AND s.expires_at>? AND u.active=1`).get(tokenHash(raw), now());
  return row || null;
}
function requireUser(req) { const user = currentUser(req); assert(user, 401, '请先登录'); return user; }
function requireRole(user, roles) { assert(roles.includes(user.role), 403, '当前角色无此操作权限'); }
function requireCsrf(req, user) { assert(req.headers['x-csrf-token'] === user.csrf_token, 403, '安全令牌已失效，请刷新页面'); }
function match(path, pattern) { const m = path.match(pattern); return m || null; }
function rowPublic(row) {
  if (!row) return row;
  const out = { ...row };
  for (const key of Object.keys(out)) if (key.endsWith('_minor') && typeof out[key] === 'number') out[key.replace('_minor', '')] = out[key] / 100;
  return out;
}
function list(sql, params = []) { return db.prepare(sql).all(...params).map(rowPublic); }
function setting(companyId,key,fallback){const row=db.prepare('SELECT value_json FROM settings WHERE company_id=? AND key=?').get(companyId,key);if(!row)return fallback;try{return JSON.parse(row.value_json)}catch{return fallback}}

function createApproval(user, objectType, objectId, objectVersion, reason, assignedRole = 'manager') {
  const approvalId = id('approval');
  db.prepare(`INSERT INTO approvals VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, NULL, NULL, ?, NULL)`)
    .run(approvalId, user.company_id, docNo('AP'), objectType, objectId, objectVersion, reason, user.id, assignedRole, now());
  return approvalId;
}

function dashboard(user) {
  const company = user.company_id;
  const scalar = (sql, ...params) => db.prepare(sql).get(...params).value;
  const revenue = scalar(`SELECT COALESCE(SUM(base_amount_minor),0) value FROM finance_entries WHERE company_id=? AND type='receipt' AND status='confirmed'`, company);
  const payments = scalar(`SELECT COALESCE(SUM(base_amount_minor),0) value FROM finance_entries WHERE company_id=? AND type IN ('payment','refund') AND status='confirmed'`, company);
  return {
    metrics: {
      customers: scalar(`SELECT COUNT(*) value FROM customers WHERE company_id=? AND deleted_at IS NULL`, company),
      activeOrders: scalar(`SELECT COUNT(*) value FROM sales_orders WHERE company_id=? AND deleted_at IS NULL AND status!='closed'`, company),
      pendingApprovals: scalar(`SELECT COUNT(*) value FROM approvals WHERE company_id=? AND status='pending'`, company),
      revenue: revenue / 100, grossCash: (revenue - payments) / 100
    },
    pipeline: list(`SELECT stage label, COUNT(*) value FROM customers WHERE company_id=? AND deleted_at IS NULL GROUP BY stage`, [company]),
    recentOrders: list(`SELECT so.*, c.name customer_name FROM sales_orders so JOIN customers c ON c.id=so.customer_id WHERE so.company_id=? AND so.deleted_at IS NULL ORDER BY so.created_at DESC LIMIT 6`, [company]),
    pending: list(`SELECT a.*, u.name requester_name FROM approvals a JOIN users u ON u.id=a.requested_by WHERE a.company_id=? AND a.status='pending' ORDER BY a.created_at DESC LIMIT 6`, [company])
  };
}

async function api(req, res, url) {
  const path = url.pathname;
  if (req.method === 'GET' && path === '/api/health') return json(res, 200, { ok: true, service: '航贸云 ERP', time: now() });
  if (req.method === 'POST' && path === '/api/auth/login') {
    const input = await body(req); const key = `${req.socket.remoteAddress}:${input.email || ''}`;
    const attempt = loginAttempts.get(key); assert(!attempt || attempt.until < Date.now(), 429, '登录尝试过多，请稍后重试');
    const user = db.prepare('SELECT * FROM users WHERE email=? AND active=1').get(String(input.email || '').trim().toLowerCase());
    if (!user || !verifyPassword(String(input.password || ''), user.password_hash)) {
      const count = (attempt?.count || 0) + 1; loginAttempts.set(key, { count, until: count >= 5 ? Date.now() + 15 * 60_000 : 0 });
      throw new ApiError(401, '邮箱或密码错误');
    }
    loginAttempts.delete(key); const raw = token(); const csrf = token(); const expires = new Date(Date.now() + sessionHours * 3600_000).toISOString();
    db.prepare('INSERT INTO sessions VALUES (?, ?, ?, ?, ?)').run(tokenHash(raw), user.id, csrf, expires, now());
    audit({ companyId: user.company_id, userId: user.id, action: 'login', objectType: 'session', ip: req.socket.remoteAddress });
    return json(res, 200, { user: { id: user.id, name: user.name, email: user.email, role: user.role }, csrf }, { 'Set-Cookie': `erp_session=${raw}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${sessionHours * 3600}` });
  }
  const user = requireUser(req);
  if (req.method === 'GET' && path === '/api/me') return json(res, 200, { user: { id: user.id, name: user.name, email: user.email, role: user.role }, csrf: user.csrf_token });
  if (req.method === 'POST' && path === '/api/me/password') {
    requireCsrf(req,user);const x=await body(req);assert(String(x.newPassword||'').length>=12,400,'新密码至少 12 位');assert(/[A-Z]/.test(x.newPassword)&&/[a-z]/.test(x.newPassword)&&/\d/.test(x.newPassword)&&/[^A-Za-z0-9]/.test(x.newPassword),400,'新密码必须包含大小写字母、数字和符号');const full=db.prepare('SELECT password_hash FROM users WHERE id=?').get(user.id);assert(verifyPassword(String(x.currentPassword||''),full.password_hash),403,'当前密码错误');transaction(()=>{db.prepare('UPDATE users SET password_hash=?,updated_at=? WHERE id=?').run(hashPassword(x.newPassword),now(),user.id);db.prepare('DELETE FROM sessions WHERE user_id=? AND id_hash!=?').run(user.id,tokenHash(parseCookies(req).erp_session));audit({companyId:user.company_id,userId:user.id,action:'password_change',objectType:'user',objectId:user.id});});return json(res,200,{ok:true});
  }
  if (req.method === 'POST' && path === '/api/auth/logout') {
    requireCsrf(req, user); const raw = parseCookies(req).erp_session; db.prepare('DELETE FROM sessions WHERE id_hash=?').run(tokenHash(raw));
    return json(res, 200, { ok: true }, { 'Set-Cookie': 'erp_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0' });
  }
  if (req.method === 'GET' && path === '/api/dashboard') return json(res, 200, dashboard(user));
  if (req.method === 'GET' && path === '/api/users') return json(res, 200, list('SELECT id,name,email,role,active FROM users WHERE company_id=? ORDER BY name', [user.company_id]));
  if (req.method === 'POST' && path === '/api/users') {
    requireCsrf(req,user);requireRole(user,['admin']);const x=await body(req);assert(x.name&&x.email&&x.password&&x.role,400,'姓名、邮箱、角色和初始密码必填');assert(String(x.password).length>=10,400,'密码至少 10 位');assert(['admin','manager','sales','procurement','finance','operations'].includes(x.role),400,'角色无效');const uid=id('user');db.prepare('INSERT INTO users VALUES (?,?,?,?,?,?,1,0,NULL,?,?)').run(uid,user.company_id,String(x.email).toLowerCase(),x.name,x.role,hashPassword(x.password),now(),now());audit({companyId:user.company_id,userId:user.id,action:'create',objectType:'user',objectId:uid,after:{name:x.name,email:x.email,role:x.role}});return json(res,201,{id:uid});
  }
  if (req.method === 'GET' && path === '/api/settings') { requireRole(user,['admin','manager']);const rows=db.prepare('SELECT key,value_json,updated_at FROM settings WHERE company_id=? ORDER BY key').all(user.company_id);return json(res,200,Object.fromEntries(rows.map(r=>[r.key,{value:JSON.parse(r.value_json),updatedAt:r.updated_at}]))); }
  if (req.method === 'PUT' && path === '/api/settings') { requireCsrf(req,user);requireRole(user,['admin']);const x=await body(req);const allowed=['low_margin_bps','large_sales_order_base_minor','large_payment_base_minor','credit_days_limit','followup_overdue_days','approval_reminder_hours','approval_escalation_hours','max_share_ratio_bps','attachment_max_bytes','session_hours'];assert(allowed.includes(x.key),400,'不允许修改此配置');assert(Number.isFinite(Number(x.value))&&Number(x.value)>=0,400,'配置值无效');db.prepare(`INSERT INTO settings VALUES (?,?,?,?,?) ON CONFLICT(company_id,key) DO UPDATE SET value_json=excluded.value_json,updated_by=excluded.updated_by,updated_at=excluded.updated_at`).run(user.company_id,x.key,JSON.stringify(Number(x.value)),user.id,now());audit({companyId:user.company_id,userId:user.id,action:'configure',objectType:'setting',objectId:x.key,after:{value:Number(x.value)}});return json(res,200,{ok:true}); }

  if (req.method === 'GET' && path === '/api/customers') return json(res, 200, list(`SELECT c.*,u.name owner_name FROM customers c JOIN users u ON u.id=c.owner_id WHERE c.company_id=? AND c.deleted_at IS NULL ORDER BY c.updated_at DESC`, [user.company_id]));
  if (req.method === 'POST' && path === '/api/customers') {
    requireCsrf(req, user); requireRole(user, writeRoles.customers); const x = await body(req);
    assert(x.name && x.country, 400, '客户名称和国家必填'); assert(x.email || x.phone, 400, '邮箱和电话至少填写一项');
    const customer = { id: id('customer'), document_no: docNo('CL'), name: x.name.trim(), country: x.country.trim(), contact_name: x.contactName || '', email: x.email || '', phone: x.phone || '', stage: x.stage || 'new', level: x.level || 'B', owner_id: x.ownerId || user.id, next_action: x.nextAction || '首次联系', next_followup_at: dateOrNull(x.nextFollowupAt || Date.now() + 7 * 86400000) };
    transaction(() => {
      db.prepare(`INSERT INTO customers (id,company_id,document_no,name,country,contact_name,email,phone,stage,level,owner_id,next_action,next_followup_at,created_by,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
        .run(customer.id,user.company_id,customer.document_no,customer.name,customer.country,customer.contact_name,customer.email,customer.phone,customer.stage,customer.level,customer.owner_id,customer.next_action,customer.next_followup_at,user.id,now(),now());
      audit({companyId:user.company_id,userId:user.id,action:'create',objectType:'customer',objectId:customer.id,after:customer,ip:req.socket.remoteAddress});
    }); return json(res, 201, customer);
  }
  let m;
  if (req.method === 'POST' && (m = match(path, /^\/api\/customers\/([^/]+)\/followups$/))) {
    requireCsrf(req,user); requireRole(user,writeRoles.customers); const x=await body(req); assert(x.content&&x.nextAction&&x.nextFollowupAt,400,'跟进内容、下一动作和日期必填');
    const customer=db.prepare('SELECT * FROM customers WHERE id=? AND company_id=? AND deleted_at IS NULL').get(m[1],user.company_id); assert(customer,404,'客户不存在');
    transaction(()=>{db.prepare('INSERT INTO followups VALUES (?,?,?,?,?,?,?)').run(id('followup'),customer.id,x.content,x.nextAction,dateOrNull(x.nextFollowupAt),user.id,now());db.prepare('UPDATE customers SET next_action=?,next_followup_at=?,updated_at=?,version=version+1 WHERE id=?').run(x.nextAction,dateOrNull(x.nextFollowupAt),now(),customer.id);audit({companyId:user.company_id,userId:user.id,action:'followup',objectType:'customer',objectId:customer.id,after:x});});
    return json(res,201,{ok:true});
  }

  if (req.method === 'GET' && path === '/api/suppliers') return json(res,200,list('SELECT * FROM suppliers WHERE company_id=? AND deleted_at IS NULL ORDER BY updated_at DESC',[user.company_id]));
  if (req.method === 'POST' && path === '/api/suppliers') {
    requireCsrf(req,user);requireRole(user,writeRoles.suppliers);const x=await body(req);assert(x.name,400,'供应商名称必填');const sid=id('supplier');
    db.prepare(`INSERT INTO suppliers (id,company_id,document_no,name,country,status,risk_level,contact_name,email,phone,created_by,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(sid,user.company_id,docNo('SP'),x.name,x.country||'中国',x.status||'approved',x.riskLevel||'low',x.contactName||'',x.email||'',x.phone||'',user.id,now(),now());audit({companyId:user.company_id,userId:user.id,action:'create',objectType:'supplier',objectId:sid,after:x});return json(res,201,{id:sid});
  }
  if (req.method === 'GET' && path === '/api/products') return json(res,200,list(`SELECT p.*,s.name supplier_name FROM products p LEFT JOIN suppliers s ON s.id=p.supplier_id WHERE p.company_id=? AND p.deleted_at IS NULL ORDER BY p.updated_at DESC`,[user.company_id]));
  if (req.method === 'POST' && path === '/api/products') {
    requireCsrf(req,user);requireRole(user,writeRoles.products);const x=await body(req);assert(x.sku&&x.name&&x.category&&x.unit,400,'SKU、名称、分类和单位必填');const pid=id('product');
    db.prepare(`INSERT INTO products (id,company_id,document_no,sku,name,category,unit,moq,sale_price_minor,cost_price_minor,currency,supplier_id,created_by,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(pid,user.company_id,docNo('CP'),x.sku,x.name,x.category,x.unit,Number(x.moq||1),money(x.salePrice||0),money(x.costPrice||0),x.currency||'USD',x.supplierId||null,user.id,now(),now());audit({companyId:user.company_id,userId:user.id,action:'create',objectType:'product',objectId:pid,after:x});return json(res,201,{id:pid});
  }

  if (req.method === 'GET' && path === '/api/quotes') return json(res,200,list(`SELECT q.*,c.name customer_name FROM quotes q JOIN customers c ON c.id=q.customer_id WHERE q.company_id=? AND q.deleted_at IS NULL ORDER BY q.created_at DESC`,[user.company_id]));
  if (req.method === 'POST' && path === '/api/quotes') {
    requireCsrf(req,user);requireRole(user,writeRoles.quotes);const x=await body(req);assert(x.customerId&&Array.isArray(x.items)&&x.items.length,400,'客户和报价明细必填');assert(Number(x.exchangeRate)>0,400,'汇率必须大于 0');
    let amount=0,cost=0;for(const item of x.items){assert(Number(item.quantity)>0,400,'数量必须大于 0');amount+=Math.round(Number(item.quantity)*money(item.unitPrice));cost+=Math.round(Number(item.quantity)*money(item.unitCost));}const margin=amount?Math.round((amount-cost)/amount*10000):0;const qid=id('quote');
    transaction(()=>{db.prepare(`INSERT INTO quotes (id,company_id,document_no,customer_id,currency,exchange_rate,incoterm,payment_terms,valid_until,status,amount_minor,cost_minor,margin_bps,created_by,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,'draft',?,?,?,?,?,?)`).run(qid,user.company_id,docNo('PI'),x.customerId,x.currency||'USD',Number(x.exchangeRate),x.incoterm||'FOB',x.paymentTerms||'30% deposit, 70% before shipment',dateOrNull(x.validUntil||Date.now()+30*86400000),amount,cost,margin,user.id,now(),now());const insert=db.prepare('INSERT INTO quote_items VALUES (?,?,?,?,?,?,?,?)');x.items.forEach((item,i)=>insert.run(id('qi'),qid,item.productId||null,item.description,Number(item.quantity),money(item.unitPrice),money(item.unitCost),i));audit({companyId:user.company_id,userId:user.id,action:'create',objectType:'quote',objectId:qid,after:{...x,amount,margin}});});
    return json(res,201,{id:qid,amount:amount/100,cost:cost/100,marginBps:margin});
  }
  if (req.method === 'POST' && (m=match(path,/^\/api\/quotes\/([^/]+)\/submit$/))) {
    requireCsrf(req,user);requireRole(user,writeRoles.quotes);const quote=db.prepare('SELECT * FROM quotes WHERE id=? AND company_id=? AND deleted_at IS NULL').get(m[1],user.company_id);assert(quote,404,'报价不存在');assert(quote.status==='draft'||quote.status==='rejected',409,'当前状态不能提交');assert(quote.margin_bps>=0,422,'负毛利报价被系统拦截');
    const threshold=setting(user.company_id,'low_margin_bps',1500);const needsApproval=quote.margin_bps<threshold;transaction(()=>{db.prepare(`UPDATE quotes SET status=?,version=version+1,updated_at=? WHERE id=?`).run(needsApproval?'approval_pending':'effective',now(),quote.id);if(needsApproval)createApproval(user,'quote',quote.id,quote.version+1,`毛利率 ${(quote.margin_bps/100).toFixed(2)}% 低于 ${(threshold/100).toFixed(2)}%`);audit({companyId:user.company_id,userId:user.id,action:'submit',objectType:'quote',objectId:quote.id,before:quote,after:{status:needsApproval?'approval_pending':'effective'}});});return json(res,200,{status:needsApproval?'approval_pending':'effective'});
  }
  if (req.method === 'POST' && (m=match(path,/^\/api\/quotes\/([^/]+)\/convert$/))) {
    requireCsrf(req,user);requireRole(user,writeRoles.quotes);const quote=db.prepare(`SELECT * FROM quotes WHERE id=? AND company_id=?`).get(m[1],user.company_id);assert(quote&&quote.status==='effective',409,'只有已生效报价可以转销售合同');const existing=db.prepare('SELECT id,document_no FROM sales_orders WHERE quote_id=? AND deleted_at IS NULL').get(quote.id);assert(!existing,409,'该报价已生成销售合同');const oid=id('so');
    transaction(()=>{db.prepare(`INSERT INTO sales_orders (id,company_id,document_no,quote_id,customer_id,currency,exchange_rate,amount_minor,created_by,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(oid,user.company_id,docNo('SO'),quote.id,quote.customer_id,quote.currency,quote.exchange_rate,quote.amount_minor,user.id,now(),now());db.prepare(`INSERT INTO sales_order_items SELECT ?, ?, product_id, description, quantity, unit_price_minor, unit_cost_minor FROM quote_items WHERE id=?`);const items=db.prepare('SELECT * FROM quote_items WHERE quote_id=?').all(quote.id);const ins=db.prepare('INSERT INTO sales_order_items VALUES (?,?,?,?,?,?,?)');for(const i of items)ins.run(id('soi'),oid,i.product_id,i.description,i.quantity,i.unit_price_minor,i.unit_cost_minor);db.prepare(`INSERT INTO finance_entries (id,company_id,document_no,sales_order_id,type,currency,amount_minor,exchange_rate,base_amount_minor,status,created_by,created_at,updated_at) VALUES (?,?,?,?, 'receivable',?,?,?,?, 'confirmed',?,?,?)`).run(id('fin'),user.company_id,docNo('RE'),oid,quote.currency,quote.amount_minor,quote.exchange_rate,Math.round(quote.amount_minor*quote.exchange_rate),user.id,now(),now());audit({companyId:user.company_id,userId:user.id,action:'convert',objectType:'sales_order',objectId:oid,after:{quoteId:quote.id}});});return json(res,201,{id:oid});
  }

  if (req.method === 'GET' && path === '/api/orders') return json(res,200,list(`SELECT so.*,c.name customer_name,(SELECT COALESCE(SUM(base_amount_minor),0) FROM finance_entries f WHERE f.sales_order_id=so.id AND f.type='receipt' AND f.status='confirmed') received_base_minor FROM sales_orders so JOIN customers c ON c.id=so.customer_id WHERE so.company_id=? AND so.deleted_at IS NULL ORDER BY so.created_at DESC`,[user.company_id]));
  if (req.method === 'GET' && (m=match(path,/^\/api\/orders\/([^/]+)$/))) {
    const order=rowPublic(db.prepare(`SELECT so.*,c.name customer_name FROM sales_orders so JOIN customers c ON c.id=so.customer_id WHERE so.id=? AND so.company_id=?`).get(m[1],user.company_id));assert(order,404,'销售合同不存在');
    return json(res,200,{order,items:list('SELECT * FROM sales_order_items WHERE sales_order_id=?',[m[1]]),purchases:list('SELECT * FROM purchase_orders WHERE sales_order_id=? AND deleted_at IS NULL',[m[1]]),deliveries:list('SELECT * FROM delivery_orders WHERE sales_order_id=? AND deleted_at IS NULL',[m[1]]),finance:list('SELECT * FROM finance_entries WHERE sales_order_id=? ORDER BY created_at DESC',[m[1]]),profit:calculateProfit(m[1])});
  }
  if (req.method === 'POST' && path === '/api/purchases') {
    requireCsrf(req,user);requireRole(user,writeRoles.purchases);const x=await body(req);assert(x.salesOrderId&&x.supplierId&&Array.isArray(x.items)&&x.items.length,400,'销售合同、供应商和明细必填');const supplier=db.prepare('SELECT * FROM suppliers WHERE id=? AND company_id=?').get(x.supplierId,user.company_id);assert(supplier&&supplier.status==='approved'&&supplier.risk_level!=='blacklist',422,'供应商未准入或已列入黑名单');let total=0;const poid=id('po');
    transaction(()=>{for(const item of x.items){const ordered=db.prepare('SELECT quantity FROM sales_order_items WHERE id=? AND sales_order_id=?').get(item.salesOrderItemId,x.salesOrderId);assert(ordered,404,'销售合同明细不存在');const used=db.prepare(`SELECT COALESCE(SUM(poi.quantity),0) used FROM purchase_order_items poi JOIN purchase_orders po ON po.id=poi.purchase_order_id WHERE poi.sales_order_item_id=? AND po.status!='void'`).get(item.salesOrderItemId).used;assert(used+Number(item.quantity)<=ordered.quantity,422,'采购数量超过销售合同剩余数量');total+=Math.round(Number(item.quantity)*money(item.unitCost));}db.prepare(`INSERT INTO purchase_orders (id,company_id,document_no,sales_order_id,supplier_id,currency,amount_minor,status,expected_at,created_by,created_at,updated_at) VALUES (?,?,?,?,?,?,?,'effective',?,?,?,?)`).run(poid,user.company_id,docNo('PO'),x.salesOrderId,x.supplierId,x.currency||'CNY',total,dateOrNull(x.expectedAt),user.id,now(),now());const ins=db.prepare('INSERT INTO purchase_order_items VALUES (?,?,?,?,?)');for(const item of x.items)ins.run(id('poi'),poid,item.salesOrderItemId,Number(item.quantity),money(item.unitCost));audit({companyId:user.company_id,userId:user.id,action:'create',objectType:'purchase_order',objectId:poid,after:x});});return json(res,201,{id:poid,amount:total/100});
  }
  if (req.method === 'GET' && path === '/api/purchases') return json(res,200,list(`SELECT po.*,so.document_no sales_order_no,s.name supplier_name FROM purchase_orders po JOIN sales_orders so ON so.id=po.sales_order_id JOIN suppliers s ON s.id=po.supplier_id WHERE po.company_id=? AND po.deleted_at IS NULL ORDER BY po.created_at DESC`,[user.company_id]));
  if (req.method === 'POST' && path === '/api/deliveries') {
    requireCsrf(req,user);requireRole(user,writeRoles.deliveries);const x=await body(req);assert(x.salesOrderId&&x.forwarder&&Array.isArray(x.items)&&x.items.length,400,'销售合同、货代和明细必填');const did=id('do');transaction(()=>{for(const item of x.items){const ordered=db.prepare('SELECT quantity FROM sales_order_items WHERE id=? AND sales_order_id=?').get(item.salesOrderItemId,x.salesOrderId);assert(ordered,404,'销售合同明细不存在');const used=db.prepare(`SELECT COALESCE(SUM(di.quantity),0) used FROM delivery_order_items di JOIN delivery_orders d ON d.id=di.delivery_order_id WHERE di.sales_order_item_id=? AND d.status!='void'`).get(item.salesOrderItemId).used;assert(used+Number(item.quantity)<=ordered.quantity,422,'出运数量超过销售合同剩余数量');}db.prepare(`INSERT INTO delivery_orders (id,company_id,document_no,sales_order_id,forwarder,transport_mode,tracking_no,freight_minor,currency,status,planned_at,created_by,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,'shipped',?,?,?,?)`).run(did,user.company_id,docNo('DO'),x.salesOrderId,x.forwarder,x.transportMode||'sea',x.trackingNo||'',money(x.freight||0),x.currency||'CNY',dateOrNull(x.plannedAt),user.id,now(),now());const ins=db.prepare('INSERT INTO delivery_order_items VALUES (?,?,?,?)');for(const item of x.items)ins.run(id('doi'),did,item.salesOrderItemId,Number(item.quantity));audit({companyId:user.company_id,userId:user.id,action:'create',objectType:'delivery_order',objectId:did,after:x});});return json(res,201,{id:did});
  }
  if (req.method === 'GET' && path === '/api/deliveries') return json(res,200,list(`SELECT d.*,so.document_no sales_order_no FROM delivery_orders d JOIN sales_orders so ON so.id=d.sales_order_id WHERE d.company_id=? AND d.deleted_at IS NULL ORDER BY d.created_at DESC`,[user.company_id]));

  if (req.method === 'POST' && path === '/api/finance') {
    requireCsrf(req,user);requireRole(user,writeRoles.finance);const x=await body(req);assert(x.type&&x.currency&&Number(x.amount)>0&&Number(x.exchangeRate)>0,400,'类型、币种、金额和汇率必填');const fid=id('finance');const status=x.type==='receipt'?'confirmed':'pending';
    db.prepare(`INSERT INTO finance_entries (id,company_id,document_no,sales_order_id,purchase_order_id,delivery_order_id,type,currency,amount_minor,exchange_rate,base_amount_minor,status,occurred_at,reference,created_by,confirmed_by,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(fid,user.company_id,docNo(x.type==='receipt'?'RE':'PY'),x.salesOrderId||null,x.purchaseOrderId||null,x.deliveryOrderId||null,x.type,x.currency,money(x.amount),Number(x.exchangeRate),Math.round(money(x.amount)*Number(x.exchangeRate)),status,dateOrNull(x.occurredAt||Date.now()),x.reference||'',user.id,status==='confirmed'?user.id:null,now(),now());audit({companyId:user.company_id,userId:user.id,action:'create',objectType:'finance_entry',objectId:fid,after:x});return json(res,201,{id:fid,status});
  }
  if (req.method === 'GET' && path === '/api/finance') return json(res,200,list(`SELECT f.*,so.document_no sales_order_no FROM finance_entries f LEFT JOIN sales_orders so ON so.id=f.sales_order_id WHERE f.company_id=? ORDER BY f.created_at DESC`,[user.company_id]));
  if (req.method === 'POST' && (m=match(path,/^\/api\/finance\/([^/]+)\/confirm$/))) {
    requireCsrf(req,user);requireRole(user,writeRoles.finance);const entry=db.prepare('SELECT * FROM finance_entries WHERE id=? AND company_id=?').get(m[1],user.company_id);assert(entry&&entry.status==='pending',409,'资金流水已处理或不存在');
    const highRisk=entry.base_amount_minor>=setting(user.company_id,'large_payment_base_minor',20_000_000);assert(!highRisk||entry.created_by!==user.id,403,'大额付款登记人与确认人必须分离');
    transaction(()=>{db.prepare(`UPDATE finance_entries SET status='confirmed',confirmed_by=?,updated_at=? WHERE id=?`).run(user.id,now(),entry.id);audit({companyId:user.company_id,userId:user.id,action:'confirm',objectType:'finance_entry',objectId:entry.id,before:entry,after:{status:'confirmed'}});});return json(res,200,{ok:true});
  }

  if (req.method === 'GET' && path === '/api/after-sales') return json(res,200,list(`SELECT a.*,so.document_no sales_order_no,u.name owner_name FROM after_sales a JOIN sales_orders so ON so.id=a.sales_order_id JOIN users u ON u.id=a.owner_id WHERE a.company_id=? ORDER BY a.created_at DESC`,[user.company_id]));
  if (req.method === 'POST' && path === '/api/after-sales') {
    requireCsrf(req,user);requireRole(user,['admin','manager','sales','operations']);const x=await body(req);assert(x.salesOrderId&&x.type&&x.description,400,'销售合同、类型和问题描述必填');const aid=id('after_sales');db.prepare(`INSERT INTO after_sales (id,company_id,document_no,sales_order_id,type,severity,description,responsibility,resolution,amount_minor,currency,status,owner_id,created_by,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,'open',?,?,?,?)`).run(aid,user.company_id,docNo('AS'),x.salesOrderId,x.type,x.severity||'medium',x.description,x.responsibility||'',x.resolution||'',money(x.amount||0),x.currency||'CNY',x.ownerId||user.id,user.id,now(),now());audit({companyId:user.company_id,userId:user.id,action:'create',objectType:'after_sales',objectId:aid,after:x});return json(res,201,{id:aid});
  }

  if (req.method === 'GET' && path === '/api/profits') {
    const orders=db.prepare(`SELECT so.id,so.document_no,c.name customer_name FROM sales_orders so JOIN customers c ON c.id=so.customer_id WHERE so.company_id=? AND so.deleted_at IS NULL ORDER BY so.created_at DESC`).all(user.company_id);
    return json(res,200,orders.map(o=>({...o,...calculateProfit(o.id)})));
  }
  if (req.method === 'GET' && path === '/api/shares') return json(res,200,list(`SELECT ps.*,so.document_no sales_order_no,u.name beneficiary_name FROM performance_shares ps JOIN sales_orders so ON so.id=ps.sales_order_id JOIN users u ON u.id=ps.beneficiary_id WHERE ps.company_id=? ORDER BY ps.created_at DESC`,[user.company_id]));
  if (req.method === 'POST' && path === '/api/shares') {
    requireCsrf(req,user);requireRole(user,['admin','manager']);const x=await body(req);assert(x.salesOrderId&&x.beneficiaryId&&Number(x.amount)>0,400,'合同、受益人和分配金额必填');const profit=calculateProfit(x.salesOrderId);assert(profit&&profit.grossProfit>0,422,'当前订单没有可分配正毛利');const existing=db.prepare(`SELECT COALESCE(SUM(amount_base_minor),0) v FROM performance_shares WHERE sales_order_id=? AND status!='void'`).get(x.salesOrderId).v;const amount=money(x.amount);const ratio=setting(user.company_id,'max_share_ratio_bps',4000)/10000;assert(existing+amount<=Math.round(profit.grossProfit*100*ratio),422,`员工分配累计不得超过当前毛利的 ${(ratio*100).toFixed(0)}%`);const sid=id('share');db.prepare(`INSERT INTO performance_shares VALUES (?,?,?,?,?,?, 'approval_pending', ?, ?, ?)`).run(sid,user.company_id,docNo('PS'),x.salesOrderId,x.beneficiaryId,amount,user.id,now(),now());createApproval(user,'performance_share',sid,1,'业绩分成申请','operations');audit({companyId:user.company_id,userId:user.id,action:'create',objectType:'performance_share',objectId:sid,after:x});return json(res,201,{id:sid});
  }

  if (req.method === 'POST' && path === '/api/attachments') {
    requireCsrf(req,user);const x=await body(req);assert(x.objectType&&x.objectId&&x.fileName&&x.mimeType&&x.dataBase64,400,'附件信息不完整');const bytes=Buffer.from(x.dataBase64,'base64');const maxBytes=setting(user.company_id,'attachment_max_bytes',4*1024*1024);assert(bytes.length>0&&bytes.length<=maxBytes,413,`附件必须小于 ${Math.round(maxBytes/1024/1024)}MB`);assert(['application/pdf','image/png','image/jpeg','text/plain'].includes(x.mimeType),415,'不支持此附件类型');const sha=tokenHash(bytes);const storage=`${crypto.randomUUID()}.bin`;writeFileSync(join(uploadDir,storage),bytes,{mode:0o600});const attachmentId=id('attachment');db.prepare('INSERT INTO attachments VALUES (?,?,?,?,?,?,?,?,?,?,?)').run(attachmentId,user.company_id,x.objectType,x.objectId,x.fileName,x.mimeType,bytes.length,sha,storage,user.id,now());audit({companyId:user.company_id,userId:user.id,action:'upload',objectType:x.objectType,objectId:x.objectId,after:{fileName:x.fileName,size:bytes.length,sha}});return json(res,201,{id:attachmentId,sha256:sha,sizeBytes:bytes.length});
  }
  if (req.method === 'GET' && path === '/api/attachments') { const type=url.searchParams.get('objectType'),objectId=url.searchParams.get('objectId');assert(type&&objectId,400,'缺少附件对象');return json(res,200,list('SELECT id,file_name,mime_type,size_bytes,sha256,uploaded_by,created_at FROM attachments WHERE company_id=? AND object_type=? AND object_id=? ORDER BY created_at DESC',[user.company_id,type,objectId])); }
  if (req.method === 'GET' && (m=match(path,/^\/api\/attachments\/([^/]+)\/download$/))) {const a=db.prepare('SELECT * FROM attachments WHERE id=? AND company_id=?').get(m[1],user.company_id);assert(a&&existsSync(join(uploadDir,a.storage_name)),404,'附件不存在');audit({companyId:user.company_id,userId:user.id,action:'download',objectType:a.object_type,objectId:a.object_id});res.writeHead(200,{'Content-Type':a.mime_type,'Content-Disposition':`attachment; filename*=UTF-8''${encodeURIComponent(a.file_name)}`,'X-Content-Type-Options':'nosniff'});return res.end(readFileSync(join(uploadDir,a.storage_name)));}

  if (req.method === 'GET' && path === '/api/approvals') return json(res,200,list(`SELECT a.*,u.name requester_name,d.name decider_name FROM approvals a JOIN users u ON u.id=a.requested_by LEFT JOIN users d ON d.id=a.decided_by WHERE a.company_id=? ORDER BY a.created_at DESC`,[user.company_id]));
  if (req.method === 'POST' && (m=match(path,/^\/api\/approvals\/([^/]+)\/decision$/))) {
    requireCsrf(req,user);requireRole(user,writeRoles.approvals);const x=await body(req);assert(['approved','rejected'].includes(x.decision),400,'审批决定无效');assert(x.note,400,'审批意见必填');const approval=db.prepare('SELECT * FROM approvals WHERE id=? AND company_id=?').get(m[1],user.company_id);assert(approval&&approval.status==='pending',409,'审批已处理或不存在');assert(approval.requested_by!==user.id,403,'申请人不能审批自己');assert(user.role==='admin'||user.role===approval.assigned_role||user.role==='manager',403,'当前角色不是此节点审批人');
    transaction(()=>{db.prepare('UPDATE approvals SET status=?,decided_by=?,decision_note=?,decided_at=? WHERE id=?').run(x.decision,user.id,x.note,now(),approval.id);if(approval.object_type==='quote'){const q=db.prepare('SELECT version FROM quotes WHERE id=?').get(approval.object_id);assert(q&&q.version===approval.object_version,409,'报价版本已变化，必须重新提交审批');db.prepare('UPDATE quotes SET status=?,approved_version=?,updated_at=? WHERE id=?').run(x.decision==='approved'?'effective':'rejected',x.decision==='approved'?q.version:null,now(),approval.object_id);}if(approval.object_type==='performance_share')db.prepare('UPDATE performance_shares SET status=?,updated_at=? WHERE id=?').run(x.decision==='approved'?'approved':'rejected',now(),approval.object_id);audit({companyId:user.company_id,userId:user.id,action:x.decision,objectType:'approval',objectId:approval.id,before:approval,after:x});});return json(res,200,{ok:true});
  }
  if (req.method === 'GET' && path === '/api/audit') { requireRole(user,['admin','manager','finance']); return json(res,200,list(`SELECT a.*,u.name user_name FROM audit_logs a LEFT JOIN users u ON u.id=a.user_id WHERE a.company_id=? ORDER BY a.created_at DESC LIMIT 200`,[user.company_id])); }
  if (req.method === 'GET' && path === '/api/export/orders.csv') {
    requireRole(user,['admin','manager','finance']);const rows=list(`SELECT so.document_no,c.name customer,so.currency,so.amount_minor/100.0 amount,so.status,so.created_at FROM sales_orders so JOIN customers c ON c.id=so.customer_id WHERE so.company_id=? AND so.deleted_at IS NULL ORDER BY so.created_at`,[user.company_id]);const esc=v=>`"${String(v??'').replaceAll('"','""')}"`;const csv=['单号,客户,币种,金额,状态,创建时间',...rows.map(r=>[r.document_no,r.customer,r.currency,r.amount,r.status,r.created_at].map(esc).join(','))].join('\n');audit({companyId:user.company_id,userId:user.id,action:'export',objectType:'sales_orders'});res.writeHead(200,{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="orders.csv"'});return res.end('\ufeff'+csv);
  }
  throw new ApiError(404,'接口不存在');
}

function calculateProfit(orderId) {
  const order=db.prepare('SELECT * FROM sales_orders WHERE id=?').get(orderId);if(!order)return null;
  const revenue=db.prepare(`SELECT COALESCE(SUM(base_amount_minor),0) v FROM finance_entries WHERE sales_order_id=? AND type='receipt' AND status='confirmed'`).get(orderId).v;
  const cost=db.prepare(`SELECT COALESCE(SUM(base_amount_minor),0) v FROM finance_entries WHERE sales_order_id=? AND type='payment' AND status='confirmed'`).get(orderId).v;
  const refund=db.prepare(`SELECT COALESCE(SUM(base_amount_minor),0) v FROM finance_entries WHERE sales_order_id=? AND type='refund' AND status='confirmed'`).get(orderId).v;
  return {revenue:revenue/100,cost:cost/100,refund:refund/100,grossProfit:(revenue-cost-refund)/100,margin:revenue?((revenue-cost-refund)/revenue*100):0};
}

function staticFile(req,res,url){let path=url.pathname==='/'?'/index.html':url.pathname;assert(!path.includes('..'),400,'路径无效');const file=join(publicDir,path);assert(existsSync(file),404,'页面不存在');const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml'}[extname(file)]||'application/octet-stream';res.writeHead(200,{'Content-Type':mime,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'same-origin','Content-Security-Policy':"default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'"});res.end(readFileSync(file));}

export const server=http.createServer(async(req,res)=>{try{const url=new URL(req.url,`http://${req.headers.host||'localhost'}`);if(url.pathname.startsWith('/api/'))await api(req,res,url);else staticFile(req,res,url);}catch(error){const status=error.status||500;if(status>=500)console.error(error);json(res,status,{error:error.message||'服务器错误',details:error.details});}});
if(process.env.NODE_ENV!=='test')server.listen(PORT,HOST,()=>console.log(`航贸云 ERP 已启动：http://${HOST}:${PORT}`));
