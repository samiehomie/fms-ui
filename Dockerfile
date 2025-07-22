# Stage 1: Build the app
FROM node:22 AS builder

RUN npm install -g pnpm

# Define build arguments
ARG FMS_WEB_DOMAIN
ARG FMS_WEB_STATIC_IP
ARG NEXT_PUBLIC_FRONT_URL
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

# Set them as environment variables (if needed at runtime)
ENV FMS_WEB_DOMAIN=$FMS_WEB_DOMAIN
ENV FMS_WEB_STATIC_IP=$FMS_WEB_STATIC_IP
ENV NEXT_PUBLIC_FRONT_URL=$NEXT_PUBLIC_FRONT_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

FROM node:22-slim AS runtime

RUN npm install -g pnpm

WORKDIR /app


COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

EXPOSE 3000

CMD ["pnpm", "start"]