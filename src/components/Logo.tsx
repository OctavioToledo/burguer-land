import { negocio } from '../data/business'

export function Logo({ className = '' }: { className?: string }) {
  if (negocio.logoImagen) return <img src={negocio.logoImagen} alt={negocio.nombre} className={`logo-img ${className}`} width={140} height={40} />
  return <span className={`logo ${className}`}>{negocio.logoTexto}</span>
}
