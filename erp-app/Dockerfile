FROM node:22-alpine
WORKDIR /app
COPY package.json ./
COPY src ./src
COPY public ./public
COPY scripts ./scripts
ENV PORT=4173 HOST=0.0.0.0 ERP_DEMO_USERS=false ERP_DATA_DIR=/var/lib/hangmao/data ERP_UPLOAD_DIR=/var/lib/hangmao/uploads
VOLUME ["/var/lib/hangmao"]
EXPOSE 4173
CMD ["node","src/server.js"]
