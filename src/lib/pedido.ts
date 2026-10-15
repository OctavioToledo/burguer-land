import { precio } from './formato'
import type { GrupoOpciones, Opcion, Producto } from './tipos'

/** Opciones elegidas: id del grupo → ids de las opciones. */
export type Seleccion = Record<string, string[]>

/** Lo que se guarda en localStorage: solo ids, cantidades y texto. Los precios se leen siempre del catálogo. */
export interface ItemPedido {
  productoId: string
  cantidad: number
  seleccion: Seleccion
  nota: string
}

/** Una línea ya resuelta contra el catálogo, lista para mostrar o para armar el mensaje. */
export interface Linea extends ItemPedido {
  clave: string
  producto: Producto
  /** Opciones elegidas en el orden de los grupos del producto. */
  elegidas: { grupo: GrupoOpciones; opcion: Opcion }[]
  unitario: number
  subtotal: number
}

export const CANTIDAD_MAXIMA = 99

/* ---------- Opciones ---------- */

export function opcionesElegidas(producto: Producto, seleccion: Seleccion): Linea['elegidas'] {
  return (producto.opciones ?? []).flatMap((grupo) =>
    grupo.opciones.filter((o) => seleccion[grupo.id]?.includes(o.id)).map((opcion) => ({ grupo, opcion })),
  )
}

export function precioUnitario(producto: Producto, seleccion: Seleccion): number {
  return producto.precio + opcionesElegidas(producto, seleccion).reduce((s, e) => s + e.opcion.precio, 0)
}

/** Marca o desmarca una opción respetando el tipo de grupo y el máximo. */
export function alternarOpcion(seleccion: Seleccion, grupo: GrupoOpciones, opcionId: string): Seleccion {
  const actuales = seleccion[grupo.id] ?? []
  const marcada = actuales.includes(opcionId)
  let nuevas: string[]
  if (grupo.tipo === 'unico') {
    // En un grupo único no obligatorio, tocar de nuevo la opción elegida la desmarca.
    nuevas = marcada ? (grupo.obligatorio ? actuales : []) : [opcionId]
  } else if (marcada) {
    nuevas = actuales.filter((id) => id !== opcionId)
  } else {
    if (grupo.maximo !== undefined && actuales.length >= grupo.maximo) return seleccion
    nuevas = [...actuales, opcionId]
  }
  const resto = { ...seleccion }
  if (nuevas.length) resto[grupo.id] = nuevas
  else delete resto[grupo.id]
  return resto
}

/** Errores por grupo: id del grupo → mensaje. Vacío si la selección es válida. */
export function erroresSeleccion(producto: Producto, seleccion: Seleccion): Record<string, string> {
  const errores: Record<string, string> = {}
  for (const grupo of producto.opciones ?? []) {
    const n = (seleccion[grupo.id] ?? []).filter((id) => grupo.opciones.some((o) => o.id === id)).length
    if (grupo.obligatorio && n === 0) errores[grupo.id] = `Elegí una opción de "${grupo.nombre}".`
    else if (grupo.tipo === 'unico' && n > 1) errores[grupo.id] = `Elegí una sola opción de "${grupo.nombre}".`
    else if (grupo.maximo !== undefined && n > grupo.maximo) errores[grupo.id] = `Podés elegir hasta ${grupo.maximo} en "${grupo.nombre}".`
  }
  return errores
}

/* ---------- Líneas del pedido ---------- */

/** Mismo producto con las mismas opciones y la misma nota = misma línea. */
export function claveLinea(item: Omit<ItemPedido, 'cantidad'>): string {
  const opciones = Object.keys(item.seleccion)
    .sort()
    .map((g) => `${g}:${[...item.seleccion[g]].sort().join(',')}`)
    .join(';')
  return `${item.productoId}|${opciones}|${item.nota.trim().toLowerCase()}`
}

export function agregarItem(items: ItemPedido[], nuevo: ItemPedido): ItemPedido[] {
  const item = { ...nuevo, nota: nuevo.nota.trim() }
  const clave = claveLinea(item)
  const existente = items.find((i) => claveLinea(i) === clave)
  if (!existente) return [...items, item]
  return items.map((i) => (i === existente ? { ...i, cantidad: Math.min(CANTIDAD_MAXIMA, i.cantidad + item.cantidad) } : i))
}

export function cambiarCantidad(items: ItemPedido[], clave: string, cantidad: number): ItemPedido[] {
  if (cantidad <= 0) return items.filter((i) => claveLinea(i) !== clave)
  return items.map((i) => (claveLinea(i) === clave ? { ...i, cantidad: Math.min(CANTIDAD_MAXIMA, cantidad) } : i))
}

export function resolverLineas(items: ItemPedido[], buscar: (id: string) => Producto | undefined): Linea[] {
  return items.flatMap((item) => {
    const producto = buscar(item.productoId)
    if (!producto) return []
    const unitario = precioUnitario(producto, item.seleccion)
    return [{ ...item, clave: claveLinea(item), producto, elegidas: opcionesElegidas(producto, item.seleccion), unitario, subtotal: unitario * item.cantidad }]
  })
}

/**
 * Valida lo que vino de localStorage: descarta productos que ya no existen o no están disponibles,
 * opciones que se sacaron del catálogo y líneas que quedaron sin una opción obligatoria.
 */
export function sanearItems(crudo: unknown, buscar: (id: string) => Producto | undefined): ItemPedido[] {
  if (!Array.isArray(crudo)) return []
  let items: ItemPedido[] = []
  for (const x of crudo) {
    if (!x || typeof x !== 'object') continue
    const { productoId, cantidad, seleccion, nota } = x as Record<string, unknown>
    if (typeof productoId !== 'string' || typeof cantidad !== 'number' || !Number.isInteger(cantidad) || cantidad < 1) continue
    const producto = buscar(productoId)
    if (!producto?.disponible) continue
    const limpia: Seleccion = {}
    if (seleccion && typeof seleccion === 'object') {
      for (const grupo of producto.opciones ?? []) {
        const ids = (seleccion as Record<string, unknown>)[grupo.id]
        if (!Array.isArray(ids)) continue
        const validas = ids.filter((id): id is string => typeof id === 'string' && grupo.opciones.some((o) => o.id === id))
        if (validas.length) limpia[grupo.id] = [...new Set(validas)]
      }
    }
    if (Object.keys(erroresSeleccion(producto, limpia)).length) continue
    items = agregarItem(items, { productoId, cantidad: Math.min(cantidad, CANTIDAD_MAXIMA), seleccion: limpia, nota: typeof nota === 'string' ? nota.slice(0, 200) : '' })
  }
  return items
}

/* ---------- Checkout ---------- */

export type Entrega = 'retiro' | 'delivery'
export type Pago = 'efectivo' | 'transferencia'

export interface DatosPedido {
  nombre: string
  entrega: Entrega
  direccion: string
  referencia: string
  pago: Pago
  /** Solo dígitos, tal como lo escribió el cliente. */
  pagaCon: string
  comentarios: string
}

export const DATOS_VACIOS: DatosPedido = { nombre: '', entrega: 'retiro', direccion: '', referencia: '', pago: 'efectivo', pagaCon: '', comentarios: '' }

export function sanearDatos(crudo: unknown, pagos: Pago[]): DatosPedido {
  const datos = { ...DATOS_VACIOS, pago: pagos[0] ?? DATOS_VACIOS.pago }
  if (!crudo || typeof crudo !== 'object') return datos
  const x = crudo as Record<string, unknown>
  for (const campo of ['nombre', 'direccion', 'referencia', 'pagaCon', 'comentarios'] as const) {
    if (typeof x[campo] === 'string') datos[campo] = (x[campo] as string).slice(0, 300)
  }
  if (x.entrega === 'retiro' || x.entrega === 'delivery') datos.entrega = x.entrega
  if ((x.pago === 'efectivo' || x.pago === 'transferencia') && pagos.includes(x.pago)) datos.pago = x.pago
  return datos
}

export function totales(lineas: Linea[], entrega: Entrega, costoEnvio: number) {
  const subtotal = lineas.reduce((s, l) => s + l.subtotal, 0)
  const envio = entrega === 'delivery' && lineas.length > 0 ? costoEnvio : 0
  return { subtotal, envio, total: subtotal + envio, cantidad: lineas.reduce((s, l) => s + l.cantidad, 0) }
}

export type Totales = ReturnType<typeof totales>

/** Monto en pesos a partir de lo que se escribió ("15.000", "$ 15000" → 15000). */
export function montoDe(texto: string): number {
  const digitos = texto.replace(/\D/g, '')
  return digitos ? Number(digitos) : 0
}

/** Errores del formulario: campo → mensaje. */
export function erroresDatos(datos: DatosPedido, total: number): Partial<Record<keyof DatosPedido, string>> {
  const errores: Partial<Record<keyof DatosPedido, string>> = {}
  if (!datos.nombre.trim()) errores.nombre = 'Escribí tu nombre.'
  if (datos.entrega === 'delivery' && !datos.direccion.trim()) errores.direccion = 'Escribí la dirección de entrega.'
  if (datos.pago === 'efectivo' && datos.pagaCon.trim() && montoDe(datos.pagaCon) < total) {
    errores.pagaCon = `Tiene que ser igual o mayor al total (${precio(total)}).`
  }
  return errores
}

/* ---------- Mensaje de WhatsApp ---------- */

export function armarMensaje(nombreNegocio: string, lineas: Linea[], datos: DatosPedido, t: Totales, cerrado = false): string {
  const r: string[] = [`🍔 *Nuevo pedido - ${nombreNegocio}*`, '']
  if (cerrado) r.push('_Pedido hecho con el local cerrado: se prepara cuando abramos._', '')

  r.push(`*Cliente:* ${datos.nombre.trim()}`)
  if (datos.entrega === 'delivery') {
    r.push('*Entrega:* Delivery')
    const ref = datos.referencia.trim()
    r.push(`*Dirección:* ${datos.direccion.trim()}${ref ? ` (${ref})` : ''}`)
  } else {
    r.push('*Entrega:* Retiro en el local')
  }

  r.push('', '*Pedido:*')
  for (const l of lineas) {
    r.push(`${l.cantidad}x ${l.producto.nombre} — ${precio(l.subtotal)}`)
    const conPrecio = l.elegidas.filter((e) => e.opcion.precio > 0).map((e) => `+ ${e.opcion.nombre}`)
    const sinPrecio = l.elegidas.filter((e) => e.opcion.precio === 0).map((e) => e.opcion.nombre)
    if (conPrecio.length) r.push(`   ${conPrecio.join(', ')}`)
    if (sinPrecio.length) r.push(`   ${sinPrecio.join(', ')}`)
    if (l.nota.trim()) r.push(`   _Nota: ${l.nota.trim()}_`)
  }

  r.push('', `Subtotal: ${precio(t.subtotal)}`)
  if (datos.entrega === 'delivery') r.push(`Envío: ${precio(t.envio)}`)
  r.push(`*TOTAL: ${precio(t.total)}*`, '')

  if (datos.pago === 'efectivo') {
    const monto = montoDe(datos.pagaCon)
    r.push(`*Pago:* Efectivo${monto ? ` (paga con ${precio(monto)})` : ''}`)
  } else {
    r.push('*Pago:* Transferencia')
  }
  if (datos.comentarios.trim()) r.push(`*Comentarios:* ${datos.comentarios.trim()}`)

  return r.join('\n')
}
