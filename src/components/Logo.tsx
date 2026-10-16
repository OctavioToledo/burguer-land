import { negocio } from '../data/business'

/** `sizes` solo importa en la portada, donde el logo se muestra grande. */
export function Logo({ className = '', sizes = '120px', prioridad = false }: { className?: string; sizes?: string; prioridad?: boolean }) {
  const logo = negocio.logoImagen
  if (!logo) return <span className={`logo ${className}`}>{negocio.logoTexto}</span>
  const chico = logo.src.replace(/\.webp$/, '-360.webp')
  return (
    <img
      src={logo.src}
      srcSet={`${chico} 360w, ${logo.src} ${logo.ancho}w`}
      sizes={sizes}
      alt={negocio.nombre}
      width={logo.ancho}
      height={logo.alto}
      className={`logo-img ${className}`}
      fetchPriority={prioridad ? 'high' : undefined}
      decoding="async"
    />
  )
}
