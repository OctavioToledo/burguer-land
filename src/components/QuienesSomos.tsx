import { negocio } from '../data/business'
import { IconoPin } from './Iconos'
import { Revelar } from './Revelar'

export function QuienesSomos() {
  return (
    <section id="nosotros" className="seccion nosotros" aria-labelledby="nosotros-titulo">
      <div className="contenedor nosotros__grilla">
        <Revelar className="nosotros__texto">
          <div className="apertura apertura--izq">
            <p className="etiqueta apertura__ojal">Quiénes somos</p>
            <h2 id="nosotros-titulo" className="titulo-lg">
              Hechas en el momento
            </h2>
          </div>
          {negocio.historia.map((parrafo) => (
            <p key={parrafo} className="cuerpo nosotros__parrafo">
              {parrafo}
            </p>
          ))}
          <a href={negocio.mapsLink} target="_blank" rel="noopener noreferrer" className="boton boton--fantasma nosotros__ubicacion">
            <IconoPin width={18} height={18} />
            {negocio.direccion}, {negocio.localidad}
          </a>
        </Revelar>
        <Revelar retraso={120} className="nosotros__foto">
          <img src={negocio.fotos.local.src} alt={negocio.fotos.local.alt} width={640} height={640} loading="lazy" decoding="async" />
        </Revelar>
      </div>
    </section>
  )
}
