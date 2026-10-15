import { urlImagen } from '../lib/catalogo'
import type { Producto } from '../lib/tipos'

/** Foto 4:3 con srcset (400 y 800 px de ancho), lazy por defecto y tamaño fijo para que no salte el layout. */
export function FotoProducto({ producto, sizes, className = '', prioridad = false }: { producto: Producto; sizes: string; className?: string; prioridad?: boolean }) {
  return (
    <img
      src={urlImagen(producto.imagen, 400)}
      srcSet={`${urlImagen(producto.imagen, 400)} 400w, ${urlImagen(producto.imagen, 800)} 800w`}
      sizes={sizes}
      alt=""
      width={400}
      height={300}
      loading={prioridad ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
    />
  )
}
