/* Lógica del catálogo. Normalmente no necesitas editar este archivo. */
/* Carga modelos.js sin caché para que los cambios del panel se vean de inmediato */
(function cargar() {
  const s = document.createElement("script");
  s.src = "modelos.js?v=" + Math.floor(Date.now() / 30000);
  s.onload = iniciar;
  s.onerror = () => {
    document.getElementById("conteo").textContent = "No se pudo cargar el catálogo. Recarga la página.";
  };
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

  const dinero = (n) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);
  const normal = (s) => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const wa = (texto) => `https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(texto)}`;

  // Imagen provisional para modelos sin foto
  const provisional = (() => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'>
      <defs><pattern id='c' width='8' height='6' patternUnits='userSpaceOnUse'>
      <rect width='8' height='6' fill='#192D46'/><rect y='5' width='8' height='1' fill='#203854'/></pattern></defs>
      <rect width='400' height='300' fill='url(#c)'/>
      <g fill='none' stroke='#4C9AFF' stroke-width='2.5' stroke-linejoin='round' transform='translate(200 138)'>
      <path d='M0 -56 L50 -28 L50 28 L0 56 L-50 28 L-50 -28 Z'/><path d='M-50 -28 L0 0 L50 -28 M0 0 L0 56'/></g>
      <text x='200' y='250' text-anchor='middle' font-family='Arial, sans-serif' font-size='15' fill='#7890AA'>Foto próximamente</text></svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  })();
  const imagenes = (m) => (m.imagenes && m.imagenes.length ? m.imagenes : [provisional]);

  /* ---------- Textos generales ---------- */
  $("#intro-texto").textContent =
    `Modelos de diseño propio, impresos en ${negocio.ciudad}. Elige tu pieza, el material y el color, y haz tu pedido por WhatsApp.`;
  $("#wa-barra").href = wa(`Hola, vi el catálogo de ${negocio.nombre} y tengo una pregunta.`);
  $("#wa-medida").href = wa("Hola, quiero cotizar una pieza a la medida. Te mando foto y medidas:");
  $("#pie-texto").textContent = `© ${new Date().getFullYear()} ${negocio.nombre} · ${negocio.ciudad}`;
  const redes = [];
  if (negocio.instagram) redes.push(`<a href="${esc(negocio.instagram)}" target="_blank" rel="noopener">Instagram</a>`);
  if (negocio.facebook) redes.push(`<a href="${esc(negocio.facebook)}" target="_blank" rel="noopener">Facebook</a>`);
  $("#pie-redes").innerHTML = redes.join("");

  /* ---------- Categorías ---------- */
  function pintarCategorias() {
    const cuenta = (id) => modelos.filter((m) => id === "todos" || m.categoria === id).length;
    const lista = [{ id: "todos", nombre: "Todo" }, ...C.categorias].filter((c) => cuenta(c.id) > 0);
    $("#categorias").innerHTML = lista
      .map(
        (c) =>
          `<button class="cat-btn" type="button" data-cat="${esc(c.id)}" aria-pressed="${c.id === estado.cat}">
             ${esc(c.nombre)}<span>${cuenta(c.id)}</span></button>`
      )
      .join("");
  }
  $("#categorias").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]");
    if (!b) return;
    estado.cat = b.dataset.cat;
    history.replaceState(null, "", estado.cat === "todos" ? location.pathname + location.search : `#cat=${estado.cat}`);
    pintarCategorias();
    pintarRejilla();
  });

  /* ---------- Rejilla ---------- */
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

  function ficha(m) {
    const filas = [
      ["Material", (m.materiales || []).join(", ")],
      ["Medidas", m.medidas],
      ["Entrega", m.entrega]
    ].filter(([, v]) => v);
    return filas.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("");
  }

  function pintarRejilla() {
    const lista = filtrados();
    $("#conteo").textContent =
      lista.length === 1 ? "1 modelo" : `${lista.length} modelos`;
    $("#vacio").hidden = lista.length > 0;
    $("#rejilla").innerHTML = lista
      .map(
        (m) => `
      <a class="tarjeta" href="#modelo=${encodeURIComponent(m.id)}">
        <div class="foto"><img src="${esc(imagenes(m)[0])}" alt="${esc(m.nombre)}" loading="lazy"></div>
        <div class="cuerpo">
          ${m.destacado ? '<span class="sello">Más pedido</span>' : ""}
          <p class="cat">${esc(catPorId[m.categoria]?.nombre || "")}</p>
          <h3>${esc(m.nombre)}</h3>
          ${m.precioDesde ? `<p class="precio"><small>Desde</small>${dinero(m.precioDesde)}</p>` : ""}
        </div>
        <dl class="ficha">${ficha(m)}</dl>
      </a>`
      )
      .join("");
  }

  let temporizador;
  $("#buscar").addEventListener("input", (e) => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => {
      estado.q = e.target.value;
      pintarRejilla();
    }, 120);
  });
  $("#limpiar").addEventListener("click", () => {
    estado.q = "";
    estado.cat = "todos";
    $("#buscar").value = "";
    history.replaceState(null, "", location.pathname + location.search);
    pintarCategorias();
    pintarRejilla();
  });

  /* ---------- Detalle ---------- */
  const dialogo = $("#detalle");

  function chips(nombre, opciones, elegido) {
    return opciones
      .map(
        (o) =>
          `<label><input type="radio" name="${nombre}" value="${esc(o)}" ${o === elegido ? "checked" : ""}><span>${esc(o)}</span></label>`
      )
      .join("");
  }

  function actualizarPedido() {
    const m = estado.abierto;
    if (!m) return;
    $("#d-mat-nota").textContent = (C.materiales || {})[estado.material] || "";
    const partes = [`Hola, me interesa el modelo "${m.nombre}" (ref. ${m.id}) del catálogo.`];
    if (estado.material) partes.push(`Material: ${estado.material}.`);
    if (estado.color) partes.push(`Color: ${estado.color}.`);
    partes.push("¿Me confirmas precio y tiempo de entrega?");
    $("#d-wa").href = wa(partes.join(" "));
  }

  function mostrarFoto(i) {
    const fotos = imagenes(estado.abierto);
    $("#d-img").src = fotos[i];
    document.querySelectorAll("#d-mini button").forEach((b, j) => b.setAttribute("aria-current", j === i));
  }

  function abrir(m) {
    estado.abierto = m;
    estado.material = (m.materiales || [])[0] || null;
    estado.color = (m.colores || [])[0] || null;

    const fotos = imagenes(m);
    $("#d-img").alt = m.nombre;
    $("#d-mini").innerHTML =
      fotos.length > 1
        ? fotos.map((f, i) => `<button type="button" data-i="${i}" aria-label="Foto ${i + 1}"><img src="${esc(f)}" alt=""></button>`).join("")
        : "";
    mostrarFoto(0);

    $("#d-cat").textContent = catPorId[m.categoria]?.nombre || "";
    $("#d-titulo").textContent = m.nombre;
    $("#d-precio").innerHTML = m.precioDesde ? `<small>Desde</small>${dinero(m.precioDesde)}` : "";
    $("#d-desc").textContent = m.descripcion || "";

    $("#d-materiales").hidden = !(m.materiales || []).length;
    $("#d-mat-chips").innerHTML = chips("material", m.materiales || [], estado.material);
    $("#d-colores").hidden = !(m.colores || []).length;
    $("#d-col-chips").innerHTML = chips("color", m.colores || [], estado.color);

    $("#d-ficha").innerHTML = [["Medidas", m.medidas], ["Entrega", m.entrega]]
      .filter(([, v]) => v)
      .map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`)
      .join("");

    actualizarPedido();
    document.title = `${m.nombre} | ${negocio.nombre}`;
    if (!dialogo.open) dialogo.showModal();
    dialogo.querySelector(".d-info").scrollTop = 0;
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
  dialogo.addEventListener("click", (e) => {
    if (e.target === dialogo) dialogo.close();
  });
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
    if (id && modeloPorId[id]) {
      abrir(modeloPorId[id]);
      return;
    }
    const cat = p.get("cat");
    estado.cat = cat && catPorId[cat] ? cat : "todos";
    if (dialogo.open) dialogo.close();
    pintarCategorias();
    pintarRejilla();
  }
  window.addEventListener("hashchange", leerEnlace);

  pintarCategorias();
  pintarRejilla();
  leerEnlace();
}
