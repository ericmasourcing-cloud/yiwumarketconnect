#!/usr/bin/env bash
set -euo pipefail
backup_root=/var/backups/hangmao-erp
stamp=$(date -u +%Y%m%dT%H%M%SZ)
target="$backup_root/$stamp"
install -d -m 700 "$target"
sqlite3 /var/lib/hangmao-erp/data/erp.sqlite ".backup '$target/erp.sqlite'"
if [ -d /var/lib/hangmao-erp/uploads ]; then cp -a /var/lib/hangmao-erp/uploads "$target/uploads"; fi
find "$backup_root" -mindepth 1 -maxdepth 1 -type d -mtime +30 -exec rm -rf -- {} +

