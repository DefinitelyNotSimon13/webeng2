FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine


COPY ./.docker/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/www /usr/share/nginx/html

RUN chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]

LABEL org.opencontainers.image.source=https://github.com/DefinitelyNotSimon13/webeng2
LABEL org.opencontainers.image.licenses=MIT
