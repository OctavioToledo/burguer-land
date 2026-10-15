import { negocio } from '../data/business'
import { Logo } from './Logo'
import { Redes } from './Redes'

const ANIO = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="footer">
      <div className="contenedor footer__fila">
        <div className="footer__marca">
          <Logo />
          <p className="texto-suave">
            {negocio.direccion}, {negocio.localidad}, {negocio.provincia}
            <br />
            WhatsApp {negocio.whatsappVisible}
          </p>
        </div>
        <Redes />
      </div>
      <div className="contenedor footer__legal">
        <p>
          © {ANIO} {negocio.nombre}
        </p>
        <p>
          <a href={negocio.credito.url} target="_blank" rel="noopener" className="footer__credito">
            {negocio.credito.texto}
          </a>
        </p>
      </div>
    </footer>
  )
}
