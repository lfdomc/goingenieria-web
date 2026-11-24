# Go Ingeniería — goingenieria.com

Next.js 16 (App Router) con export estático para Cloudflare Pages. Todo el contenido **y** el diseño salen de `content/site.json`.

## Comandos

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # genera /out (HTML pre-renderizado)
```

## Cloudflare Pages

- Framework preset: **None** (o Next.js Static HTML Export)
- Build command: `npm run build`
- Build output directory: `out`
- Variable de entorno: `NODE_VERSION=22`
- Dominio: añadir `www.goingenieria.com` y `goingenieria.com` en *Custom domains* y quitar el DNS de Wix.

`public/_headers` define caché inmutable para imágenes y `_next/static`, y cabeceras de seguridad.
`public/_redirects` manda las URLs viejas de Wix (`/publicaciones`, `/blog`, `/contacto`) a la nueva página con 301.

## site.json: qué controla cada bloque

| Bloque | Controla |
|---|---|
| `brand` | Nombre, logo, dominio (usado en canonical, OG y JSON-LD) |
| `contact` | WhatsApp principal, personas de contacto, dirección, redes (vacías = no se muestran) |
| `seo` | Título, descripción, keywords, imagen OG, GA4 (vacío = sin analytics) |
| `design.mode` | `"dark"` o `"light"` (ambas paletas definidas) |
| `design.theme.colors` | Roles de color en OKLCH: `bg`, `surface`, `ink`, `inkMuted`, `accent`… |
| `design.theme.fonts` | Familias display/cuerpo y la consulta de Google Fonts |
| `design.dials.motion` | 0–10. ≤ 3 apaga reveals, dibujo del plano, pin horizontal y contadores |
| `design.dials.density` | 1–10. Controla el aire vertical entre secciones |
| `sections[]` | Orden, tipo y textos de cada sección de la portada; quitar una del arreglo la quita del sitio |
| `services[]` | Cada servicio genera su página `/servicios/<slug>/` con metadata y schema propios |
| `services[].art` | Animación de la página de servicio: `electrico`, `hidraulico`, `bim`, `unifilar`, `iluminacion`, `incendios`, `piscina`, `gas`, `inspeccion`, `evaluacion`, `construccion` |
| `sections[hero].plans` | Orden, etiqueta y duración (s) de cada plano de la secuencia del hero (`electrico`, `hidraulico`, `bim`) |
| `sections[projects].items[].size` | `wide`, `tall` o `normal` en el mosaico de proyectos |
| `footer` | Frase final, CTA, columnas de servicios por disciplina y crédito |

Tipos de sección disponibles: `hero`, `marquee`, `stats`, `services`, `process`, `projects`, `faq`, `contact`.

## SEO incluido

- HTML estático por página (portada + 10 páginas de servicio), `canonical`, Open Graph y Twitter Card.
- JSON-LD: `ProfessionalService` con catálogo de servicios, `FAQPage`, `Service` y `BreadcrumbList`.
- `sitemap.xml` y `robots.txt` generados desde el JSON.
- Imagen para WhatsApp: `public/images/og-image.jpg` (1200×630). Regenerar con `python scripts/generate_og_image.py`.
- Tras publicar: forzar la vista previa en https://developers.facebook.com/tools/debug/ → *Scrape Again*, y enviar el sitemap en Google Search Console.

## Imágenes

Todas las fotos en `public/images/*.webp`. Las fotos de inspección vienen del PDF de oferta (309×412 px): reemplazarlas por los originales en alta resolución con el mismo nombre.
