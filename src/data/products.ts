import type { Categoria, GrupoOpciones, Producto } from '../lib/tipos'

/** Categorías en el orden en que aparecen en el menú. */
export const categorias: Categoria[] = [
  { id: 'hamburguesas', nombre: 'Hamburguesas' },
  { id: 'combos', nombre: 'Combos' },
  { id: 'papas', nombre: 'Papas y acompañamientos' },
  { id: 'bebidas', nombre: 'Bebidas' },
  { id: 'postres', nombre: 'Postres' },
]

/* ---------- Grupos de opciones reutilizables ---------- */

const puntoCarne: GrupoOpciones = {
  id: 'punto',
  nombre: 'Punto de la carne',
  tipo: 'unico',
  obligatorio: true,
  opciones: [
    { id: 'jugosa', nombre: 'Jugosa', precio: 0 },
    { id: 'a-punto', nombre: 'A punto', precio: 0 },
    { id: 'bien-cocida', nombre: 'Bien cocida', precio: 0 },
  ],
}

const agregados: GrupoOpciones = {
  id: 'agregados',
  nombre: 'Agregados',
  tipo: 'multiple',
  obligatorio: false,
  maximo: 4,
  opciones: [
    { id: 'cheddar', nombre: 'Cheddar extra', precio: 1200 },
    { id: 'bacon', nombre: 'Bacon', precio: 1800 },
    { id: 'huevo', nombre: 'Huevo a la plancha', precio: 1000 },
    { id: 'medallon', nombre: 'Medallón extra', precio: 3500 },
    { id: 'cebolla-caramelizada', nombre: 'Cebolla caramelizada', precio: 900 },
  ],
}

const haceloCombo: GrupoOpciones = {
  id: 'combo',
  nombre: 'Hacelo combo',
  tipo: 'unico',
  obligatorio: false,
  opciones: [
    { id: 'combo-gaseosa', nombre: 'Combo: papas + gaseosa', precio: 5500 },
    { id: 'combo-cerveza', nombre: 'Combo: papas + cerveza', precio: 7000 },
  ],
}

const sin: GrupoOpciones = {
  id: 'sin',
  nombre: 'Sin…',
  tipo: 'multiple',
  obligatorio: false,
  opciones: [
    { id: 'sin-cebolla', nombre: 'Sin cebolla', precio: 0 },
    { id: 'sin-tomate', nombre: 'Sin tomate', precio: 0 },
    { id: 'sin-pepinos', nombre: 'Sin pepinos', precio: 0 },
    { id: 'sin-lechuga', nombre: 'Sin lechuga', precio: 0 },
  ],
}

const opcionesHamburguesa = [puntoCarne, agregados, haceloCombo, sin]

const bebidaCombo: GrupoOpciones = {
  id: 'bebida',
  nombre: 'Bebida del combo',
  tipo: 'unico',
  obligatorio: true,
  opciones: [
    { id: 'gaseosa-cola', nombre: 'Gaseosa cola', precio: 0 },
    { id: 'gaseosa-lima', nombre: 'Gaseosa lima-limón', precio: 0 },
    { id: 'agua', nombre: 'Agua sin gas', precio: 0 },
    { id: 'limonada', nombre: 'Limonada casera', precio: 1200 },
    { id: 'cerveza', nombre: 'Pinta de cerveza', precio: 2000 },
  ],
}

const salsas: GrupoOpciones = {
  id: 'salsas',
  nombre: 'Salsas',
  tipo: 'multiple',
  obligatorio: false,
  maximo: 2,
  opciones: [
    { id: 'alioli', nombre: 'Alioli', precio: 600 },
    { id: 'barbacoa', nombre: 'Barbacoa', precio: 600 },
    { id: 'cheddar-salsa', nombre: 'Salsa cheddar', precio: 900 },
  ],
}

const tamanio: GrupoOpciones = {
  id: 'tamanio',
  nombre: 'Tamaño',
  tipo: 'unico',
  obligatorio: true,
  opciones: [
    { id: 'chica', nombre: 'Porción chica', precio: 0 },
    { id: 'grande', nombre: 'Porción grande', precio: 2500 },
  ],
}

const gusto: GrupoOpciones = {
  id: 'gusto',
  nombre: 'Gusto',
  tipo: 'unico',
  obligatorio: true,
  opciones: [
    { id: 'cola', nombre: 'Cola', precio: 0 },
    { id: 'cola-zero', nombre: 'Cola sin azúcar', precio: 0 },
    { id: 'lima-limon', nombre: 'Lima-limón', precio: 0 },
    { id: 'naranja', nombre: 'Naranja', precio: 0 },
  ],
}

/* ---------- Productos ---------- */

export const productos: Producto[] = [
  // Hamburguesas
  {
    id: 'clasica',
    nombre: 'Clásica',
    descripcion: 'Medallón de 150 g, cheddar, lechuga, tomate, cebolla morada y salsa de la casa en pan de masa madre.',
    precio: 11500,
    imagen: 'clasica',
    categoria: 'hamburguesas',
    disponible: true,
    opciones: opcionesHamburguesa,
  },
  {
    id: 'doble-cheddar',
    nombre: 'Doble Cheddar',
    descripcion: 'Dos medallones de 120 g, doble cheddar fundido, pepinos y salsa de la casa. La que todos piden.',
    precio: 14500,
    imagen: 'doble-cheddar',
    categoria: 'hamburguesas',
    badge: 'Más pedida',
    disponible: true,
    destacado: true,
    opciones: opcionesHamburguesa,
  },
  {
    id: 'bacon-monster',
    nombre: 'Bacon Monster',
    descripcion: 'Triple medallón, triple cheddar, bacon crocante, cebolla caramelizada y barbacoa ahumada.',
    precio: 17900,
    imagen: 'bacon-monster',
    categoria: 'hamburguesas',
    disponible: true,
    destacado: true,
    opciones: opcionesHamburguesa,
  },
  {
    id: 'smash',
    nombre: 'Smash Simple',
    descripcion: 'Medallón aplastado en la plancha bien caliente, bordes crocantes, cheddar, pepinos y mostaza.',
    precio: 12900,
    imagen: 'smash',
    categoria: 'hamburguesas',
    badge: 'Nueva',
    disponible: true,
    destacado: true,
    opciones: opcionesHamburguesa,
  },
  {
    id: 'picante',
    nombre: 'Infierno',
    descripcion: 'Doble medallón, pepper jack, jalapeños asados, cebolla crispy y mayonesa de chipotle.',
    precio: 14900,
    imagen: 'picante',
    categoria: 'hamburguesas',
    badge: 'Picante',
    disponible: true,
    opciones: opcionesHamburguesa,
  },
  {
    id: 'veggie',
    nombre: 'Veggie',
    descripcion: 'Medallón de garbanzos y hongos, palta, tomate, rúcula y alioli de limón.',
    precio: 13500,
    imagen: 'veggie',
    categoria: 'hamburguesas',
    disponible: false,
    opciones: [agregados, sin],
  },

  // Combos
  {
    id: 'combo-clasico',
    nombre: 'Combo Clásico',
    descripcion: 'Hamburguesa Clásica + papas fritas + bebida a elección.',
    precio: 16500,
    imagen: 'combo-clasico',
    categoria: 'combos',
    disponible: true,
    opciones: [puntoCarne, bebidaCombo, agregados, sin],
  },
  {
    id: 'combo-doble',
    nombre: 'Combo Doble Cheddar',
    descripcion: 'Doble Cheddar + papas fritas + bebida a elección.',
    precio: 19500,
    imagen: 'combo-doble',
    categoria: 'combos',
    badge: 'Más pedida',
    disponible: true,
    destacado: true,
    opciones: [puntoCarne, bebidaCombo, agregados, sin],
  },

  // Papas y acompañamientos
  {
    id: 'papas',
    nombre: 'Papas fritas',
    descripcion: 'Papas cortadas a mano, doble cocción, con sal marina.',
    precio: 5500,
    imagen: 'papas',
    categoria: 'papas',
    disponible: true,
    opciones: [tamanio, salsas],
  },
  {
    id: 'papas-cheddar',
    nombre: 'Papas con cheddar y bacon',
    descripcion: 'Nuestras papas bañadas en salsa cheddar, bacon crocante y verdeo.',
    precio: 8900,
    imagen: 'papas-cheddar',
    categoria: 'papas',
    disponible: true,
  },
  {
    id: 'aros',
    nombre: 'Aros de cebolla',
    descripcion: 'Rebozados en cerveza, con dip de barbacoa. 10 unidades.',
    precio: 6900,
    imagen: 'aros',
    categoria: 'papas',
    disponible: true,
  },

  // Bebidas
  {
    id: 'gaseosa',
    nombre: 'Gaseosa 500 ml',
    descripcion: 'Bien fría.',
    precio: 2800,
    imagen: 'gaseosa',
    categoria: 'bebidas',
    disponible: true,
    opciones: [gusto],
  },
  {
    id: 'limonada',
    nombre: 'Limonada casera',
    descripcion: 'Limón exprimido, menta y jengibre. Vaso de 500 ml.',
    precio: 3900,
    imagen: 'limonada',
    categoria: 'bebidas',
    disponible: true,
  },
  {
    id: 'cerveza',
    nombre: 'Pinta de cerveza artesanal',
    descripcion: 'Rubia de una cervecería de la zona. 500 ml.',
    precio: 4900,
    imagen: 'cerveza',
    categoria: 'bebidas',
    disponible: true,
  },

  // Postres
  {
    id: 'brownie',
    nombre: 'Brownie con helado',
    descripcion: 'Brownie tibio de chocolate semiamargo con una bocha de helado de crema americana.',
    precio: 6500,
    imagen: 'brownie',
    categoria: 'postres',
    disponible: true,
  },
  {
    id: 'shake',
    nombre: 'Shake de chocolate',
    descripcion: 'Helado de chocolate, leche, galletitas trituradas y crema. 400 ml.',
    precio: 6900,
    imagen: 'shake',
    categoria: 'postres',
    badge: 'Nueva',
    disponible: true,
  },
]
