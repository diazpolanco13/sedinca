# Web de SEDIN: compila el sitio estático (Next.js export) y lo sirve con nginx.
# Los endpoints de formularios y Umami se fijan en tiempo de build (Build Args en Dokploy).

FROM node:22.20.0-alpine AS build
WORKDIR /app
ARG NEXT_PUBLIC_CONTACT_ENDPOINT=""
ARG NEXT_PUBLIC_JOBS_ENDPOINT=""
# Analítica Umami (opcional): sin ambas variables no se carga el script.
ARG NEXT_PUBLIC_UMAMI_ID=""
ARG NEXT_PUBLIC_UMAMI_SRC=""
ENV NEXT_PUBLIC_CONTACT_ENDPOINT=$NEXT_PUBLIC_CONTACT_ENDPOINT \
    NEXT_PUBLIC_JOBS_ENDPOINT=$NEXT_PUBLIC_JOBS_ENDPOINT \
    NEXT_PUBLIC_UMAMI_ID=$NEXT_PUBLIC_UMAMI_ID \
    NEXT_PUBLIC_UMAMI_SRC=$NEXT_PUBLIC_UMAMI_SRC \
    NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.29.1-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/out /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
