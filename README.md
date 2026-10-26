# SEDIN, C.A. — sitio web

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # genera el sitio estático en out/
```

El contenido de `out/` se sirve tal cual desde el VPS (Dokploy, nginx, etc.).
Datos de contacto pendientes: `src/config/site.ts`. Endpoint del formulario: variable `NEXT_PUBLIC_CONTACT_ENDPOINT`.
