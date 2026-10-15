import { describe, expect, it } from 'vitest'
import { buscarProducto } from './catalogo'
import {
  DATOS_VACIOS,
  agregarItem,
  alternarOpcion,
  armarMensaje,
  cambiarCantidad,
  claveLinea,
  erroresDatos,
  erroresSeleccion,
  montoDe,
  resolverLineas,
  sanearDatos,
  sanearItems,
  totales,
  type DatosPedido,
  type ItemPedido,
} from './pedido'
import type { GrupoOpciones, Producto } from './tipos'

const doble = buscarProducto('doble-cheddar')!
const grupo = (p: Producto, id: string) => p.opciones!.find((g) => g.id === id)!

describe('alternarOpcion', () => {
  const unicoOpcional: GrupoOpciones = { id: 'c', nombre: 'C', tipo: 'unico', obligatorio: false, opciones: [{ id: 'a', nombre: 'A', precio: 0 }, { id: 'b', nombre: 'B', precio: 0 }] }
  const unicoObligatorio = { ...unicoOpcional, obligatorio: true }
  const multiple: GrupoOpciones = { ...unicoOpcional, tipo: 'multiple', maximo: 1 }

  it('único reemplaza la opción y se desmarca solo si no es obligatorio', () => {
    let s = alternarOpcion({}, unicoOpcional, 'a')
    s = alternarOpcion(s, unicoOpcional, 'b')
    expect(s).toEqual({ c: ['b'] })
    expect(alternarOpcion(s, unicoOpcional, 'b')).toEqual({})
    expect(alternarOpcion({ c: ['b'] }, unicoObligatorio, 'b')).toEqual({ c: ['b'] })
  })

  it('múltiple respeta el máximo', () => {
    const s = alternarOpcion({}, multiple, 'a')
    expect(alternarOpcion(s, multiple, 'b')).toBe(s)
    expect(alternarOpcion(s, multiple, 'a')).toEqual({})
  })
})

describe('erroresSeleccion', () => {
  it('pide las opciones obligatorias', () => {
    expect(erroresSeleccion(doble, {})).toHaveProperty('punto')
    expect(erroresSeleccion(doble, { punto: ['a-punto'] })).toEqual({})
  })

  it('controla el máximo', () => {
    const todos = grupo(doble, 'agregados').opciones.map((o) => o.id)
    expect(erroresSeleccion(doble, { punto: ['a-punto'], agregados: todos })).toHaveProperty('agregados')
  })
})

describe('líneas del pedido', () => {
  const base: ItemPedido = { productoId: 'doble-cheddar', cantidad: 1, seleccion: { punto: ['a-punto'], agregados: ['bacon'] }, nota: '' }

  it('mismo producto y mismas opciones suma cantidad, sin importar el orden', () => {
    let items = agregarItem([], base)
    items = agregarItem(items, { ...base, seleccion: { agregados: ['bacon'], punto: ['a-punto'] }, cantidad: 2 })
    expect(items).toHaveLength(1)
    expect(items[0].cantidad).toBe(3)
  })

  it('opciones o nota distintas = líneas separadas', () => {
    let items = agregarItem([], base)
    items = agregarItem(items, { ...base, seleccion: { punto: ['jugosa'] } })
    items = agregarItem(items, { ...base, nota: 'bien tostado' })
    expect(items).toHaveLength(3)
  })

  it('calcula precio unitario y subtotal con adicionales', () => {
    const [l] = resolverLineas([{ ...base, cantidad: 2, seleccion: { punto: ['a-punto'], agregados: ['bacon', 'cheddar'], combo: ['combo-gaseosa'] } }], buscarProducto)
    expect(l.unitario).toBe(14500 + 1800 + 1200 + 5500)
    expect(l.subtotal).toBe(l.unitario * 2)
  })

  it('cambiar cantidad a 0 elimina la línea', () => {
    const items = agregarItem([], base)
    expect(cambiarCantidad(items, claveLinea(base), 0)).toEqual([])
    expect(cambiarCantidad(items, claveLinea(base), 4)[0].cantidad).toBe(4)
  })
})

describe('sanearItems', () => {
  it('descarta basura, productos inexistentes o sin stock y opciones viejas', () => {
    const crudo = [
      null,
      'x',
      { productoId: 'no-existe', cantidad: 1, seleccion: {}, nota: '' },
      { productoId: 'veggie', cantidad: 1, seleccion: {}, nota: '' },
      { productoId: 'papas-cheddar', cantidad: 0, seleccion: {}, nota: '' },
      { productoId: 'papas-cheddar', cantidad: 2, seleccion: { vieja: ['x'] }, nota: 'crocantes' },
      { productoId: 'doble-cheddar', cantidad: 1, seleccion: { punto: ['opcion-borrada'] }, nota: '' },
      { productoId: 'doble-cheddar', cantidad: 1, seleccion: { punto: ['jugosa'], agregados: ['bacon', 'borrada'] }, nota: '' },
    ]
    expect(sanearItems(crudo, buscarProducto)).toEqual([
      { productoId: 'papas-cheddar', cantidad: 2, seleccion: {}, nota: 'crocantes' },
      { productoId: 'doble-cheddar', cantidad: 1, seleccion: { punto: ['jugosa'], agregados: ['bacon'] }, nota: '' },
    ])
    expect(sanearItems({ no: 'es lista' }, buscarProducto)).toEqual([])
  })

  it('sanearDatos completa lo que falta y respeta los medios de pago habilitados', () => {
    expect(sanearDatos(null, ['efectivo', 'transferencia'])).toEqual(DATOS_VACIOS)
    expect(sanearDatos({ nombre: 'Ana', entrega: 'avion', pago: 'efectivo' }, ['transferencia'])).toMatchObject({ nombre: 'Ana', entrega: 'retiro', pago: 'transferencia' })
  })
})

describe('checkout', () => {
  const lineas = resolverLineas([{ productoId: 'papas-cheddar', cantidad: 1, seleccion: {}, nota: '' }], buscarProducto)

  it('suma envío solo en delivery', () => {
    expect(totales(lineas, 'retiro', 2500)).toEqual({ subtotal: 8900, envio: 0, total: 8900, cantidad: 1 })
    expect(totales(lineas, 'delivery', 2500)).toEqual({ subtotal: 8900, envio: 2500, total: 11400, cantidad: 1 })
    expect(totales([], 'delivery', 2500).envio).toBe(0)
  })

  it('valida nombre, dirección y monto en efectivo', () => {
    expect(erroresDatos(DATOS_VACIOS, 1000)).toEqual({ nombre: 'Escribí tu nombre.' })
    const delivery: DatosPedido = { ...DATOS_VACIOS, nombre: 'Ana', entrega: 'delivery' }
    expect(erroresDatos(delivery, 1000)).toHaveProperty('direccion')
    expect(erroresDatos({ ...delivery, direccion: 'Calle 1', pagaCon: '500' }, 1000)).toHaveProperty('pagaCon')
    expect(erroresDatos({ ...delivery, direccion: 'Calle 1', pagaCon: '$ 1.000' }, 1000)).toEqual({})
  })

  it('montoDe ignora puntos y signos', () => {
    expect(montoDe('$ 20.000')).toBe(20000)
    expect(montoDe('')).toBe(0)
  })
})

describe('armarMensaje', () => {
  it('arma el mensaje con el formato acordado', () => {
    const lineas = resolverLineas(
      [
        { productoId: 'doble-cheddar', cantidad: 2, seleccion: { punto: ['bien-cocida'], agregados: ['bacon'], combo: ['combo-gaseosa'], sin: ['sin-cebolla'] }, nota: 'pan bien tostado' },
        { productoId: 'papas-cheddar', cantidad: 1, seleccion: {}, nota: '' },
      ],
      buscarProducto,
    )
    const datos: DatosPedido = { nombre: 'Juan', entrega: 'delivery', direccion: 'Calle 123', referencia: 'entre X e Y', pago: 'efectivo', pagaCon: '60000', comentarios: 'tocar timbre 2' }
    const t = totales(lineas, 'delivery', 2500)
    expect(armarMensaje('Nombre Burger', lineas, datos, t)).toBe(
      [
        '🍔 *Nuevo pedido - Nombre Burger*',
        '',
        '*Cliente:* Juan',
        '*Entrega:* Delivery',
        '*Dirección:* Calle 123 (entre X e Y)',
        '',
        '*Pedido:*',
        '2x Doble Cheddar — $43.600',
        '   + Bacon, + Combo: papas + gaseosa',
        '   Bien cocida, Sin cebolla',
        '   _Nota: pan bien tostado_',
        '1x Papas con cheddar y bacon — $8.900',
        '',
        'Subtotal: $52.500',
        'Envío: $2.500',
        '*TOTAL: $55.000*',
        '',
        '*Pago:* Efectivo (paga con $60.000)',
        '*Comentarios:* tocar timbre 2',
      ].join('\n'),
    )
  })

  it('retiro, transferencia, sin comentarios y con aviso de local cerrado', () => {
    const lineas = resolverLineas([{ productoId: 'aros', cantidad: 1, seleccion: {}, nota: '' }], buscarProducto)
    const datos: DatosPedido = { ...DATOS_VACIOS, nombre: 'Ana', pago: 'transferencia' }
    const m = armarMensaje('Nombre Burger', lineas, datos, totales(lineas, 'retiro', 2500), true)
    expect(m).toContain('*Entrega:* Retiro en el local')
    expect(m).toContain('_Pedido hecho con el local cerrado')
    expect(m).not.toContain('Envío')
    expect(m).not.toContain('Comentarios')
    expect(m).toContain('*Pago:* Transferencia')
  })
})
