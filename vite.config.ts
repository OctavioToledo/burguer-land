import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'
import { defineConfig, type Plugin } from 'vitest/config'
import { negocio } from './src/data/business.ts'

/**
 * Completa las URLs absolutas de Open Graph (WhatsApp e Instagram las necesitan completas)
 * y agrega el JSON-LD de schema.org a partir de src/data/business.ts, así los datos viven en un solo lugar.
 */
function seo(sitio: string): Plugin {
  const dias = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return {
    name: 'seo-negocio',
    transformIndexHtml(html, ctx) {
      // Precarga las fuentes de títulos (Sedgwick Ave Display), de etiquetas (Big Shoulders Stencil) y del texto (Inter latin) para que no salte el layout.
      const fuentes = Object.keys(ctx.bundle ?? {}).filter((f) => /(sedgwick-ave-display-latin-400-normal|big-shoulders-stencil-display-latin-wght-normal|inter-latin-wght-normal)-.*\.woff2$/.test(f))
      const precargas = fuentes.map((f) => `<link rel="preload" href="/${f}" as="font" type="font/woff2" crossorigin />`).join('\n    ')
      const datos = {
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        name: negocio.nombre,
        servesCuisine: 'Hamburguesas',
        ...(sitio && { url: sitio, image: `${sitio}/og.jpg` }),
        telephone: `+${negocio.whatsapp}`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: negocio.direccion,
          addressLocality: negocio.localidad,
          addressRegion: negocio.provincia,
          addressCountry: 'AR',
        },
        hasMap: negocio.mapsLink,
        openingHoursSpecification: Object.entries(negocio.horarios).flatMap(([dia, turnos]: [string, { abre: string; cierra: string }[]]) =>
          turnos.map((t) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: dias[Number(dia)], opens: t.abre, closes: t.cierra })),
        ),
        sameAs: [
          negocio.redes.instagram && `https://www.instagram.com/${negocio.redes.instagram}/`,
          negocio.redes.facebook && `https://www.facebook.com/${negocio.redes.facebook}`,
          negocio.redes.tiktok && `https://www.tiktok.com/@${negocio.redes.tiktok}`,
        ].filter(Boolean),
      }
      const script = `<script type="application/ld+json">${JSON.stringify(datos).replace(/</g, '\\u003c')}</script>`
      return html.replaceAll('__SITE_URL__', sitio).replace('</head>', `    ${precargas}\n    ${script}\n  </head>`)
    },
  }
}

export default defineConfig(({ mode }) => {
  // Si no se cargó VITE_SITE_URL, se usa el dominio que da la plataforma: el de producción en Vercel,
  // o la URL de este deploy en Cloudflare Pages.
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  const sitio = (loadEnv(mode, process.cwd()).VITE_SITE_URL || (vercel ? `https://${vercel}` : '') || process.env.CF_PAGES_URL || '').replace(/\/$/, '')
  return {
    plugins: [react(), seo(sitio)],
    test: { environment: 'node' },
  }
})
