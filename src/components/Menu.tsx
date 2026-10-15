import { useEffect, useMemo, useRef, useState } from 'react'
import { productos } from '../data/products'
import { categoriasConProductos, filtrar } from '../lib/catalogo'
import { plural } from '../lib/formato'
import { IconoBuscar, IconoCerrar } from './Iconos'
import { TarjetaProducto } from './TarjetaProducto'

export function Menu() {
  const [busqueda, setBusqueda] = useState('')
  const [activa, setActiva] = useState(categoriasConProductos[0]?.id ?? '')
  const chips = useRef<HTMLDivElement>(null)
  const clicReciente = useRef(0)

  const grupos = useMemo(() => {
    const encontrados = filtrar(productos, busqueda)
    return categoriasConProductos.map((c) => ({ categoria: c, productos: encontrados.filter((p) => p.categoria === c.id) })).filter((g) => g.productos.length > 0)
  }, [busqueda])
  const cantidad = grupos.reduce((s, g) => s + g.productos.length, 0)

  // Resalta la categoría que se está viendo al scrollear.
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const observador = new IntersectionObserver(
      (entradas) => {
        if (Date.now() - clicReciente.current < 900) return
        const visible = entradas.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setActiva(visible.target.id.replace('cat-', ''))
      },
      { rootMargin: '-140px 0px -55% 0px' },
    )
    document.querySelectorAll('.categoria').forEach((el) => observador.observe(el))
    return () => observador.disconnect()
  }, [grupos])

  // Mantiene visible el chip activo dentro de la barra horizontal, sin mover la página.
  useEffect(() => {
    const barra = chips.current
    const chip = barra?.querySelector<HTMLElement>(`[data-cat="${activa}"]`)
    if (!barra || !chip) return
    const izquierda = chip.offsetLeft - barra.clientWidth / 2 + chip.clientWidth / 2
    barra.scrollTo({ left: Math.max(0, izquierda), behavior: 'smooth' })
  }, [activa])

  return (
    <section id="menu" className="seccion menu" aria-labelledby="menu-titulo">
      <div className="contenedor">
        <div className="apertura">
          <p className="etiqueta apertura__ojal">Elegí, armá y pedí</p>
          <h2 id="menu-titulo" className="titulo-lg">
            El menú
          </h2>
        </div>

        <div className="buscador">
          <label htmlFor="buscar" className="sr-only">
            Buscar en el menú
          </label>
          <IconoBuscar className="buscador__icono" width={20} height={20} />
          <input
            id="buscar"
            type="search"
            className="entrada buscador__entrada"
            placeholder="Buscá: cheddar, papas, limonada…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            autoComplete="off"
            enterKeyHint="search"
          />
          {busqueda && (
            <button type="button" className="boton-icono buscador__limpiar" onClick={() => setBusqueda('')} aria-label="Borrar búsqueda">
              <IconoCerrar width={20} height={20} />
            </button>
          )}
        </div>
        <p className="sr-only" aria-live="polite">
          {busqueda ? (cantidad ? `${plural(cantidad, 'producto')} encontrados` : 'No hay productos con esa búsqueda') : ''}
        </p>
      </div>

      <div className="chips">
        <div className="contenedor">
          <nav ref={chips} className="chips__fila" aria-label="Categorías del menú">
            {grupos.map(({ categoria, productos }) => (
              <a
                key={categoria.id}
                href={`#cat-${categoria.id}`}
                data-cat={categoria.id}
                className="pastilla"
                aria-current={activa === categoria.id ? 'true' : undefined}
                onClick={() => {
                  clicReciente.current = Date.now()
                  setActiva(categoria.id)
                }}
              >
                {categoria.nombre}
                {busqueda && <span className="chips__n">{productos.length}</span>}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="contenedor">
        {grupos.length === 0 ? (
          <div className="menu__vacio">
            <p className="titulo">Nada por acá</p>
            <p className="texto-suave">No encontramos productos con “{busqueda}”.</p>
            <button type="button" className="boton boton--fantasma" onClick={() => setBusqueda('')}>
              Ver todo el menú
            </button>
          </div>
        ) : (
          grupos.map(({ categoria, productos }) => (
            <section key={categoria.id} id={`cat-${categoria.id}`} className="categoria" aria-labelledby={`cat-titulo-${categoria.id}`}>
              <h3 id={`cat-titulo-${categoria.id}`} className="titulo categoria__titulo">
                {categoria.nombre}
              </h3>
              <ul className="grilla">
                {productos.map((p) => (
                  <li key={p.id}>
                    <TarjetaProducto producto={p} />
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </section>
  )
}
