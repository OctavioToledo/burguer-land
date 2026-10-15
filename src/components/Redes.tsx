import { negocio } from '../data/business'
import { IconoFacebook, IconoInstagram, IconoTiktok } from './Iconos'

const REDES = [
  { clave: 'instagram', nombre: 'Instagram', url: (u: string) => `https://www.instagram.com/${u}/`, Icono: IconoInstagram },
  { clave: 'facebook', nombre: 'Facebook', url: (u: string) => `https://www.facebook.com/${u}`, Icono: IconoFacebook },
  { clave: 'tiktok', nombre: 'TikTok', url: (u: string) => `https://www.tiktok.com/@${u}`, Icono: IconoTiktok },
] as const

export function Redes({ className = '' }: { className?: string }) {
  const activas = REDES.filter((r) => negocio.redes[r.clave])
  if (activas.length === 0) return null
  return (
    <ul className={`redes ${className}`}>
      {activas.map(({ clave, nombre, url, Icono }) => (
        <li key={clave}>
          <a href={url(negocio.redes[clave])} target="_blank" rel="noopener noreferrer" className="redes__enlace" aria-label={`${nombre} de ${negocio.nombre}`}>
            <Icono width={22} height={22} />
          </a>
        </li>
      ))}
    </ul>
  )
}
