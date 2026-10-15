import { useState } from 'react'
import { negocio } from '../data/business'
import { precio } from '../lib/formato'
import { NOMBRES_DIA, ORDEN_SEMANA, momentoLocal, textoTurnos } from '../lib/horarios'
import { linkWhatsApp } from '../lib/whatsapp'
import { EstadoLocal } from './EstadoLocal'
import { IconoMoto, IconoPin, IconoReloj, IconoTarjeta, IconoWhatsApp } from './Iconos'
import { Redes } from './Redes'
import { Revelar } from './Revelar'

export function Contacto() {
  const [hoy] = useState(() => momentoLocal(new Date(), negocio.zonaHoraria).dia)
  const pagos = negocio.mediosDePago.map((m) => (m === 'efectivo' ? 'Efectivo' : 'Transferencia')).join(' y ')

  return (
    <section id="contacto" className="seccion contacto" aria-labelledby="contacto-titulo">
      <div className="contenedor">
        <div className="apertura">
          <p className="etiqueta apertura__ojal">Vení o pedí</p>
          <h2 id="contacto-titulo" className="titulo-lg">
            Dónde y cuándo
          </h2>
        </div>

        <div className="contacto__grilla">
          <Revelar className="bloque">
            <h3 className="bloque__titulo">
              <IconoPin width={20} height={20} /> Dirección
            </h3>
            <p className="cuerpo">
              {negocio.direccion}
              <br />
              <span className="texto-suave">
                {negocio.localidad}, {negocio.provincia}
              </span>
            </p>
            {negocio.mapsEmbed && (
              <div className="mapa">
                <iframe src={negocio.mapsEmbed} title={`Mapa: ${negocio.direccion}, ${negocio.localidad}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            )}
            <a href={negocio.mapsLink} target="_blank" rel="noopener noreferrer" className="boton boton--fantasma">
              <IconoPin width={18} height={18} />
              Cómo llegar
            </a>
          </Revelar>

          <Revelar retraso={100} className="bloque">
            <h3 className="bloque__titulo">
              <IconoReloj width={20} height={20} /> Horarios
            </h3>
            <EstadoLocal />
            <table className="horarios">
              <caption className="sr-only">Horarios de atención</caption>
              <tbody>
                {ORDEN_SEMANA.map((d) => (
                  <tr key={d} className={d === hoy ? 'horarios__hoy' : ''} aria-current={d === hoy ? 'date' : undefined}>
                    <th scope="row">
                      {NOMBRES_DIA[d]}
                      {d === hoy && <span className="horarios__marca">Hoy</span>}
                    </th>
                    <td>
                      {negocio.horarios[d].length === 0
                        ? textoTurnos([])
                        : negocio.horarios[d].map((t) => (
                            <span key={t.abre} className="horarios__turno">
                              {textoTurnos([t])}
                            </span>
                          ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Revelar>

          <Revelar retraso={200} className="bloque">
            <h3 className="bloque__titulo">
              <IconoMoto width={20} height={20} /> Delivery
            </h3>
            <p>
              Envío {precio(negocio.envio.costo)} · {negocio.envio.demora}
              <br />
              <span className="texto-suave">Pedido mínimo {precio(negocio.pedidoMinimo)}</span>
            </p>
            <ul className="zonas" aria-label="Zonas de delivery">
              {negocio.envio.zonas.map((z) => (
                <li key={z} className="zonas__zona">
                  {z}
                </li>
              ))}
            </ul>
            <h3 className="bloque__titulo bloque__titulo--sub">
              <IconoTarjeta width={20} height={20} /> Pagos
            </h3>
            <p>{pagos}</p>
            <h3 className="bloque__titulo bloque__titulo--sub">
              <IconoWhatsApp width={20} height={20} /> Contacto
            </h3>
            <a href={linkWhatsApp(`¡Hola ${negocio.nombre}! Quería hacerles una consulta.`)} target="_blank" rel="noopener noreferrer" className="enlace">
              {negocio.whatsappVisible}
            </a>
            <Redes className="contacto__redes" />
          </Revelar>
        </div>
      </div>
    </section>
  )
}
