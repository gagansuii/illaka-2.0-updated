# multi-stage build for a Next.js application

# base stage installs dependencies and builds the application
FROM node:20-alpine AS builder
WORKDIR /app

# install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# copy source and build
COPY . .
RUN npm run build

# production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# copy over built assets and dependencies
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./

EXPOSE 3000

# default environment variables (can be overridden)
ENV PORT=3000

CMD ["npm", "run", "start"]
