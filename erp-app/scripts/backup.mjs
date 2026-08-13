import { copyFileSync, existsSync, mkdirSync, cpSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
const data=resolve(process.env.ERP_DATA_DIR||'./data');const uploads=resolve(process.env.ERP_UPLOAD_DIR||'./uploads');const root=resolve(process.env.ERP_BACKUP_DIR||'./backups');const stamp=new Date().toISOString().replaceAll(':','-').replaceAll('.','-');const target=join(root,stamp);mkdirSync(target,{recursive:true});
if(existsSync(join(data,'erp.sqlite')))copyFileSync(join(data,'erp.sqlite'),join(target,'erp.sqlite'));
if(existsSync(uploads))cpSync(uploads,join(target,'uploads'),{recursive:true});
writeFileSync(join(target,'manifest.json'),JSON.stringify({createdAt:new Date().toISOString(),database:'erp.sqlite',uploads:'uploads'},null,2));
console.log(`备份完成：${target}`);

