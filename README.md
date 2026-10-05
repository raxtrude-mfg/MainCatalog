# Catálogo RA Xtrude Manufactura

Sitio estático (HTML + CSS + JS, sin servidor) para mostrar los modelos que imprimes y recibir pedidos por WhatsApp.

## Archivos

| Archivo | Para qué sirve | ¿Lo editas? |
|---|---|---|
| `admin.html` | Panel para editar el catálogo desde el navegador | No, solo lo usas |
| `modelos.js` | Datos del negocio, categorías, materiales y modelos | Lo edita el panel (o tú a mano) |
| `imagenes/` | Fotos de los modelos | Sí |
| `index.html`, `estilos.css`, `app.js` | Página, diseño y lógica | Normalmente no |
| `optimizar_fotos.py` | Convierte tus fotos a WebP ligeras | Opcional |

Para verlo en tu computadora, abre `index.html` con doble clic. No necesita servidor.

## Antes de publicar

1. En `modelos.js`, cambia `whatsapp` por tu número real: `521` + 10 dígitos, sin espacios.
2. Reemplaza los modelos de ejemplo por los tuyos.
3. Si tienes Instagram o Facebook, pega las ligas en `instagram` y `facebook`.

## Editar desde el panel (recomendado)

Una vez publicado el sitio, entra a `https://TU-SITIO/admin.html`. La primera vez te pide un token de GitHub:

1. GitHub → tu foto → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. *Repository access*: **Only select repositories** → tu repositorio del catálogo.
3. *Repository permissions → Contents*: **Read and write**. Nada más.
4. Ponle vencimiento de 1 año, genéralo y pégalo en el panel.

Desde el panel puedes agregar, editar, ocultar y eliminar modelos, subir fotos desde la computadora o el celular (se reducen a 1200 px antes de subir), y editar categorías, materiales y tu número de WhatsApp. Al presionar **Publicar cambios**, el sitio se actualiza en 1–2 minutos.

El token se guarda solo en el navegador donde lo pegaste. Si pierdes el celular o la compu, bórralo en GitHub (misma pantalla donde lo creaste) y genera otro.

Nota: el panel reescribe `modelos.js` completo al publicar, así que los comentarios de ejemplo de ese archivo desaparecen. Es normal.

## Agregar un modelo a mano (sin panel)

1. Toma fotos (fondo liso, buena luz) y ponlas en `fotos_originales/`.
2. Ejecuta `python optimizar_fotos.py` → se crean en `imagenes/` como `.webp`.
3. En `modelos.js` copia un bloque de modelo y edítalo:

```js
{
  id: "porta-celular-buro",
  nombre: "Porta celular para buró",
  categoria: "hogar",
  descripcion: "Mantiene el celular de pie mientras carga.",
  imagenes: ["imagenes/porta-celular-1.webp", "imagenes/porta-celular-2.webp"],
  precioDesde: 150,
  medidas: "90 × 80 × 100 mm",
  entrega: "2 días",
  materiales: ["PLA", "PETG"],
  colores: ["Negro", "Blanco"],
  destacado: false
},
```

El `id` debe ser único y sin espacios: se usa en el enlace directo al modelo.

Para agregar una categoría nueva, añádela en `categorias` con un `id` y un `nombre`. Las categorías sin modelos no se muestran.

## Enlaces directos (para compartir en WhatsApp o Instagram)

- Una categoría: `https://TU-SITIO/#cat=jardin`
- Un modelo: `https://TU-SITIO/#modelo=maceta-autorriego`

## Publicar gratis en GitHub Pages

1. Crea una cuenta en github.com.
2. Crea un repositorio nuevo, público, por ejemplo `catalogo`.
3. En el repositorio: **Add file → Upload files** y arrastra todo el contenido de esta carpeta (incluido `.nojekyll` y la carpeta `imagenes`). Haz **Commit changes**.
4. Ve a **Settings → Pages**. En *Source* elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`, y guarda.
5. En 1–2 minutos queda en `https://TU-USUARIO.github.io/catalogo/`.

Cada vez que subas cambios (por ejemplo, un `modelos.js` nuevo), el sitio se actualiza solo.

Si usas Git en la terminal:

```bash
git init
git add .
git commit -m "Catálogo inicial"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/catalogo.git
git push -u origin main
```

### Dominio propio (opcional)

Si compras un dominio (por ejemplo `raxtrude.com.mx`), en **Settings → Pages → Custom domain** escríbelo y sigue las instrucciones de DNS que te da GitHub. Activa **Enforce HTTPS**.

### Alternativa: Cloudflare Pages

Si después quieres más margen para uso comercial, entra a Cloudflare → Workers & Pages → Create → Pages → conecta el mismo repositorio de GitHub. No hay que cambiar ningún archivo.
