import { destacados } from '../lib/catalogo'
import { TarjetaProducto } from './TarjetaProducto'

export function Destacados() {
  if (destacados.length === 0) return null
  return (
    <section id="destacados" className="seccion destacados" aria-labelledby="destacados-titulo">
      <div className="contenedor">
        <div className="apertura">
          <p className="etiqueta apertura__ojal">Las que más salen</p>
          <h2 id="destacados-titulo" className="titulo-lg">
            Destacados
          </h2>
        </div>
      </div>
      <ul className="carrusel" aria-label="Productos destacados">
        {destacados.map((p) => (
          <li key={p.id} className="carrusel__item">
            <TarjetaProducto producto={p} variante="destacado" />
          </li>
        ))}
      </ul>
    </section>
  )
}
