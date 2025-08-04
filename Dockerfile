# Install dependencies only (separate layer)
FROM node:20-slim AS deps

WORKDIR /app

# Install dependencies based on lockfile if available
COPY package.json package-lock.json* ./

RUN npm install --frozen-lockfile

# Copy app and build
FROM node:20-slim AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js expects the source inside /src when using App Router
ENV NODE_ENV=production

RUN npm run build

# Prepare final image
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Only bring over what we need to run
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/src ./src

EXPOSE 3000

CMD ["npm", "start"]
