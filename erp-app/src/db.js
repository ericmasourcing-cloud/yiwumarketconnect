import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { hashPassword } from './security.js';

const dataDir = resolve(process.env.ERP_DATA_DIR || './data');
mkdirSync(dataDir, { recursive: true });
export const db = new DatabaseSync(resolve(dataDir, 'erp.sqlite'));
db.exec('PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;');

export function now() { return new Date().toISOString(); }
export function id(prefix) { return `${prefix}_${crypto.randomUUID()}`; }
export function docNo(prefix) {
  const stamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
  return `${prefix}-${stamp}-${Math.floor(Math.random() * 900 + 100)}`;
}

db.exec(`
CREATE TABLE IF NOT EXISTS companies (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, base_currency TEXT NOT NULL DEFAULT 'CNY', created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, company_id TEXT NOT NULL REFERENCES companies(id), email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('admin','manager','sales','procurement','finance','operations')),
  password_hash TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1, failed_attempts INTEGER NOT NULL DEFAULT 0,
  locked_until TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  id_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), csrf_token TEXT NOT NULL,
  expires_at TEXT NOT NULL, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY, company_id TEXT NOT NULL REFERENCES companies(id), document_no TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL, country TEXT NOT NULL, contact_name TEXT, email TEXT, phone TEXT, stage TEXT NOT NULL DEFAULT 'new',
  level TEXT NOT NULL DEFAULT 'B', owner_id TEXT NOT NULL REFERENCES users(id), next_action TEXT, next_followup_at TEXT,
  version INTEGER NOT NULL DEFAULT 1, created_by TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, deleted_at TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_customer_identity ON customers(company_id, name, country) WHERE deleted_at IS NULL;
CREATE TABLE IF NOT EXISTS followups (
  id TEXT PRIMARY KEY, customer_id TEXT NOT NULL REFERENCES customers(id), content TEXT NOT NULL,
  next_action TEXT NOT NULL, next_followup_at TEXT NOT NULL, created_by TEXT NOT NULL, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS suppliers (
  id TEXT PRIMARY KEY, company_id TEXT NOT NULL REFERENCES companies(id), document_no TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL, country TEXT NOT NULL DEFAULT '中国', status TEXT NOT NULL DEFAULT 'approved', risk_level TEXT NOT NULL DEFAULT 'low',
  contact_name TEXT, email TEXT, phone TEXT, bank_account_masked TEXT, version INTEGER NOT NULL DEFAULT 1,
  created_by TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, deleted_at TEXT
);
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY, company_id TEXT NOT NULL REFERENCES companies(id), document_no TEXT NOT NULL UNIQUE,
  sku TEXT NOT NULL, name TEXT NOT NULL, category TEXT NOT NULL, unit TEXT NOT NULL, moq REAL NOT NULL DEFAULT 1,
  sale_price_minor INTEGER NOT NULL DEFAULT 0, cost_price_minor INTEGER NOT NULL DEFAULT 0, currency TEXT NOT NULL DEFAULT 'USD',
  supplier_id TEXT REFERENCES suppliers(id), status TEXT NOT NULL DEFAULT 'active', version INTEGER NOT NULL DEFAULT 1,
  created_by TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, deleted_at TEXT,
  UNIQUE(company_id, sku)
);
CREATE TABLE IF NOT EXISTS quotes (
  id TEXT PRIMARY KEY, company_id TEXT NOT NULL REFERENCES companies(id), document_no TEXT NOT NULL UNIQUE,
  customer_id TEXT NOT NULL REFERENCES customers(id), currency TEXT NOT NULL, exchange_rate REAL NOT NULL,
  incoterm TEXT NOT NULL, payment_terms TEXT NOT NULL, valid_until TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'draft',
  amount_minor INTEGER NOT NULL DEFAULT 0, cost_minor INTEGER NOT NULL DEFAULT 0, margin_bps INTEGER NOT NULL DEFAULT 0,
  version INTEGER NOT NULL DEFAULT 1, approved_version INTEGER, created_by TEXT NOT NULL, created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL, deleted_at TEXT
);
CREATE TABLE IF NOT EXISTS quote_items (
  id TEXT PRIMARY KEY, quote_id TEXT NOT NULL REFERENCES quotes(id) ON DELETE CASCADE, product_id TEXT REFERENCES products(id),
  description TEXT NOT NULL, quantity REAL NOT NULL CHECK(quantity > 0), unit_price_minor INTEGER NOT NULL CHECK(unit_price_minor >= 0),
  unit_cost_minor INTEGER NOT NULL CHECK(unit_cost_minor >= 0), sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS sales_orders (
  id TEXT PRIMARY KEY, company_id TEXT NOT NULL REFERENCES companies(id), document_no TEXT NOT NULL UNIQUE,
  quote_id TEXT REFERENCES quotes(id), customer_id TEXT NOT NULL REFERENCES customers(id), currency TEXT NOT NULL,
  exchange_rate REAL NOT NULL, amount_minor INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'effective', payment_status TEXT NOT NULL DEFAULT 'unpaid',
  procurement_status TEXT NOT NULL DEFAULT 'pending', delivery_status TEXT NOT NULL DEFAULT 'pending', version INTEGER NOT NULL DEFAULT 1,
  created_by TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, deleted_at TEXT
);
CREATE TABLE IF NOT EXISTS sales_order_items (
  id TEXT PRIMARY KEY, sales_order_id TEXT NOT NULL REFERENCES sales_orders(id), product_id TEXT REFERENCES products(id),
  description TEXT NOT NULL, quantity REAL NOT NULL, unit_price_minor INTEGER NOT NULL, unit_cost_minor INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS purchase_orders (
  id TEXT PRIMARY KEY, company_id TEXT NOT NULL REFERENCES companies(id), document_no TEXT NOT NULL UNIQUE,
  sales_order_id TEXT NOT NULL REFERENCES sales_orders(id), supplier_id TEXT NOT NULL REFERENCES suppliers(id), currency TEXT NOT NULL,
  amount_minor INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'draft', expected_at TEXT, version INTEGER NOT NULL DEFAULT 1,
  created_by TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, deleted_at TEXT
);
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id TEXT PRIMARY KEY, purchase_order_id TEXT NOT NULL REFERENCES purchase_orders(id), sales_order_item_id TEXT NOT NULL REFERENCES sales_order_items(id),
  quantity REAL NOT NULL CHECK(quantity > 0), unit_cost_minor INTEGER NOT NULL CHECK(unit_cost_minor >= 0)
);
CREATE TABLE IF NOT EXISTS delivery_orders (
  id TEXT PRIMARY KEY, company_id TEXT NOT NULL REFERENCES companies(id), document_no TEXT NOT NULL UNIQUE,
  sales_order_id TEXT NOT NULL REFERENCES sales_orders(id), forwarder TEXT NOT NULL, transport_mode TEXT NOT NULL,
  tracking_no TEXT, freight_minor INTEGER NOT NULL DEFAULT 0, currency TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'draft',
  planned_at TEXT, shipped_at TEXT, version INTEGER NOT NULL DEFAULT 1, created_by TEXT NOT NULL, created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL, deleted_at TEXT
);
CREATE TABLE IF NOT EXISTS delivery_order_items (
  id TEXT PRIMARY KEY, delivery_order_id TEXT NOT NULL REFERENCES delivery_orders(id), sales_order_item_id TEXT NOT NULL REFERENCES sales_order_items(id),
  quantity REAL NOT NULL CHECK(quantity > 0)
);
CREATE TABLE IF NOT EXISTS finance_entries (
  id TEXT PRIMARY KEY, company_id TEXT NOT NULL REFERENCES companies(id), document_no TEXT NOT NULL UNIQUE,
  sales_order_id TEXT REFERENCES sales_orders(id), purchase_order_id TEXT REFERENCES purchase_orders(id), delivery_order_id TEXT REFERENCES delivery_orders(id),
  type TEXT NOT NULL CHECK(type IN ('receivable','receipt','payable','payment','refund','recovery')),
  currency TEXT NOT NULL, amount_minor INTEGER NOT NULL CHECK(amount_minor > 0), exchange_rate REAL NOT NULL,
  base_amount_minor INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'pending', occurred_at TEXT, reference TEXT,
  created_by TEXT NOT NULL, confirmed_by TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS approvals (
  id TEXT PRIMARY KEY, company_id TEXT NOT NULL REFERENCES companies(id), document_no TEXT NOT NULL UNIQUE,
  object_type TEXT NOT NULL, object_id TEXT NOT NULL, object_version INTEGER NOT NULL, reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', requested_by TEXT NOT NULL REFERENCES users(id), assigned_role TEXT NOT NULL,
  decided_by TEXT REFERENCES users(id), decision_note TEXT, created_at TEXT NOT NULL, decided_at TEXT
);
CREATE TABLE IF NOT EXISTS approval_steps (
  id TEXT PRIMARY KEY, approval_id TEXT NOT NULL REFERENCES approvals(id) ON DELETE CASCADE,
  step_no INTEGER NOT NULL, role TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending',
  decided_by TEXT REFERENCES users(id), decision_note TEXT, decided_at TEXT,
  UNIQUE(approval_id, step_no)
);
CREATE TABLE IF NOT EXISTS business_events (
  id TEXT PRIMARY KEY, company_id TEXT NOT NULL REFERENCES companies(id), object_type TEXT NOT NULL,
  object_id TEXT NOT NULL, event_type TEXT NOT NULL, from_status TEXT, to_status TEXT,
  note TEXT, created_by TEXT NOT NULL REFERENCES users(id), created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS profit_snapshots (
  id TEXT PRIMARY KEY, company_id TEXT NOT NULL REFERENCES companies(id), sales_order_id TEXT NOT NULL REFERENCES sales_orders(id),
  version INTEGER NOT NULL, revenue_base_minor INTEGER NOT NULL, cost_base_minor INTEGER NOT NULL, refund_base_minor INTEGER NOT NULL,
  gross_profit_base_minor INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'current', created_by TEXT NOT NULL, created_at TEXT NOT NULL,
  UNIQUE(sales_order_id, version)
);
CREATE TABLE IF NOT EXISTS performance_shares (
  id TEXT PRIMARY KEY, company_id TEXT NOT NULL REFERENCES companies(id), document_no TEXT NOT NULL UNIQUE,
  sales_order_id TEXT NOT NULL REFERENCES sales_orders(id), beneficiary_id TEXT NOT NULL REFERENCES users(id),
  amount_base_minor INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'draft', created_by TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS after_sales (
  id TEXT PRIMARY KEY, company_id TEXT NOT NULL REFERENCES companies(id), document_no TEXT NOT NULL UNIQUE,
  sales_order_id TEXT NOT NULL REFERENCES sales_orders(id), type TEXT NOT NULL, severity TEXT NOT NULL DEFAULT 'medium',
  description TEXT NOT NULL, responsibility TEXT, resolution TEXT, amount_minor INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'CNY', status TEXT NOT NULL DEFAULT 'open', owner_id TEXT NOT NULL REFERENCES users(id),
  created_by TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, closed_at TEXT
);
CREATE TABLE IF NOT EXISTS attachments (
  id TEXT PRIMARY KEY, company_id TEXT NOT NULL REFERENCES companies(id), object_type TEXT NOT NULL, object_id TEXT NOT NULL,
  file_name TEXT NOT NULL, mime_type TEXT NOT NULL, size_bytes INTEGER NOT NULL, sha256 TEXT NOT NULL,
  storage_name TEXT NOT NULL, uploaded_by TEXT NOT NULL REFERENCES users(id), created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS settings (
  company_id TEXT NOT NULL REFERENCES companies(id), key TEXT NOT NULL, value_json TEXT NOT NULL,
  updated_by TEXT NOT NULL REFERENCES users(id), updated_at TEXT NOT NULL, PRIMARY KEY(company_id,key)
);
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY, company_id TEXT NOT NULL, user_id TEXT, action TEXT NOT NULL, object_type TEXT NOT NULL,
  object_id TEXT, before_json TEXT, after_json TEXT, ip TEXT, created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_quotes_customer ON quotes(customer_id, created_at);
CREATE INDEX IF NOT EXISTS ix_orders_customer ON sales_orders(customer_id, created_at);
CREATE INDEX IF NOT EXISTS ix_finance_order ON finance_entries(sales_order_id, type, status);
CREATE INDEX IF NOT EXISTS ix_approvals_pending ON approvals(status, assigned_role, created_at);
CREATE INDEX IF NOT EXISTS ix_approval_steps ON approval_steps(approval_id, step_no);
CREATE INDEX IF NOT EXISTS ix_business_events ON business_events(object_type, object_id, created_at);
CREATE INDEX IF NOT EXISTS ix_audit_object ON audit_logs(object_type, object_id, created_at);
CREATE INDEX IF NOT EXISTS ix_after_sales_order ON after_sales(sales_order_id, status);
CREATE INDEX IF NOT EXISTS ix_attachment_object ON attachments(object_type, object_id, created_at);
`);

export function transaction(fn) {
  db.exec('BEGIN IMMEDIATE');
  try { const value = fn(); db.exec('COMMIT'); return value; }
  catch (error) { db.exec('ROLLBACK'); throw error; }
}

export function audit({ companyId, userId, action, objectType, objectId, before = null, after = null, ip = null }) {
  db.prepare(`INSERT INTO audit_logs VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id('audit'), companyId, userId ?? null, action, objectType, objectId ?? null, before ? JSON.stringify(before) : null, after ? JSON.stringify(after) : null, ip ?? null, now());
}

function seed() {
  const company = db.prepare('SELECT id FROM companies LIMIT 1').get();
  if (company) return;
  const createdAt = now();
  const companyId = 'company_demo';
  const adminId = 'user_admin';
  const password = process.env.ERP_ADMIN_PASSWORD || 'Admin@2026';
  transaction(() => {
    db.prepare('INSERT INTO companies VALUES (?, ?, ?, ?)').run(companyId, '远航国际贸易', 'CNY', createdAt);
    const insertUser = db.prepare('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, 1, 0, NULL, ?, ?)');
    insertUser.run(adminId, companyId, 'admin@hangmao.local', '林致远', 'admin', hashPassword(password), createdAt, createdAt);
    if (process.env.ERP_DEMO_USERS !== 'false') {
      insertUser.run('user_sales', companyId, 'sales@hangmao.local', '陈晓岚', 'sales', hashPassword('Sales@2026'), createdAt, createdAt);
      insertUser.run('user_finance', companyId, 'finance@hangmao.local', '周谨', 'finance', hashPassword('Finance@2026'), createdAt, createdAt);
      insertUser.run('user_manager', companyId, 'manager@hangmao.local', '顾远川', 'manager', hashPassword('Manager@2026'), createdAt, createdAt);
    }
  });
}
seed();

const defaultSettings = {
  low_margin_bps: 1500, large_sales_order_base_minor: 50000000,
  large_payment_base_minor: 20000000, credit_days_limit: 30,
  followup_overdue_days: 7, approval_reminder_hours: 24,
  approval_escalation_hours: 48, max_share_ratio_bps: 4000,
  attachment_max_bytes: 4194304, session_hours: 8
};
const companyForSettings = db.prepare('SELECT id FROM companies LIMIT 1').get();
const adminForSettings = db.prepare(`SELECT id FROM users WHERE role='admin' LIMIT 1`).get();
if (companyForSettings && adminForSettings) {
  const insertSetting = db.prepare('INSERT OR IGNORE INTO settings VALUES (?, ?, ?, ?, ?)');
  for (const [key, value] of Object.entries(defaultSettings)) insertSetting.run(companyForSettings.id, key, JSON.stringify(value), adminForSettings.id, now());
}
