import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import { IconoCerrar } from './Iconos'

const FOCUSABLES = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'

/**
 * Panel modal: bottom sheet en mobile; en desktop, drawer lateral ("lateral") o diálogo centrado ("centro").
 * Atrapa el foco, cierra con Escape y tocando afuera, bloquea el scroll del fondo y devuelve el foco al cerrar.
 */
export function Hoja({
  titulo,
  tituloOculto = false,
  variante,
  alCerrar,
  cabecera,
  pie,
  focoInicial,
  children,
}: {
  titulo: string
  tituloOculto?: boolean
  variante: 'lateral' | 'centro'
  alCerrar: () => void
  /** Contenido arriba del cuerpo, fuera del área con scroll (ej. foto del producto). */
  cabecera?: ReactNode
  /** Contenido fijo abajo (ej. total y botón de enviar). */
  pie?: ReactNode
  focoInicial?: RefObject<HTMLElement | null>
  children: ReactNode
}) {
  const panel = useRef<HTMLDivElement>(null)
  const botonCerrar = useRef<HTMLButtonElement>(null)
  // Se guarda en un ref para que el efecto no se vuelva a correr si el padre pasa una función nueva.
  const cerrarRef = useRef(alCerrar)
  useEffect(() => {
    cerrarRef.current = alCerrar
  })

  useEffect(() => {
    const previo = document.activeElement as HTMLElement | null
    document.body.classList.add('bloqueado')
    ;(focoInicial?.current ?? botonCerrar.current)?.focus({ preventScroll: true })

    const alTeclear = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        ev.preventDefault()
        cerrarRef.current()
        return
      }
      if (ev.key !== 'Tab' || !panel.current) return
      const focos = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLES)].filter((el) => el.offsetParent !== null || el === document.activeElement)
      if (focos.length === 0) return
      const primero = focos[0]
      const ultimo = focos[focos.length - 1]
      if (ev.shiftKey && (document.activeElement === primero || !panel.current.contains(document.activeElement))) {
        ev.preventDefault()
        ultimo.focus()
      } else if (!ev.shiftKey && (document.activeElement === ultimo || !panel.current.contains(document.activeElement))) {
        ev.preventDefault()
        primero.focus()
      }
    }
    document.addEventListener('keydown', alTeclear)
    return () => {
      document.removeEventListener('keydown', alTeclear)
      document.body.classList.remove('bloqueado')
      // Si el botón que abrió la hoja ya no existe (la barra inferior se oculta), el foco vuelve al carrito del header.
      const destino = previo?.isConnected && previo !== document.body ? previo : document.getElementById('boton-carrito')
      destino?.focus({ preventScroll: true })
    }
    // focoInicial es un ref: no cambia entre renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={`hoja hoja--${variante}`}>
      <div className="hoja__velo" onClick={() => cerrarRef.current()} aria-hidden />
      <div ref={panel} className="hoja__panel" role="dialog" aria-modal="true" aria-labelledby="hoja-titulo">
        <div className="hoja__barra">
          <span className="hoja__agarre" aria-hidden />
          <h2 id="hoja-titulo" className={tituloOculto ? 'sr-only' : 'hoja__titulo'}>
            {titulo}
          </h2>
          <button ref={botonCerrar} type="button" className="boton-icono hoja__cerrar" onClick={() => cerrarRef.current()} aria-label="Cerrar">
            <IconoCerrar />
          </button>
        </div>
        <div className="hoja__cuerpo">
          {cabecera}
          {children}
        </div>
        {pie && <div className="hoja__pie">{pie}</div>}
      </div>
    </div>
  )
}
