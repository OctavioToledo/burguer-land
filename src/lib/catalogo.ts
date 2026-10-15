import { categorias, productos } from '../data/products'
import type { Producto } from './tipos'

const porId = new Map(productos.map((p) => [p.id, p]))

export function buscarProducto(id: string): Producto | undefined {
  return porId.get(id)
}

export function urlImagen(imagen: string, ancho: 400 | 800): string {
  return `/img/productos/${imagen}-${ancho}.webp`
}

export const destacados = productos.filter((p) => p.destacado).slice(0, 4)

/** Categorías que tienen al menos un producto, en orden. */
export const categoriasConProductos = categorias.filter((c) => productos.some((p) => p.categoria === c.id))

/** Minúsculas y sin tildes, para buscar "papas" o "limon" sin importar cómo se escriba. */
export function normalizar(texto: string): string {
  return texto.toLocaleLowerCase('es').normalize('NFD').replace(/\p{Diacritic}/gu, '').trim()
}

export function filtrar(lista: Producto[], busqueda: string): Producto[] {
  const q = normalizar(busqueda)
  if (!q) return lista
  const palabras = q.split(/\s+/)
  return lista.filter((p) => {
    const texto = normalizar(`${p.nombre} ${p.descripcion}`)
    return palabras.every((w) => texto.includes(w))
  })
}
