import { useCarrito } from '../carrito/Carrito'

/** Toast corto. La región viva existe siempre para que los lectores de pantalla la anuncien. */
export function Aviso() {
  const { aviso } = useCarrito()
  return (
    <div role="status" aria-live="polite" className="aviso">
      {aviso && (
        <p key={aviso.id} className="aviso__texto">
          {aviso.texto}
        </p>
      )}
    </div>
  )
}
