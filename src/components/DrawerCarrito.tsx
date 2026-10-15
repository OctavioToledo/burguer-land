import { useState, type ReactNode } from 'react'
import { useCarrito } from '../carrito/Carrito'
import { negocio } from '../data/business'
import { plural, precio } from '../lib/formato'
import { CANTIDAD_MAXIMA, armarMensaje, erroresDatos, type DatosPedido, type Linea } from '../lib/pedido'
import { urlImagen } from '../lib/catalogo'
import { textoEstado } from '../lib/horarios'
import { useEstadoLocal } from '../lib/useEstadoLocal'
import { linkWhatsApp } from '../lib/whatsapp'
import { Hoja } from './Hoja'
import { IconoAlerta, IconoCopiar, IconoMas, IconoMenos, IconoMoto, IconoTacho, IconoTienda, IconoWhatsApp } from './Iconos'

function Campo({ id, etiqueta, opcional, error, children }: { id: string; etiqueta: string; opcional?: boolean; error?: string; children: ReactNode }) {
  return (
    <div className="campo">
      <label htmlFor={id} className="campo__etiqueta">
        {etiqueta} {opcional && <span className="campo__opcional">(opcional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="error">
          {error}
        </p>
      )}
    </div>
  )
}

function LineaCarrito({ linea }: { linea: Linea }) {
  const { cambiarCantidad } = useCarrito()
  const conPrecio = linea.elegidas.filter((e) => e.opcion.precio > 0).map((e) => `+ ${e.opcion.nombre}`)
  const sinPrecio = linea.elegidas.filter((e) => e.opcion.precio === 0).map((e) => e.opcion.nombre)
  const nombre = linea.producto.nombre

  return (
    <li className="linea">
      <img src={urlImagen(linea.producto.imagen, 400)} alt="" width={64} height={48} loading="lazy" className="linea__foto" />
      <div className="linea__info">
        <div className="linea__fila">
          <p className="linea__nombre">{nombre}</p>
          <p className="linea__subtotal">{precio(linea.subtotal)}</p>
        </div>
        {conPrecio.length > 0 && <p className="linea__detalle">{conPrecio.join(', ')}</p>}
        {sinPrecio.length > 0 && <p className="linea__detalle">{sinPrecio.join(', ')}</p>}
        {linea.nota && <p className="linea__detalle linea__nota">Nota: {linea.nota}</p>}
        <div className="linea__fila linea__acciones">
          <div className="cantidad" role="group" aria-label={`Cantidad de ${nombre}`}>
            <button type="button" className="boton-icono" onClick={() => cambiarCantidad(linea.clave, linea.cantidad - 1)} disabled={linea.cantidad <= 1} aria-label={`Restar uno de ${nombre}`}>
              <IconoMenos width={18} height={18} />
            </button>
            <span className="cantidad__valor">{linea.cantidad}</span>
            <button type="button" className="boton-icono" onClick={() => cambiarCantidad(linea.clave, linea.cantidad + 1)} disabled={linea.cantidad >= CANTIDAD_MAXIMA} aria-label={`Sumar uno de ${nombre}`}>
              <IconoMas width={18} height={18} />
            </button>
          </div>
          {linea.cantidad > 1 && <span className="linea__unitario">{precio(linea.unitario)} c/u</span>}
          <button type="button" className="boton-icono linea__eliminar" onClick={() => cambiarCantidad(linea.clave, 0)} aria-label={`Eliminar ${nombre} del pedido`}>
            <IconoTacho width={20} height={20} />
          </button>
        </div>
      </div>
    </li>
  )
}

export function DrawerCarrito() {
  const { lineas, totales, vacio, datos, setDatos, vaciar, cerrar } = useCarrito()
  const estado = useEstadoLocal()
  const [intentado, setIntentado] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [confirmandoVaciar, setConfirmandoVaciar] = useState(false)
  const [copiado, setCopiado] = useState(false)

  const faltaMinimo = Math.max(0, negocio.pedidoMinimo - totales.subtotal)
  const delivery = datos.entrega === 'delivery'
  // Los errores aparecen recién después del primer intento de envío, y se actualizan mientras se escribe.
  const errores = intentado ? erroresDatos(datos, totales.total) : {}
  const cambiar = (cambio: Partial<DatosPedido>) => setDatos(cambio)

  const enviar = () => {
    const nuevos = erroresDatos(datos, totales.total)
    setIntentado(true)
    const primero = (['nombre', 'direccion', 'pagaCon'] as const).find((c) => nuevos[c])
    if (primero) {
      document.getElementById(`dato-${primero}`)?.focus()
      return
    }
    if (faltaMinimo > 0 || vacio) return
    const mensaje = armarMensaje(negocio.nombre, lineas, datos, totales, !estado.abierto)
    window.open(linkWhatsApp(mensaje), '_blank', 'noopener,noreferrer')
    setEnviado(true)
  }

  const confirmarVaciado = () => {
    vaciar()
    setEnviado(false)
    setConfirmandoVaciar(false)
    cerrar()
  }

  const copiarAlias = async () => {
    try {
      await navigator.clipboard.writeText(negocio.transferencia.alias)
      setCopiado(true)
      window.setTimeout(() => setCopiado(false), 2000)
    } catch {
      // Sin permiso para el portapapeles: el alias igual queda a la vista.
    }
  }

  const bloqueVaciar = confirmandoVaciar ? (
    <div className="aviso-bloque aviso-bloque--columna" role="alert">
      <p>
        <strong>¿Vaciar el pedido?</strong> Se quitan todos los productos.
      </p>
      <div className="fila-botones">
        <button type="button" className="boton boton--primario" onClick={confirmarVaciado}>
          Sí, vaciar
        </button>
        <button type="button" className="boton boton--fantasma" onClick={() => setConfirmandoVaciar(false)}>
          Cancelar
        </button>
      </div>
    </div>
  ) : null

  if (enviado) {
    return (
      <Hoja titulo="Tu pedido" variante="lateral" alCerrar={cerrar}>
        <div className="carrito__enviado">
          <p className="titulo">¡Listo! Se abrió WhatsApp</p>
          <p className="texto-suave">Revisá el mensaje y tocá enviar en WhatsApp. Si ya lo enviaste, podés vaciar el pedido. Si no se abrió o volviste sin enviarlo, tu pedido sigue acá.</p>
          {bloqueVaciar ?? (
            <button type="button" className="boton boton--primario boton--grande boton--ancho" onClick={() => setConfirmandoVaciar(true)}>
              Vaciar carrito
            </button>
          )}
          <button type="button" className="boton boton--fantasma boton--grande boton--ancho" onClick={() => setEnviado(false)}>
            Volver al pedido
          </button>
        </div>
      </Hoja>
    )
  }

  if (vacio) {
    return (
      <Hoja titulo="Tu pedido" variante="lateral" alCerrar={cerrar}>
        <div className="carrito__vacio">
          <p className="titulo">Tu pedido está vacío</p>
          <p className="texto-suave">Elegí algo del menú y aparece acá.</p>
          <a href="#menu" className="boton boton--primario boton--grande" onClick={cerrar}>
            Ver menú
          </a>
        </div>
      </Hoja>
    )
  }

  const pie = (
    <div className="carrito__pie">
      <dl className="resumen">
        <div>
          <dt>Subtotal</dt>
          <dd>{precio(totales.subtotal)}</dd>
        </div>
        <div>
          <dt>Envío</dt>
          <dd>{delivery ? precio(totales.envio) : 'Sin cargo (retiro)'}</dd>
        </div>
        <div className="resumen__total">
          <dt>Total</dt>
          <dd>{precio(totales.total)}</dd>
        </div>
      </dl>
      {faltaMinimo > 0 && (
        <p id="motivo-minimo" className="error">
          Te faltan {precio(faltaMinimo)} para el pedido mínimo de {precio(negocio.pedidoMinimo)}.
        </p>
      )}
      <button type="button" className="boton boton--primario boton--grande boton--ancho" onClick={enviar} disabled={faltaMinimo > 0} aria-describedby={faltaMinimo > 0 ? 'motivo-minimo' : undefined}>
        <IconoWhatsApp width={20} height={20} />
        Enviar pedido por WhatsApp
      </button>
    </div>
  )

  return (
    <Hoja titulo="Tu pedido" variante="lateral" alCerrar={cerrar} pie={pie}>
      <div className="carrito">
        {!estado.abierto && (
          <div className="aviso-bloque" role="note">
            <IconoAlerta />
            <p>
              <strong>Estamos cerrados</strong>, tu pedido se recibirá cuando abramos. <span className="sr-only">Estado: </span>
              {textoEstado(estado).replace('Cerrado · ', '').replace(/^./, (c) => c.toUpperCase())}.
            </p>
          </div>
        )}

        <section aria-label="Productos">
          <ul className="lineas">
            {lineas.map((l) => (
              <LineaCarrito key={l.clave} linea={l} />
            ))}
          </ul>
          <p className="carrito__cantidad texto-suave">
            {plural(totales.cantidad, 'producto')} ·{' '}
            <a href="#menu" className="enlace" onClick={cerrar}>
              Agregar más
            </a>
          </p>
        </section>

        <form
          className="checkout"
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            enviar()
          }}
        >
          <h3 className="checkout__titulo">Tus datos</h3>

          <Campo id="dato-nombre" etiqueta="Nombre" error={errores.nombre}>
            <input
              id="dato-nombre"
              className="entrada"
              type="text"
              autoComplete="given-name"
              required
              value={datos.nombre}
              onChange={(e) => cambiar({ nombre: e.target.value })}
              aria-invalid={!!errores.nombre}
              aria-describedby={errores.nombre ? 'dato-nombre-error' : undefined}
            />
          </Campo>

          <fieldset className="campo">
            <legend className="campo__etiqueta">Entrega</legend>
            <div className="selector">
              <label className="pastilla selector__opcion">
                <input type="radio" name="entrega" className="sr-only" checked={!delivery} onChange={() => cambiar({ entrega: 'retiro' })} />
                <IconoTienda width={18} height={18} />
                Retiro en local
              </label>
              <label className="pastilla selector__opcion">
                <input type="radio" name="entrega" className="sr-only" checked={delivery} onChange={() => cambiar({ entrega: 'delivery' })} />
                <IconoMoto width={18} height={18} />
                Delivery
              </label>
            </div>
            <p className="campo__ayuda">
              {delivery
                ? `Envío ${precio(negocio.envio.costo)} · llega en ${negocio.envio.demora}. Zonas: ${negocio.envio.zonas.join(', ')}.`
                : `Retirás en ${negocio.direccion}, ${negocio.localidad} · listo en ${negocio.retiro.demora}.`}
            </p>
          </fieldset>

          {delivery && (
            <>
              <Campo id="dato-direccion" etiqueta="Dirección" error={errores.direccion}>
                <input
                  id="dato-direccion"
                  className="entrada"
                  type="text"
                  autoComplete="street-address"
                  required
                  placeholder="Calle, número, piso o depto"
                  value={datos.direccion}
                  onChange={(e) => cambiar({ direccion: e.target.value })}
                  aria-invalid={!!errores.direccion}
                  aria-describedby={errores.direccion ? 'dato-direccion-error' : undefined}
                />
              </Campo>
              <Campo id="dato-referencia" etiqueta="Entre calles o referencia" opcional>
                <input id="dato-referencia" className="entrada" type="text" placeholder="Ej.: entre Mitre y Belgrano, portón negro" value={datos.referencia} onChange={(e) => cambiar({ referencia: e.target.value })} />
              </Campo>
            </>
          )}

          {negocio.mediosDePago.length > 0 && (
            <fieldset className="campo">
              <legend className="campo__etiqueta">Forma de pago</legend>
              <div className="selector">
                {negocio.mediosDePago.map((m) => (
                  <label key={m} className="pastilla selector__opcion">
                    <input type="radio" name="pago" className="sr-only" checked={datos.pago === m} onChange={() => cambiar({ pago: m })} />
                    {m === 'efectivo' ? 'Efectivo' : 'Transferencia'}
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {datos.pago === 'efectivo' && (
            <Campo id="dato-pagaCon" etiqueta="¿Con cuánto pagás?" opcional error={errores.pagaCon}>
              <input
                id="dato-pagaCon"
                className="entrada"
                type="text"
                inputMode="numeric"
                placeholder={`Ej.: ${precio(Math.ceil(totales.total / 10000) * 10000 || 10000)}`}
                value={datos.pagaCon}
                onChange={(e) => cambiar({ pagaCon: e.target.value.replace(/[^\d.$ ]/g, '') })}
                aria-invalid={!!errores.pagaCon}
                aria-describedby={errores.pagaCon ? 'dato-pagaCon-error' : 'dato-pagaCon-ayuda'}
              />
              {!errores.pagaCon && (
                <p id="dato-pagaCon-ayuda" className="campo__ayuda">
                  Así te llevamos el cambio justo.
                </p>
              )}
            </Campo>
          )}

          {datos.pago === 'transferencia' && (
            <div className="transferencia">
              <p className="campo__ayuda">Transferí el total a este alias y mandanos el comprobante por WhatsApp:</p>
              <div className="transferencia__alias">
                <div>
                  <p className="transferencia__valor">{negocio.transferencia.alias}</p>
                  <p className="campo__ayuda">{negocio.transferencia.titular}</p>
                </div>
                <button type="button" className="boton boton--fantasma" onClick={copiarAlias}>
                  <IconoCopiar width={18} height={18} />
                  {copiado ? 'Copiado' : 'Copiar'}
                </button>
              </div>
            </div>
          )}

          <Campo id="dato-comentarios" etiqueta="Comentarios" opcional>
            <textarea id="dato-comentarios" className="entrada" rows={2} maxLength={300} placeholder="Ej.: tocar timbre 2" value={datos.comentarios} onChange={(e) => cambiar({ comentarios: e.target.value })} />
          </Campo>
        </form>

        <div className="carrito__vaciar">
          {bloqueVaciar ?? (
            <button type="button" className="enlace carrito__vaciar-boton" onClick={() => setConfirmandoVaciar(true)}>
              Vaciar carrito
            </button>
          )}
        </div>
      </div>
    </Hoja>
  )
}
