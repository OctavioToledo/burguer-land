import { useEffect, useState } from 'react'
import { useCarrito } from '../carrito/Carrito'
import { negocio } from '../data/business'
import { IconoBolsa, IconoCerrar, IconoMenu } from './Iconos'
import { Logo } from './Logo'

const ENLACES = [
  { href: '#menu', texto: 'Menú' },
  { href: '#nosotros', texto: 'Nosotros' },
  { href: '#como-pedir', texto: 'Cómo pedir' },
  { href: '#contacto', texto: 'Contacto' },
]

export function Header() {
  const { totales, abrir } = useCarrito()
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    if (!menuAbierto) return
    const alTeclear = (ev: KeyboardEvent) => ev.key === 'Escape' && setMenuAbierto(false)
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [menuAbierto])

  return (
    <header className="header">
      <div className="contenedor header__fila">
        <a href="#inicio" className="header__logo" aria-label={`${negocio.nombre}, ir al inicio`}>
          <Logo />
        </a>

        <nav aria-label="Principal" className="header__nav">
          <ul>
            {ENLACES.map((e) => (
              <li key={e.href}>
                <a href={e.href} className="header__enlace">
                  {e.texto}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__acciones">
          <button id="boton-carrito" type="button" onClick={abrir} className="header__carrito" aria-label={`Ver tu pedido, ${totales.cantidad} ${totales.cantidad === 1 ? 'producto' : 'productos'}`}>
            <IconoBolsa />
            <span className="header__carrito-texto">Tu pedido</span>
            {totales.cantidad > 0 && (
              <span className="contador" aria-hidden>
                {totales.cantidad}
              </span>
            )}
          </button>
          <button
            type="button"
            className="boton-icono header__hamburguesa"
            aria-expanded={menuAbierto}
            aria-controls="menu-mobile"
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMenuAbierto((v) => !v)}
          >
            {menuAbierto ? <IconoCerrar /> : <IconoMenu />}
          </button>
        </div>
      </div>

      <nav id="menu-mobile" aria-label="Principal (mobile)" className="menu-mobile" hidden={!menuAbierto}>
        <ul className="contenedor">
          {ENLACES.map((e) => (
            <li key={e.href}>
              <a href={e.href} className="menu-mobile__enlace" onClick={() => setMenuAbierto(false)}>
                {e.texto}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
