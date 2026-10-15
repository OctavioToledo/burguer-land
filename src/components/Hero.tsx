import { negocio } from '../data/business'
import { linkWhatsApp } from '../lib/whatsapp'
import { EstadoLocal } from './EstadoLocal'
import { IconoFlecha, IconoWhatsApp } from './Iconos'

/** Las fotos del hero tienen dos tamaños: "nombre.webp" (640 px) y "nombre-320.webp". */
function FotoHero({ foto, clase, sizes, prioridad = false }: { foto: { src: string; alt: string }; clase: string; sizes: string; prioridad?: boolean }) {
  const chica = foto.src.replace(/\.webp$/, '-320.webp')
  return (
    <img
      src={foto.src}
      srcSet={`${chica} 320w, ${foto.src} 640w`}
      sizes={sizes}
      alt={foto.alt}
      width={640}
      height={640}
      className={`hero__foto ${clase}`}
      fetchPriority={prioridad ? 'high' : undefined}
      decoding="async"
    />
  )
}

export function Hero() {
  const [foto1, foto2, foto3] = negocio.fotos.hero
  return (
    <section id="inicio" className="hero" aria-labelledby="hero-titulo">
      {foto1 && <FotoHero foto={foto1} clase="hero__foto--1" sizes="(min-width: 768px) 360px, 38vw" prioridad />}
      {foto2 && <FotoHero foto={foto2} clase="hero__foto--2" sizes="(min-width: 768px) 280px, 30vw" />}
      {foto3 && <FotoHero foto={foto3} clase="hero__foto--3" sizes="(min-width: 768px) 240px, 34vw" />}

      <div className="contenedor hero__contenido">
        <EstadoLocal />
        <h1 id="hero-titulo" className="display hero__titulo">
          {negocio.nombre}
          <span className="hero__bajada">{negocio.bajada}</span>
        </h1>
        <p className="cuerpo texto-suave hero__slogan">{negocio.slogan}</p>
        <div className="hero__ctas">
          <a href="#menu" className="boton boton--primario boton--grande">
            Ver menú
            <IconoFlecha width={18} height={18} />
          </a>
          <a href={linkWhatsApp(`¡Hola ${negocio.nombre}! Quiero hacer un pedido.`)} target="_blank" rel="noopener noreferrer" className="boton boton--fantasma boton--grande">
            <IconoWhatsApp width={18} height={18} />
            Pedir por WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
