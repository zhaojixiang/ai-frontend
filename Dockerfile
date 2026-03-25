# --- build ---
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

# 构建期环境变量（与 vite envPrefix: VITE_ / ENV_ 对齐）
ARG ENV_BASE=/
ARG ENV_NAME=pro
ARG VITE_API_BASE_URL=

ENV ENV_BASE=$ENV_BASE
ENV ENV_NAME=$ENV_NAME
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN pnpm run build

# --- static ---
FROM nginx:1.27-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
