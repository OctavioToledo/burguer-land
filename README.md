# Landing de hamburguesería: menú, carrito y pedido por WhatsApp

Modelo de landing para negocios de comida. Una sola página con un menú que tiene opciones y extras, un carrito con checkout, y el pedido armado que se envía por WhatsApp. No tiene backend ni cobro online. Los datos actuales son de demo ("Nombre Burger").

Stack: Vite, React y TypeScript, con CSS plano y variables. Es un sitio 100 % estático.

```bash
npm install
npm run dev      # desarrollo en http://localhost:5173
npm test         # tests de horarios, precios, carrito y mensaje de WhatsApp
npm run build    # genera dist/
```

## Adaptarlo a otro cliente (en este orden)

No hace falta tocar componentes. Todo lo que cambia entre clientes está en estos archivos:

### 1. `src/data/business.ts`: datos del negocio

| Qué | Campo |
|---|---|
| Nombre, frase entre paréntesis de la portada, slogan | `nombre`, `bajada`, `slogan` |
| Logo | `logoTexto`, o `logoImagen: '/img/logo.svg'` si hay logo en imagen |
| WhatsApp que recibe los pedidos | `whatsapp`, en formato internacional sin `+` ni espacios: `549` + característica sin 0 + número sin 15. Ej.: (263) 15 400-0000 → `5492634000000` |
| Número tal como se muestra en el sitio | `whatsappVisible` |
| Dirección y mapa | `direccion`, `localidad`, `provincia`, `mapsLink`, `mapsEmbed` (con `null` se oculta el mapa) |
| Horarios | `horarios`: `0` = domingo … `6` = sábado. Cada día lleva una lista de turnos `{ abre, cierra }`. Un turno que cierra después de medianoche se carga tal cual (ej. `20:00` a `01:30`). Un día cerrado se carga como `[]`. |
| Redes | `redes` (una red en `''` se oculta) |
| Envío | `envio.costo`, `envio.zonas`, `envio.demora` |
| Pagos | `mediosDePago` (`'efectivo'`, `'transferencia'`) y `transferencia` (alias y titular) |
| Pedido mínimo | `pedidoMinimo` (con `0`, no hay mínimo) |
| Historia y fotos | `historia` (párrafos), `fotos.hero` (3 fotos), `fotos.local` |
| Crédito del footer | `credito` |

El cartel "Abierto ahora / Cerrado · abre a las HH:MM" se calcula solo, con la hora de `zonaHoraria`, sin importar dónde esté el cliente.

### 2. `src/data/products.ts`: menú

- **`categorias`**: lista de categorías, en el orden en que aparecen. Las que no tienen productos no se muestran.
- **`productos`**: cada producto lleva `id` (único, en minúsculas y con guiones), `nombre`, `descripcion`, `precio` (sin puntos ni `$`), `imagen`, `categoria` (el `id` de la categoría) y `disponible`.
  - `badge`: opcional, puede ser `'Nueva'`, `'Más pedida'` o `'Picante'`.
  - `destacado: true`: lo muestra en "Destacados" (hasta 4).
  - `disponible: false`: lo muestra atenuado con "Sin stock hoy" y no se puede pedir.
- **Grupos de opciones** (`opciones`): se definen una vez arriba del archivo y se reutilizan entre productos.
  - `tipo: 'unico'` se elige una sola opción. `tipo: 'multiple'` permite varias, con `maximo` opcional.
  - `obligatorio: true` impide agregar el producto sin elegir una opción.
  - Cada opción tiene `precio` adicional (`0` si no cambia el precio, ej. "Sin cebolla").
  - En el mensaje de WhatsApp, las opciones con precio salen como `+ Bacon` y las de precio 0 como texto (`A punto, Sin cebolla`).

### 3. Imágenes (`public/img/`)

- **Productos**: `public/img/productos/<imagen>-400.webp` y `<imagen>-800.webp`, en formato 4:3 (400×300 y 800×600). En `products.ts` se carga solo el nombre base (`imagen: 'doble-cheddar'`).
- **Portada**: 3 fotos cuadradas, `hero-N.webp` (640×640) y `hero-N-320.webp` (320×320). Se recortan solas con forma irregular.
- **Quiénes somos**: `local.webp`, cuadrada (640×640).
- **Vista previa al compartir** (`public/og.jpg`, 1200×630), **favicon** (`public/favicon.svg`, `favicon-32.png`) e **ícono de iPhone** (`public/apple-touch-icon.png`, 180×180): reemplazarlos con la marca del cliente.

Las fotos de la demo son de Unsplash (licencia libre). Para un cliente real, usar fotos propias.

### 4. Marca: `src/styles/tokens.css`

Colores, tipografías, tamaños, espaciados y radios. Cambiando las seis variables de color y las dos familias tipográficas, todo el sitio cambia de marca. Las fuentes se instalan con npm (`@fontsource/...`) y se importan en `src/main.tsx`.

### 5. Textos para buscadores y redes: `index.html`

`<title>`, `description`, `og:*` y `twitter:*`. Los datos estructurados (schema.org Restaurant) se generan solos desde `business.ts` al compilar.

Los textos fijos de las secciones ("Cómo pedir", títulos de sección) están en sus componentes, en `src/components/`.

## Publicar en Vercel

1. Importar el repo en Vercel. Detecta Vite solo: build `npm run build`, carpeta `dist`.
2. Variable `VITE_SITE_URL` con la URL pública sin barra final (ej. `https://nombreburger.com.ar`). Hace falta para que la imagen de vista previa funcione al compartir el link por WhatsApp. Si no se carga, se usa el dominio de producción de Vercel. Hay un ejemplo en `.env.example`.

## Cómo funciona el pedido

- Un producto **sin opciones** se agrega directo con "Agregar". Uno **con opciones** abre el detalle: un modal en escritorio o una hoja desde abajo en el celular. Ahí se eligen las opciones y la cantidad, y se pueden agregar aclaraciones. El botón "Agregar · $TOTAL" recalcula el precio en vivo y no deja agregar si falta una opción obligatoria.
- El mismo producto con opciones o aclaraciones distintas queda en **líneas separadas** del carrito.
- **Checkout** dentro del carrito:
  - Nombre (obligatorio).
  - Retiro o delivery. Delivery pide dirección y suma el envío.
  - Efectivo (con "¿Con cuánto pagás?") o transferencia (muestra el alias).
  - Comentarios.
- El envío **se bloquea** si no se llega al pedido mínimo. Si el local está **cerrado**, se puede pedir igual: aparece el aviso en el carrito y una línea en el mensaje.
- El carrito y los datos del formulario se guardan en el navegador (`localStorage`). Al volver, el cliente los encuentra igual. Si un producto se borra del menú o queda sin stock, sale solo del carrito guardado.
- "Enviar pedido por WhatsApp" abre `wa.me` con el mensaje redactado. El carrito **no se vacía solo**: aparece "Vaciar carrito" por si WhatsApp no se abrió.
