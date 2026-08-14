# 航贸云 ERP V1.1

一套可本机运行、可容器部署的外贸业务 ERP。覆盖客户、产品、供应商、报价、销售合同、采购、出运、资金、利润、提成、售后、审批、附件和审计，并提供关联详情、版本保护修改、业务时间线、受控作废和多级审批。

## 本机启动

要求 Node.js 22.5 或更高版本。

```bash
cd /Users/eric/Desktop/外贸SOP与ERP优化版/erp-app
npm start
```

浏览器打开 `http://127.0.0.1:4173`。

首次启动演示账号：

| 角色 | 邮箱 | 初始密码 |
|---|---|---|
| 管理员 | admin@hangmao.local | Admin@2026 |
| 业务员 | sales@hangmao.local | Sales@2026 |
| 财务 | finance@hangmao.local | Finance@2026 |
| 经理 | manager@hangmao.local | Manager@2026 |

本机模式会创建演示账号。生产容器默认设置 `ERP_DEMO_USERS=false`，只创建管理员；必须通过 `ERP_ADMIN_PASSWORD` 注入强密码。首次登录后可在“系统设置”修改密码，系统会撤销其他会话。系统默认只监听本机地址；对外提供服务时应置于 HTTPS 反向代理之后。

## 验证与演示数据

```bash
npm test
npm run demo
```

测试覆盖未登录拦截、客户/产品/供应商、低毛利审批、职责分离、PI→SO、应收、部分采购、超采拦截、部分出运、收付款、售后、附件、利润、提成和审计。

## 备份

```bash
npm run backup
```

备份会保存数据库、附件和清单至 `backups/时间戳/`。恢复时停止服务，把备份中的 `erp.sqlite` 与 `uploads` 复制回对应数据目录，再启动并执行健康检查。

## 正式部署底线

- 使用强管理员密码，正式账号逐人开通。
- HTTPS、每日备份、异机保留和每季度恢复演练。
- 生产服务器限制数据库和附件目录权限。
- 金额、权限和历史数据迁移通过验收后再切换旧系统。
- 超过 100 人或高并发、多实例部署时，将 SQLite 迁移到 PostgreSQL，并把会话迁至共享存储。

详细业务方案在上级目录；技术决策见 [docs/architecture.md](docs/architecture.md)。
