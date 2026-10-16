/** Hora en formato 24 h, "HH:MM". Un turno que cierra a las "00:30" o "02:00" termina al día siguiente. */
export type Hora = `${number}:${number}`

export interface Turno {
  abre: Hora
  cierra: Hora
}

/** 0 = domingo … 6 = sábado (igual que Date.getDay()). */
export type Dia = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type Horarios = Record<Dia, Turno[]>

export type MedioDePago = 'efectivo' | 'transferencia'

export interface Negocio {
  nombre: string
  /** Frase corta que va entre paréntesis debajo del nombre en la portada, ej. "(smash burgers)". */
  bajada: string
  slogan: string
  /** Texto en el logo del header y el footer. Si hay logo en imagen, cargarlo en `logoImagen`. */
  logoTexto: string
  /**
   * Logo en imagen (webp con fondo transparente) o null para usar `logoTexto`.
   * Si existe "nombre-360.webp" al lado, se usa en pantallas chicas. Con logo, la portada lo muestra en lugar del nombre.
   */
  logoImagen: { src: string; ancho: number; alto: number } | null
  /** Formato internacional sin "+" ni espacios. Ej.: (263) 15 400-0000 → 5492634000000 */
  whatsapp: string
  /** Cómo se muestra el número en el sitio. */
  whatsappVisible: string
  direccion: string
  localidad: string
  provincia: string
  /** Link que abre la ubicación en Google Maps. */
  mapsLink: string
  /** URL para el iframe del mapa (Google Maps → Compartir → Insertar un mapa → copiar solo el src). `null` para no mostrar mapa embebido. */
  mapsEmbed: string | null
  /** Zona horaria del local, para calcular "Abierto ahora" sin importar dónde esté el cliente. */
  zonaHoraria: string
  horarios: Horarios
  redes: { instagram: string; facebook: string; tiktok: string }
  envio: { costo: number; zonas: string[]; demora: string }
  retiro: { demora: string }
  mediosDePago: MedioDePago[]
  /** Datos que se muestran al elegir transferencia. */
  transferencia: { alias: string; titular: string }
  pedidoMinimo: number
  historia: string[]
  fotos: { hero: { src: string; alt: string }[]; local: { src: string; alt: string } }
  credito: { texto: string; url: string }
}

export interface Opcion {
  id: string
  nombre: string
  /** Precio adicional. 0 si no cambia el precio (ej. "Sin cebolla"). */
  precio: number
}

export interface GrupoOpciones {
  id: string
  nombre: string
  /** "unico": se elige una sola opción (radio). "multiple": varias (checkbox). */
  tipo: 'unico' | 'multiple'
  obligatorio: boolean
  /** Máximo de opciones elegibles en un grupo "multiple". Sin valor = sin límite. */
  maximo?: number
  opciones: Opcion[]
}

export type Badge = 'Nueva' | 'Más pedida' | 'Picante'

export interface Categoria {
  id: string
  nombre: string
}

export interface Producto {
  id: string
  nombre: string
  descripcion: string
  precio: number
  /** Nombre base de la foto en public/img/productos (sin "-400.webp" / "-800.webp"). */
  imagen: string
  categoria: string
  badge?: Badge
  disponible: boolean
  destacado?: boolean
  opciones?: GrupoOpciones[]
}
