import { useCarrito } from '../carrito/Carrito'
import { precio } from '../lib/formato'
import type { Producto } from '../lib/tipos'
import { FotoProducto } from './FotoProducto'
import { IconoMas } from './Iconos'
import { useAgregar } from './useAgregar'

export function Badge({ producto }: { producto: Producto }) {
  if (!producto.badge || !producto.disponible) return null
  return <span className={`badge ${producto.badge === 'Nueva' ? 'badge--nueva' : ''}`}>{producto.badge}</span>
}

/**
 * Tarjeta del menú. Tocar la foto o el nombre abre el detalle; "Agregar" suma directo si no hay opciones.
 * Variante "destacado": foto arriba y más grande, para el carrusel de destacados.
 */
export function TarjetaProducto({ producto, variante = 'menu' }: { producto: Producto; variante?: 'menu' | 'destacado' }) {
  const { verProducto } = useCarrito()
  const agregar = useAgregar()
  const sinStock = !producto.disponible
  const Titulo = variante === 'destacado' ? 'h3' : 'h4'

  return (
    <article className={`tarjeta tarjeta--${variante} ${sinStock ? 'tarjeta--sin-stock' : ''}`}>
      <div className="tarjeta__foto">
        <FotoProducto producto={producto} sizes={variante === 'destacado' ? '(min-width: 1024px) 300px, 80vw' : '(min-width: 640px) 33vw, 120px'} />
        <div className="tarjeta__badge">
          <Badge producto={producto} />
        </div>
      </div>
      <div className="tarjeta__info">
        <Titulo className="nombre-producto tarjeta__nombre">
          {sinStock ? (
            producto.nombre
          ) : (
            <button type="button" className="tarjeta__abrir" onClick={() => verProducto(producto)}>
              {producto.nombre}
            </button>
          )}
        </Titulo>
        <p className="tarjeta__descripcion">{producto.descripcion}</p>
        <div className="tarjeta__pie">
          <p className="tarjeta__precio">
            {producto.opciones?.some((g) => g.opciones.some((o) => o.precio > 0)) && <span className="tarjeta__desde">Desde </span>}
            {precio(producto.precio)}
          </p>
          {sinStock ? (
            <span className="tarjeta__agotado">Sin stock hoy</span>
          ) : (
            <button type="button" className="boton boton--primario tarjeta__agregar" onClick={() => agregar(producto)} aria-label={`Agregar ${producto.nombre}`}>
              <IconoMas width={18} height={18} />
              Agregar
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
