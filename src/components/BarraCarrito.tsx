import { useCarrito } from '../carrito/Carrito'
import { plural, precio } from '../lib/formato'
import { IconoFlecha } from './Iconos'

/** Barra fija inferior en mobile cuando hay productos en el pedido. */
export function BarraCarrito() {
  const { vacio, totales, abrir } = useCarrito()
  if (vacio) return null
  return (
    <div className="barra-carrito">
      <button type="button" className="boton boton--primario boton--grande boton--ancho barra-carrito__boton" onClick={abrir}>
        <span>Ver pedido</span>
        <span className="barra-carrito__detalle">
          {plural(totales.cantidad, 'item')} · {precio(totales.subtotal)}
        </span>
        <IconoFlecha width={18} height={18} />
      </button>
    </div>
  )
}
