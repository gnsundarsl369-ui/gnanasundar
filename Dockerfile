# ── ARM64 native build ─────────────────────────────────────────
FROM --platform=linux/arm64 node:20-alpine
 
WORKDIR /app
 
COPY server.js .
 
EXPOSE 3000
 
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1
 
ENV NODE_ENV=production
ENV PORT=3000
 
CMD ["node", "server.js"]
