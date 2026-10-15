import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { negocio } from '../data/business'
import { guardar, leer } from '../lib/almacenamiento'
import { buscarProducto } from '../lib/catalogo'
import {
  agregarItem,
  cambiarCantidad,
  resolverLineas,
  sanearDatos,
  sanearItems,
  totales,
  type DatosPedido,
  type ItemPedido,
  type Linea,
  type Totales,
} from '../lib/pedido'
import type { Producto } from '../lib/tipos'

const CLAVE_ITEMS = 'burger-pedido'
const CLAVE_DATOS = 'burger-datos'

interface ValorCarrito {
  lineas: Linea[]
  totales: Totales
  vacio: boolean
  datos: DatosPedido
  setDatos: (cambio: Partial<DatosPedido>) => void
  agregar: (item: ItemPedido) => void
  cambiarCantidad: (clave: string, cantidad: number) => void
  vaciar: () => void
  /** Drawer del carrito */
  abierto: boolean
  abrir: () => void
  cerrar: () => void
  /** Modal de producto */
  producto: Producto | null
  verProducto: (producto: Producto) => void
  cerrarProducto: () => void
  /** Toast corto ("Agregaste Doble Cheddar") */
  aviso: { texto: string; id: number } | null
  avisar: (texto: string) => void
}

const Contexto = createContext<ValorCarrito | null>(null)

export function ProveedorCarrito({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemPedido[]>(() => sanearItems(leer(CLAVE_ITEMS), buscarProducto))
  const [datos, setDatosCompletos] = useState<DatosPedido>(() => sanearDatos(leer(CLAVE_DATOS), negocio.mediosDePago))
  const [abierto, setAbierto] = useState(false)
  const [producto, setProducto] = useState<Producto | null>(null)
  const [aviso, setAviso] = useState<{ texto: string; id: number } | null>(null)
  const timerAviso = useRef<number | undefined>(undefined)

  useEffect(() => guardar(CLAVE_ITEMS, items), [items])
  useEffect(() => guardar(CLAVE_DATOS, datos), [datos])

  const abrir = useCallback(() => setAbierto(true), [])
  const cerrar = useCallback(() => setAbierto(false), [])
  const verProducto = useCallback((p: Producto) => setProducto(p), [])
  const cerrarProducto = useCallback(() => setProducto(null), [])
  const setDatos = useCallback((cambio: Partial<DatosPedido>) => setDatosCompletos((d) => ({ ...d, ...cambio })), [])

  const avisar = useCallback((texto: string) => {
    setAviso({ texto, id: Date.now() })
    window.clearTimeout(timerAviso.current)
    timerAviso.current = window.setTimeout(() => setAviso(null), 2600)
  }, [])

  const valor = useMemo<ValorCarrito>(() => {
    const lineas = resolverLineas(items, buscarProducto)
    const t = totales(lineas, datos.entrega, negocio.envio.costo)
    return {
      lineas,
      totales: t,
      vacio: lineas.length === 0,
      datos,
      setDatos,
      agregar: (item) => setItems((actuales) => agregarItem(actuales, item)),
      cambiarCantidad: (clave, cantidad) => setItems((actuales) => cambiarCantidad(actuales, clave, cantidad)),
      // Se vacían los productos y lo propio de este pedido; nombre, dirección y forma de pago quedan para la próxima.
      vaciar: () => {
        setItems([])
        setDatosCompletos((d) => ({ ...d, pagaCon: '', comentarios: '' }))
      },
      abierto,
      abrir,
      cerrar,
      producto,
      verProducto,
      cerrarProducto,
      aviso,
      avisar,
    }
  }, [items, datos, setDatos, abierto, abrir, cerrar, producto, verProducto, cerrarProducto, aviso, avisar])

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

// eslint-disable-next-line react/only-export-components
export function useCarrito(): ValorCarrito {
  const valor = useContext(Contexto)
  if (!valor) throw new Error('useCarrito tiene que usarse dentro de <ProveedorCarrito>')
  return valor
}
