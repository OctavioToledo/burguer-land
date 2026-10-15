import { useEffect, useRef, type ElementType, type ReactNode } from 'react'

/** Aparece con un fundido suave la primera vez que entra en pantalla. */
export function Revelar({ as: Etiqueta = 'div', retraso = 0, className = '', children }: { as?: ElementType; retraso?: number; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      el.classList.add('visible')
      return
    }
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          el.classList.add('visible')
          observador.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    observador.observe(el)
    return () => observador.disconnect()
  }, [])

  return (
    <Etiqueta ref={ref} className={`revelar ${className}`} style={retraso ? { '--retraso': `${retraso}ms` } : undefined}>
      {children}
    </Etiqueta>
  )
}
