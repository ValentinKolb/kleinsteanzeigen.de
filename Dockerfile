# Install dependencies only when needed
FROM node:16-alpine AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# RUN ls -la /app/node_modules/
# RUN ls -la /app/node_modules/.bin

# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1

COPY . .
COPY --from=deps /app/node_modules /app/node_modules

RUN yarn build

# Production image, copy all the files, run prisma migrations and next on container start
FROM node:16-alpine AS runner
WORKDIR /app

LABEL maintainer="stuve.computer@uni-ulm.de"

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PATH="$PATH:/app/node_modules/.bin"
ENV PORT 3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser  --system --uid 1001 nextjs

COPY --from=builder                       /app/public                      ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone            ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static                ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/               ./node_modules/
COPY --from=builder --chown=nextjs:nodejs /app/prisma                      ./prisma

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "start"]