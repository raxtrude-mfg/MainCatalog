/* Lógica del catálogo. Normalmente no necesitas editar este archivo. */

/* Carga modelos.js sin caché para que los cambios del panel se vean de inmediato */
(function cargar() {
  const s = document.createElement("script");
  s.src = "modelos.js?v=" + Math.floor(Date.now() / 30000);
  s.onload = iniciar;
  s.onerror = () => { document.getElementById("conteo").textContent = "No se pudo cargar el catálogo. Recarga la página."; };
  document.head.appendChild(s);
})();

function iniciar() {
  "use strict";

  const C = window.CATALOGO;
  const $ = (s) => document.querySelector(s);
  const negocio = C.negocio;
  const catPorId = Object.fromEntries(C.categorias.map((c) => [c.id, c]));
  const modelos = C.modelos.filter((m) => m.disponible !== false);
  const modeloPorId = Object.fromEntries(modelos.map((m) => [m.id, m]));
  const estado = { cat: "todos", q: "", abierto: null, material: null, color: null };

  // Colores de etiqueta estilo Notion, asignados por orden de categoría
  const PALETA = ["c-azul", "c-verde", "c-morado", "c-amarillo", "c-rojo", "c-cafe", "c-rosa", "c-naranja", "c-gris"];
  const colorCat = (id) => PALETA[Math.max(0, C.categorias.findIndex((c) => c.id === id)) % PALETA.length];

  const dinero = (n) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);
  const normal = (s) => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const wa = (texto) => `https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(texto)}`;
  const tag = (texto, clase) => `<span class="tag ${clase || "c-gris"}">${esc(texto)}</span>`;

  /* ---------- Contador de visitas (GoatCounter) ---------- */
  const pendientes = [];
  let contadorListo = false;
  function contar(datos) {
    if (!negocio.goatcounter) return;
    if (!contadorListo) { pendientes.push(datos); return; }
    try { window.goatcounter.count(datos); } catch (e) { /* sin contador */ }
  }
  if (negocio.goatcounter) {
    const g = document.createElement("script");
    g.async = true;
    g.src = "https://gc.zgo.at/count.js";
    g.dataset.goatcounter = `https://${negocio.goatcounter}.goatcounter.com/count`;
    g.onload = () => {
      contadorListo = !!(window.goatcounter && window.goatcounter.count);
      pendientes.splice(0).forEach(contar);
    };
    document.head.appendChild(g);
  }

  // Imagen provisional para modelos sin foto
  const provisional = (() => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'>
      <rect width='400' height='300' fill='#F1F1EF'/>
      <g fill='none' stroke='#B4B4B0' stroke-width='2.5' stroke-linejoin='round' transform='translate(200 135)'>
      <path d='M0 -50 L44 -25 L44 25 L0 50 L-44 25 L-44 -25 Z'/><path d='M-44 -25 L0 0 L44 -25 M0 0 L0 50'/></g>
      <text x='200' y='240' text-anchor='middle' font-family='Times New Roman, Times, serif' font-style='italic' font-size='17' fill='#9B9A97'>Foto próximamente</text></svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  })();
  const imagenes = (m) => (m.imagenes && m.imagenes.length ? m.imagenes : [provisional]);

  /* ---------- Textos generales ---------- */
  $("#propiedades").innerHTML = `
    <span><span aria-hidden="true">📍</span>${esc(negocio.ciudad)}</span>
    <span><span aria-hidden="true">💬</span>Pedidos por WhatsApp</span>
    <span><span aria-hidden="true">✏️</span>Modelos de diseño propio</span>`;
  $("#intro-texto").textContent = "Abre cualquier modelo para elegir material y color. El botón de pedido te lleva a WhatsApp con el mensaje ya escrito, y ahí te confirmamos precio y fecha de entrega.";
  $("#wa-barra").href = wa(`Hola, vi el catálogo de ${negocio.nombre} y tengo una pregunta.`);
  $("#wa-medida").href = wa("Hola, quiero cotizar una pieza a la medida. Te mando foto y medidas:");
  $("#pie-texto").textContent = `© ${new Date().getFullYear()} ${negocio.nombre}, ${negocio.ciudad}`;
  const redes = [];
  if (negocio.instagram) redes.push(`<a href="${esc(negocio.instagram)}" target="_blank" rel="noopener">Instagram</a>`);
  if (negocio.facebook) redes.push(`<a href="${esc(negocio.facebook)}" target="_blank" rel="noopener">Facebook</a>`);
  $("#pie-redes").innerHTML = redes.join("");
  $("#wa-barra").addEventListener("click", () => contar({ path: "whatsapp-general", title: "WhatsApp (encabezado)", event: true }));
  $("#wa-medida").addEventListener("click", () => contar({ path: "cotizar-a-la-medida", title: "Cotizar pieza a la medida", event: true }));

  /* ---------- Vistas por categoría ---------- */
  function pintarCategorias() {
    const cuenta = (id) => modelos.filter((m) => id === "todos" || m.categoria === id).length;
    const lista = [{ id: "todos", nombre: "Todo" }, ...C.categorias].filter((c) => cuenta(c.id) > 0);
    $("#categorias").innerHTML = lista.map((c) =>
      `<button class="vista" type="button" data-cat="${esc(c.id)}" aria-pressed="${c.id === estado.cat}">${esc(c.nombre)}<span>${cuenta(c.id)}</span></button>`
    ).join("");
    const cat = catPorId[estado.cat];
    $("#ruta-cat").hidden = $("#ruta-sep-cat").hidden = !cat;
    $("#ruta-cat").textContent = cat ? cat.nombre : "";
  }
  $("#categorias").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]");
    if (!b) return;
    estado.cat = b.dataset.cat;
    history.replaceState(null, "", estado.cat === "todos" ? location.pathname + location.search : `#cat=${estado.cat}`);
    pintarCategorias();
    pintarGaleria();
  });

  /* ---------- Galería ---------- */
  function filtrados() {
    const q = normal(estado.q).trim();
    return modelos
      .filter((m) => estado.cat === "todos" || m.categoria === estado.cat)
      .filter((m) => {
        if (!q) return true;
        const texto = normal([m.nombre, m.descripcion, catPorId[m.categoria]?.nombre, (m.materiales || []).join(" ")].join(" "));
        return q.split(/\s+/).every((p) => texto.includes(p));
      })
      .sort((a, b) => (b.destacado === true) - (a.destacado === true));
  }

  function pintarGaleria() {
    const lista = filtrados();
    $("#conteo").textContent = lista.length === 1 ? "1 modelo" : `${lista.length} modelos`;
    $("#vacio").hidden = lista.length > 0;
    $("#galeria").innerHTML = lista.map((m) => `
      <a class="tarjeta" href="#modelo=${encodeURIComponent(m.id)}">
        <div class="foto"><img src="${esc(imagenes(m)[0])}" alt="${esc(m.nombre)}" loading="lazy"></div>
        <div class="cuerpo">
          <h3>${esc(m.nombre)}</h3>
          ${m.precioDesde ? `<p class="precio"><small>Desde</small>${dinero(m.precioDesde)}</p>` : ""}
          <div class="etiquetas">
            ${tag(catPorId[m.categoria]?.nombre || "", colorCat(m.categoria))}
            ${m.destacado ? tag("Más pedido", "c-naranja") : ""}
            ${(m.materiales || []).map((x) => tag(x)).join("")}
          </div>
          ${m.entrega ? `<p class="entrega">Entrega en ${esc(m.entrega)}</p>` : ""}
        </div>
      </a>`).join("");
  }

  let temporizador;
  $("#buscar").addEventListener("input", (e) => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => { estado.q = e.target.value; pintarGaleria(); }, 120);
  });
  $("#limpiar").addEventListener("click", () => {
    estado.q = ""; estado.cat = "todos"; $("#buscar").value = "";
    history.replaceState(null, "", location.pathname + location.search);
    pintarCategorias(); pintarGaleria();
  });

  /* ---------- Ficha del modelo ---------- */
  const dialogo = $("#detalle");
  const ICONOS = {
    lista: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M9 11l3 3 3-3"/></svg>',
    numero: '<svg viewBox="0 0 24 24"><path d="M9 4L7 20M17 4l-2 16M4 9h16M3 15h16"/></svg>',
    texto: '<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
    reloj: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg>'
  };
  const prop = (icono, nombre, valor) =>
    `<div class="prop"><div class="prop-nombre">${ICONOS[icono]}${nombre}</div><div class="prop-valor">${valor}</div></div>`;
  const chips = (nombre, opciones, elegido) => `<div class="chips">${opciones.map((o) =>
    `<label><input type="radio" name="${nombre}" value="${esc(o)}" ${o === elegido ? "checked" : ""}><span>${esc(o)}</span></label>`).join("")}</div>`;

  function actualizarPedido() {
    const m = estado.abierto;
    if (!m) return;
    const nota = $("#d-mat-nota");
    if (nota) nota.textContent = (C.materiales || {})[estado.material] || "";
    const partes = [`Hola, me interesa el modelo "${m.nombre}" (ref. ${m.id}) del catálogo.`];
    if (estado.material) partes.push(`Material: ${estado.material}.`);
    if (estado.color) partes.push(`Color: ${estado.color}.`);
    partes.push("¿Me confirmas precio y tiempo de entrega?");
    $("#d-wa").href = wa(partes.join(" "));
  }

  function mostrarFoto(i) {
    const src = imagenes(estado.abierto)[i];
    $("#d-img").src = src;
    $("#d-img").classList.toggle("provisional", src === provisional);
    document.querySelectorAll("#d-mini button").forEach((b, j) => b.setAttribute("aria-current", j === i));
  }

  function abrir(m) {
    estado.abierto = m;
    estado.material = (m.materiales || [])[0] || null;
    estado.color = (m.colores || [])[0] || null;
    const fotos = imagenes(m);
    $("#d-img").alt = m.nombre;
    $("#d-mini").innerHTML = fotos.length > 1
      ? fotos.map((f, i) => `<button type="button" data-i="${i}" aria-label="Foto ${i + 1}"><img src="${esc(f)}" alt=""></button>`).join("")
      : "";
    mostrarFoto(0);

    const cat = catPorId[m.categoria];
    $("#d-ruta").textContent = `Catálogo / ${cat ? cat.nombre : ""}`;
    $("#d-titulo").textContent = m.nombre;
    $("#d-desc").textContent = m.descripcion || "";

    const filas = [prop("lista", "Categoría", tag(cat ? cat.nombre : "", colorCat(m.categoria)))];
    if (m.precioDesde) filas.push(prop("numero", "Precio", `Desde ${dinero(m.precioDesde)}`));
    if (m.medidas) filas.push(prop("texto", "Medidas", esc(m.medidas)));
    if (m.entrega) filas.push(prop("reloj", "Entrega", esc(m.entrega)));
    if ((m.materiales || []).length) filas.push(prop("lista", "Material", chips("material", m.materiales, estado.material) + `<p class="prop-nota" id="d-mat-nota"></p>`));
    if ((m.colores || []).length) filas.push(prop("lista", "Color", chips("color", m.colores, estado.color)));
    $("#d-props").innerHTML = filas.join("");

    actualizarPedido();
    document.title = `${m.nombre} | ${negocio.nombre}`;
    if (!dialogo.open) dialogo.showModal();
    dialogo.scrollTop = 0;
    contar({ path: `/modelo/${m.id}`, title: m.nombre });
  }

  $("#d-mini").addEventListener("click", (e) => {
    const b = e.target.closest("[data-i]");
    if (b) mostrarFoto(Number(b.dataset.i));
  });
  dialogo.addEventListener("change", (e) => {
    if (e.target.name === "material") estado.material = e.target.value;
    if (e.target.name === "color") estado.color = e.target.value;
    actualizarPedido();
  });
  $("#d-cerrar").addEventListener("click", () => dialogo.close());
  $("#d-wa").addEventListener("click", () => {
    const m = estado.abierto;
    if (m) contar({ path: `pedido/${m.id}`, title: `Pedido: ${m.nombre}`, event: true });
  });
  dialogo.addEventListener("click", (e) => { if (e.target === dialogo) dialogo.close(); });
  dialogo.addEventListener("close", () => {
    estado.abierto = null;
    document.title = `Catálogo de piezas impresas en 3D | ${negocio.nombre}`;
    if (new URLSearchParams(location.hash.slice(1)).has("modelo")) {
      history.replaceState(null, "", estado.cat === "todos" ? location.pathname + location.search : `#cat=${estado.cat}`);
    }
  });

  /* ---------- Enlaces compartibles: #cat=hogar o #modelo=id ---------- */
  function leerEnlace() {
    const p = new URLSearchParams(location.hash.slice(1));
    const id = p.get("modelo");
    if (id && modeloPorId[id]) { abrir(modeloPorId[id]); return; }
    const cat = p.get("cat");
    estado.cat = cat && catPorId[cat] ? cat : "todos";
    if (dialogo.open) dialogo.close();
    pintarCategorias();
    pintarGaleria();
  }
  window.addEventListener("hashchange", leerEnlace);

  pintarCategorias();
  pintarGaleria();
  leerEnlace();
}
