const base = process.env.ERP_URL || 'http://127.0.0.1:4173';
async function login(email,password){const r=await fetch(`${base}/api/auth/login`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,password})});if(!r.ok)throw new Error(await r.text());const d=await r.json();return{cookie:r.headers.get('set-cookie').split(';')[0],csrf:d.csrf}}
async function api(s,path,method='GET',data){const r=await fetch(base+path,{method,headers:{cookie:s.cookie,'x-csrf-token':s.csrf,'content-type':'application/json'},body:data?JSON.stringify(data):undefined});const d=await r.json();if(!r.ok)throw new Error(`${path}: ${d.error}`);return d}
const admin=await login('admin@hangmao.local','Admin@2026');
const manager=await login('manager@hangmao.local','Manager@2026');
const current=await api(admin,'/api/customers');
if(current.some(c=>c.name==='Nordlicht Outdoor GmbH')){console.log('演示数据已存在，未重复导入');process.exit(0)}
const supplier=await api(admin,'/api/suppliers','POST',{name:'宁波拓野户外用品有限公司',country:'中国',contactName:'王海',email:'sales@tuoye.example',riskLevel:'low'});
const product=await api(admin,'/api/products','POST',{sku:'TL-CAMP-01',name:'磁吸折叠露营灯',category:'户外照明',unit:'pcs',moq:500,salePrice:12.5,costPrice:9.2,currency:'USD',supplierId:supplier.id});
const customer=await api(admin,'/api/customers','POST',{name:'Nordlicht Outdoor GmbH',country:'德国',contactName:'Anna Weber',email:'anna@nordlicht.example',level:'A',nextAction:'确认包装唛头',nextFollowupAt:'2026-08-18'});
const quote=await api(admin,'/api/quotes','POST',{customerId:customer.id,currency:'USD',exchangeRate:7.18,incoterm:'FOB',paymentTerms:'30% deposit, 70% before shipment',validUntil:'2026-09-12',items:[{productId:product.id,description:'磁吸折叠露营灯 双色温',quantity:2000,unitPrice:11.5,unitCost:9.2}]});
await api(admin,`/api/quotes/${quote.id}/submit`,'POST');
const q2=await api(admin,'/api/quotes','POST',{customerId:customer.id,currency:'USD',exchangeRate:7.18,incoterm:'FOB',paymentTerms:'30% deposit, 70% before shipment',validUntil:'2026-09-12',items:[{productId:product.id,description:'磁吸折叠露营灯 礼盒版',quantity:800,unitPrice:10,unitCost:8.8}]});
await api(admin,`/api/quotes/${q2.id}/submit`,'POST');
const approvals=await api(manager,'/api/approvals');const approval=approvals.find(a=>a.object_id===q2.id);await api(manager,`/api/approvals/${approval.id}/decision`,'POST',{decision:'approved',note:'礼盒订单具有战略意义，成本凭证与回款条件完整'});
const so=await api(admin,`/api/quotes/${quote.id}/convert`,'POST');
const detail=await api(admin,`/api/orders/${so.id}`);const item=detail.items[0];
await api(admin,'/api/purchases','POST',{salesOrderId:so.id,supplierId:supplier.id,currency:'USD',expectedAt:'2026-09-05',items:[{salesOrderItemId:item.id,quantity:1200,unitCost:9.2}]});
await api(admin,'/api/deliveries','POST',{salesOrderId:so.id,forwarder:'海程国际物流',transportMode:'sea',trackingNo:'COSU-DEMO-2026',freight:8600,currency:'CNY',plannedAt:'2026-09-10',items:[{salesOrderItemId:item.id,quantity:800}]});
await api(admin,'/api/finance','POST',{salesOrderId:so.id,type:'receipt',currency:'USD',amount:6900,exchangeRate:7.18,occurredAt:'2026-08-13',reference:'HSBC-DEMO-0831'});
console.log('演示数据导入完成：客户、产品、供应商、2份报价、1份合同、采购、出运、收款和审批');

