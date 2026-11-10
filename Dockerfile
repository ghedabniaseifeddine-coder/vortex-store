FROM node:26-alpine AS build
RUN apk upgrade --no-cache
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM python:3-alpine
# Rebuild this layer with the current Alpine v3.24 packages and pull the fixed
# zlib (ALPINE-CVE-2026-4738: 1.3.2-r1 -> 1.4-r0) into the final image.
RUN apk upgrade --no-cache \
 && apk add --no-cache --upgrade zlib
WORKDIR /app
COPY --from=build /app/dist ./
ENV PORT=3000
EXPOSE 3000
CMD ["sh", "-c", "exec python3 -m http.server \"${PORT:-3000}\" --bind 0.0.0.0"]
