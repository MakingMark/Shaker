# Shaker DCN Nutrition — sitio de pedidos

Sitio de una sola página para pedir el menú completo de Shaker y enviar el pedido directo por WhatsApp. Sin backend, sin dependencias de build — abre `index.html` o súbelo a cualquier hosting estático.

## Ver el sitio

```bash
python3 -m http.server 4173
```

Y entra a `http://localhost:4173`. (Abrir `index.html` directo con doble clic también funciona.)

## Estructura

```
index.html              Estructura de la página
assets/css/styles.css   Paleta, tipografía y todos los estilos
assets/js/data.js       El menú completo y la configuración (WhatsApp, Instagram, textos)
assets/js/app.js        Toda la lógica: acordeón, carrito, modificadores, checkout
assets/data/offers.js   Ofertas activas (ver sección "Ofertas" más abajo)
assets/data/taglines.json  Frases que rotan en el título del hero (opcional, ver más abajo)
assets/img/             Fotos y logo, ya optimizados para web
```

**Importante:** todo el contenido (`data.js`, `app.js`, `offers.js`) se carga como archivo `<script>` normal, no con `fetch()` — así el sitio funciona igual de bien abriendo `index.html` con doble clic que subido a un hosting. La única excepción es `taglines.json`, que si se sirve desde un servidor real permite variar las frases sin tocar código, pero si no está disponible el sitio usa una lista de respaldo ya incluida en `app.js`, así que nunca se ve vacío.

## Lo primero que debes revisar

**El número de WhatsApp.** Está en `assets/js/data.js`, al inicio, en `SHAKER_CONFIG.whatsappPedidos`. Usé el `18292338661` porque aparecía en un proyecto anterior — confírmalo o cámbialo antes de publicar el sitio.

## Cómo cambiar precios o productos

Todo el menú vive en `assets/js/data.js`, como un arreglo de categorías. Cada categoría tiene:

- `items`: lista de productos con `name` y `price`.
- `modifierGroups` (opcional): grupos de opciones — por ejemplo "Elige tu acompañante" (obligatorio, una opción) o "Agrega extras" (opcional, varias opciones). Cada producto declara en `modifiers: [...]` qué grupos aplican.
- `subgroups` (solo en Wraps y Menú FAT): sub-listas con su propio título, para no mezclar "wraps medianos" con "wraps grandes", por ejemplo.

Para agregar un producto nuevo, cópialo del mismo patrón que sus vecinos. Los precios están en pesos dominicanos, como números (sin el `RD$`).

## Cómo funciona el pedido

1. El cliente abre una categoría (acordeón — solo la primera está abierta al entrar, así no se satura la pantalla).
2. Toca **+** en un producto. Si tiene opciones obligatorias u opcionales, se abre una ficha inferior para elegirlas y ver el precio actualizarse en vivo.
3. El pedido se guarda en el carrito (persistido en el navegador, sobrevive a recargar la página).
4. El cliente llena nombre, teléfono, tipo de entrega y forma de pago, y toca **Enviar pedido por WhatsApp**.
5. Se arma un mensaje de texto con el detalle completo y el total, y se abre WhatsApp (`wa.me`) con ese mensaje ya escrito, listo para enviar.

No hay servidor ni base de datos: todo pasa en el navegador del cliente, y el pedido llega como cualquier mensaje de WhatsApp normal.

## Ofertas

Viven en `assets/data/offers.js`, como una lista de objetos. Para publicar una oferta:

1. Pon `"activa": true`.
2. Llena `titulo`, `descripcion`, `precio`, y si quieres mostrar el precio anterior tachado, `precioAntes`.
3. `imagen` es opcional — usa una ruta a una foto en `assets/img/`.

Si no hay ninguna oferta con `"activa": true`, esa sección simplemente no aparece en la página — no hace falta borrar nada, con poner `false` alcanza.

## Si editas cualquier archivo `.js` o `.css`

Los navegadores guardan copia de estos archivos en caché y a veces no descargan la versión nueva aunque el archivo haya cambiado. Para forzar que se note el cambio, sube en uno el número de versión en `index.html`, en las líneas que dicen `?v=`, por ejemplo:

```html
<script src="assets/js/data.js?v=4"></script>
```
pasa a
```html
<script src="assets/js/data.js?v=5"></script>
```

Solo hace falta subirlo en el archivo que editaste.

## Diseño

Paleta pensada para que combine con el logo y con las fotos reales del negocio (el papel de cuadros blanco y negro de los empaques se repite como franja decorativa entre el hero y el menú):

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `--paper` | `#FBF6EC` | `#131109` | Fondo general |
| `--ink` | `#1E1A14` | `#F3ECDA` | Texto |
| `--lime` | `#C6FF3F` | (igual) | Acento principal — botones, precios activos |
| `--coral` | `#FF5A36` | (igual) | Acento de alerta / animación al agregar |
| `--wa-green` | `#25D366` | (igual) | Botones de WhatsApp |

Un solo tema (claro) en toda la página, sin selector — se decidió así a propósito para que se vea igual para todos.

En pantallas grandes (≥960px) el carrito deja de ser una hoja inferior y se convierte en un panel fijo a la derecha, siempre visible mientras se navega el menú.

## Publicarlo

Sitio estático puro: sirve para Netlify, Vercel, GitHub Pages o cualquier hosting por FTP — solo sube la carpeta completa.
