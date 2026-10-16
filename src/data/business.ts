import type { Negocio } from '../lib/tipos.ts'

/**
 * Datos del negocio. Todo lo que cambia entre clientes está acá:
 * nombre, contacto, horarios, envío, pagos y textos institucionales.
 */
export const negocio: Negocio = {
  nombre: 'Smash Art',
  bajada: '(smash burgers)',
  slogan: 'Carne aplastada contra la plancha caliente, bordes crocantes y cheddar que chorrea. Hechas al momento, una por una.',
  logoTexto: 'Smash Art',
  logoImagen: { src: '/img/logo-smash-art.webp', ancho: 720, alto: 405 },

  whatsapp: '5492634555208',
  whatsappVisible: '+54 9 2634 55-5208',

  direccion: 'Av. San Martín 1234',
  localidad: 'San Martín',
  provincia: 'Mendoza',
  mapsLink: 'https://www.google.com/maps/search/?api=1&query=Av.+San+Mart%C3%ADn+1234,+San+Mart%C3%ADn,+Mendoza',
  mapsEmbed: 'https://www.google.com/maps?q=Av.+San+Mart%C3%ADn+1234,+San+Mart%C3%ADn,+Mendoza&output=embed',
  zonaHoraria: 'America/Argentina/Buenos_Aires',

  // 0 = domingo … 6 = sábado. Un turno que cierra después de medianoche se carga igual (ej. 20:00 a 01:00).
  horarios: {
    0: [{ abre: '20:00', cierra: '00:00' }],
    1: [],
    2: [{ abre: '20:00', cierra: '00:00' }],
    3: [{ abre: '20:00', cierra: '00:00' }],
    4: [{ abre: '20:00', cierra: '00:00' }],
    5: [
      { abre: '12:00', cierra: '15:00' },
      { abre: '20:00', cierra: '01:30' },
    ],
    6: [
      { abre: '12:00', cierra: '15:00' },
      { abre: '20:00', cierra: '01:30' },
    ],
  },

  // Dejar una red en '' para ocultarla.
  redes: { instagram: 'smashart', facebook: '', tiktok: '' },

  envio: {
    costo: 2500,
    zonas: ['Centro', 'Palmira', 'Barrio Ciudad de San Martín', 'Alto Salvador', 'Buen Orden'],
    demora: '40 a 60 min',
  },
  retiro: { demora: '20 a 30 min' },
  mediosDePago: ['efectivo', 'transferencia'],
  transferencia: { alias: 'SMASH.ART.MP', titular: 'Smash Art' },
  pedidoMinimo: 10000,

  historia: [
    'Arrancamos con una plancha, unos aerosoles y una idea fija: hacer la smash burger que nosotros queríamos comer, en un lugar que se pareciera a la calle.',
    'Picamos la carne todos los días, la aplastamos al momento contra la plancha bien caliente y la servimos con el borde crocante. Sin congelados, sin apuro.',
  ],

  fotos: {
    hero: [
      { src: '/img/hero-1.webp', alt: 'Hamburguesa doble con lechuga, tomate y cheddar' },
      { src: '/img/hero-2.webp', alt: 'Papas fritas en canasta' },
      { src: '/img/hero-3.webp', alt: 'Hamburguesa doble con cheddar derretido' },
    ],
    local: { src: '/img/local.webp', alt: 'Hamburguesa con papas servida en el local' },
  },

  credito: { texto: 'Sitio por Octavio Toledo', url: 'https://octavio-toledo.vercel.app' },
}
