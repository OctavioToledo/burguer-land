import { useCarrito } from '../carrito/Carrito'
import type { Producto } from '../lib/tipos'

/** "Agregar" desde una tarjeta: si el producto tiene opciones abre el modal; si no, lo suma directo. */
export function useAgregar() {
  const { agregar, avisar, verProducto } = useCarrito()
  return (producto: Producto) => {
    if (producto.opciones?.length) {
      verProducto(producto)
      return
    }
    agregar({ productoId: producto.id, cantidad: 1, seleccion: {}, nota: '' })
    avisar(`Agregaste ${producto.nombre} a tu pedido`)
  }
}
