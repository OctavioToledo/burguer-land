import { useState } from 'react'
import { useCarrito } from '../carrito/Carrito'
import { adicional, precio } from '../lib/formato'
import { CANTIDAD_MAXIMA, alternarOpcion, erroresSeleccion, precioUnitario, type Seleccion } from '../lib/pedido'
import type { GrupoOpciones, Producto } from '../lib/tipos'
import { FotoProducto } from './FotoProducto'
import { Hoja } from './Hoja'
import { IconoMas, IconoMenos } from './Iconos'
import { Badge } from './TarjetaProducto'

function reglaGrupo(grupo: GrupoOpciones): string {
  if (grupo.tipo === 'unico') return grupo.obligatorio ? 'Elegí 1' : 'Opcional · hasta 1'
  if (grupo.maximo) return `${grupo.obligatorio ? 'Elegí' : 'Opcional ·'} hasta ${grupo.maximo}`
  return grupo.obligatorio ? 'Elegí al menos 1' : 'Opcional'
}

function Grupo({ grupo, seleccion, error, alCambiar }: { grupo: GrupoOpciones; seleccion: Seleccion; error?: string; alCambiar: (s: Seleccion) => void }) {
  const elegidas = seleccion[grupo.id] ?? []
  const lleno = grupo.tipo === 'multiple' && grupo.maximo !== undefined && elegidas.length >= grupo.maximo
  // Radio solo para "único obligatorio"; en los demás se usa checkbox para poder desmarcar.
  const tipo = grupo.tipo === 'unico' && grupo.obligatorio ? 'radio' : 'checkbox'
  const idError = `error-${grupo.id}`

  return (
    <fieldset className="grupo" id={`grupo-${grupo.id}`} aria-describedby={error ? idError : undefined}>
      <legend className="grupo__leyenda">
        <span className="grupo__nombre">{grupo.nombre}</span>
        <span className={`grupo__regla ${grupo.obligatorio ? 'grupo__regla--obligatorio' : ''}`}>{reglaGrupo(grupo)}</span>
      </legend>
      {error && (
        <p id={idError} className="error grupo__error">
          {error}
        </p>
      )}
      <div className="grupo__opciones">
        {grupo.opciones.map((o) => {
          const marcada = elegidas.includes(o.id)
          return (
            <label key={o.id} className={`opcion ${lleno && !marcada ? 'opcion--deshabilitada' : ''}`}>
              <input
                type={tipo}
                name={grupo.id}
                className={`opcion__control opcion__control--${tipo}`}
                checked={marcada}
                disabled={lleno && !marcada}
                onChange={() => alCambiar(alternarOpcion(seleccion, grupo, o.id))}
              />
              <span className="opcion__nombre">{o.nombre}</span>
              {o.precio > 0 && <span className="opcion__precio">{adicional(o.precio)}</span>}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export function ModalProducto({ producto }: { producto: Producto }) {
  const { agregar, avisar, cerrarProducto } = useCarrito()
  const [seleccion, setSeleccion] = useState<Seleccion>({})
  const [nota, setNota] = useState('')
  const [cantidad, setCantidad] = useState(1)
  const [mostrarErrores, setMostrarErrores] = useState(false)

  const errores = erroresSeleccion(producto, seleccion)
  const total = precioUnitario(producto, seleccion) * cantidad
  const grupos = producto.opciones ?? []

  const confirmar = () => {
    const primerError = grupos.find((g) => errores[g.id])
    if (primerError) {
      setMostrarErrores(true)
      const fieldset = document.getElementById(`grupo-${primerError.id}`)
      fieldset?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      fieldset?.querySelector<HTMLInputElement>('input:not(:disabled)')?.focus({ preventScroll: true })
      return
    }
    agregar({ productoId: producto.id, cantidad, seleccion, nota })
    avisar(`Agregaste ${cantidad > 1 ? `${cantidad} × ` : ''}${producto.nombre} a tu pedido`)
    cerrarProducto()
  }

  const pie = (
    <div className="modal__pie">
      <div className="cantidad" role="group" aria-label="Cantidad">
        <button type="button" className="boton-icono" onClick={() => setCantidad((c) => Math.max(1, c - 1))} disabled={cantidad <= 1} aria-label="Restar uno">
          <IconoMenos width={20} height={20} />
        </button>
        <span className="cantidad__valor" aria-live="polite">
          {cantidad}
        </span>
        <button type="button" className="boton-icono" onClick={() => setCantidad((c) => Math.min(CANTIDAD_MAXIMA, c + 1))} aria-label="Sumar uno">
          <IconoMas width={20} height={20} />
        </button>
      </div>
      <button type="button" className="boton boton--primario boton--grande modal__agregar" onClick={confirmar}>
        Agregar · {precio(total)}
      </button>
    </div>
  )

  return (
    <Hoja
      titulo={producto.nombre}
      tituloOculto
      variante="centro"
      alCerrar={cerrarProducto}
      pie={pie}
      cabecera={
        <div className="modal__foto">
          <FotoProducto producto={producto} sizes="(min-width: 640px) 560px, 100vw" prioridad />
        </div>
      }
    >
      <div className="modal__contenido">
        <div className="modal__encabezado">
          <Badge producto={producto} />
          <p className="nombre-producto modal__nombre" aria-hidden>
            {producto.nombre}
          </p>
          <p className="texto-suave">{producto.descripcion}</p>
          <p className="modal__precio">{precio(producto.precio)}</p>
        </div>

        {grupos.map((g) => (
          <Grupo key={g.id} grupo={g} seleccion={seleccion} error={mostrarErrores ? errores[g.id] : undefined} alCambiar={setSeleccion} />
        ))}

        <div className="campo">
          <label htmlFor="nota" className="campo__etiqueta">
            Aclaraciones <span className="campo__opcional">(opcional)</span>
          </label>
          <textarea id="nota" className="entrada" rows={2} maxLength={200} placeholder="Ej.: sin sal, pan bien tostado" value={nota} onChange={(e) => setNota(e.target.value)} />
        </div>
      </div>
    </Hoja>
  )
}
