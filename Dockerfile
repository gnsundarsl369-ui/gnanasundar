# ── Stage 1: base ──────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app

# ── Stage 2: production ─────────────────────────────────────────
FROM base AS production

# Copy the single-file server
COPY server.js .

# Expose the port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

# Run
ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "server.js"]
