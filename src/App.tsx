import { ProveedorCarrito, useCarrito } from './carrito/Carrito'
import { Aviso } from './components/Aviso'
import { BarraCarrito } from './components/BarraCarrito'
import { BotonWhatsApp } from './components/BotonWhatsApp'
import { ComoPedir } from './components/ComoPedir'
import { Contacto } from './components/Contacto'
import { Destacados } from './components/Destacados'
import { DrawerCarrito } from './components/DrawerCarrito'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Menu } from './components/Menu'
import { ModalProducto } from './components/ModalProducto'
import { QuienesSomos } from './components/QuienesSomos'

function Hojas() {
  const { abierto, producto } = useCarrito()
  return (
    <>
      {producto && <ModalProducto key={producto.id} producto={producto} />}
      {abierto && <DrawerCarrito />}
    </>
  )
}

export default function App() {
  return (
    <ProveedorCarrito>
      <a href="#menu" className="saltar">
        Saltar al menú
      </a>
      <Header />
      <main>
        <Hero />
        <Destacados />
        <Menu />
        <QuienesSomos />
        <ComoPedir />
        <Contacto />
      </main>
      <Footer />
      <BotonWhatsApp />
      <BarraCarrito />
      <Aviso />
      <Hojas />
    </ProveedorCarrito>
  )
}
