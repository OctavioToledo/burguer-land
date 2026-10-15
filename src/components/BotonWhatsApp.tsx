import { useCarrito } from '../carrito/Carrito'
import { negocio } from '../data/business'
import { linkWhatsApp } from '../lib/whatsapp'
import { IconoWhatsApp } from './Iconos'

/** Botón flotante para consultas generales. En mobile sube cuando aparece la barra del carrito. */
export function BotonWhatsApp() {
  const { vacio } = useCarrito()
  return (
    <a
      href={linkWhatsApp(`¡Hola ${negocio.nombre}! Quería hacerles una consulta.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultanos por WhatsApp"
      className={`flotante-wa ${vacio ? '' : 'flotante-wa--arriba'}`}
    >
      <IconoWhatsApp width={28} height={28} />
    </a>
  )
}
