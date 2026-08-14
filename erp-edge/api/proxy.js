const excludedHeaders = new Set(['host', 'connection', 'content-length', 'transfer-encoding']);

export default async function handler(req, res) {
  const origin = process.env.ERP_ORIGIN_URL;
  const secret = process.env.ERP_ORIGIN_TOKEN;
  if (!origin || !secret) return res.status(503).json({ error: 'ERP 网关未配置' });

  const path = Array.isArray(req.query.path) ? req.query.path.join('/') : String(req.query.path || '');
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query)) {
    if (key === 'path') continue;
    for (const item of Array.isArray(value) ? value : [value]) query.append(key, item);
  }
  const target = `${origin}/api/${path}${query.size ? `?${query}` : ''}`;
  const headers = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (!excludedHeaders.has(key.toLowerCase()) && value !== undefined) headers[key] = value;
  }
  headers['x-erp-origin-token'] = secret;
  headers['x-forwarded-proto'] = 'https';

  let body;
  if (!['GET', 'HEAD'].includes(req.method)) {
    body = Buffer.isBuffer(req.body) ? req.body : typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
  }

  try {
    const upstream = await fetch(target, { method: req.method, headers, body, redirect: 'manual' });
    for (const name of ['content-type', 'content-disposition', 'set-cookie', 'cache-control']) {
      const value = upstream.headers.get(name);
      if (value) res.setHeader(name, value);
    }
    res.status(upstream.status).send(Buffer.from(await upstream.arrayBuffer()));
  } catch {
    res.status(502).json({ error: 'ERP 服务暂时不可用' });
  }
}
