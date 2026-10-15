import { Revelar } from './Revelar'

const PASOS = [
  { titulo: 'Elegí', texto: 'Mirá el menú y tocá lo que te tiente. Sumale agregados, sacale lo que no va.' },
  { titulo: 'Armá tu pedido', texto: 'Revisá tu pedido, poné tu nombre y elegí retiro o delivery y cómo pagás.' },
  { titulo: 'Enviá por WhatsApp', texto: 'Se abre WhatsApp con el pedido escrito. Lo mandás y te confirmamos al toque.' },
]

export function ComoPedir() {
  return (
    <section id="como-pedir" className="seccion como-pedir" aria-labelledby="como-pedir-titulo">
      <div className="contenedor">
        <div className="apertura">
          <p className="etiqueta apertura__ojal">Fácil y sin vueltas</p>
          <h2 id="como-pedir-titulo" className="titulo-lg">
            Cómo pedir
          </h2>
        </div>
        <ol className="pasos">
          {PASOS.map((p, i) => (
            <Revelar as="li" key={p.titulo} retraso={i * 100} className="paso">
              <span className="paso__numero" aria-hidden>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="nombre-producto paso__titulo">{p.titulo}</h3>
              <p className="texto-suave">{p.texto}</p>
            </Revelar>
          ))}
        </ol>
        <div className="como-pedir__cta">
          <a href="#menu" className="boton boton--primario boton--grande">
            Empezá tu pedido
          </a>
        </div>
      </div>
    </section>
  )
}
