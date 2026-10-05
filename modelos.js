/* =====================================================================
   CATÁLOGO RA XTRUDE — este es el único archivo que necesitas editar.
   - Para agregar un modelo: copia un bloque { ... } dentro de "modelos",
     cambia los datos y guarda. Las fotos van en la carpeta /imagenes.
   - Si un modelo no tiene fotos, se muestra una imagen provisional.
   - Para ocultar un modelo sin borrarlo: disponible: false
   ===================================================================== */

window.CATALOGO = {
  negocio: {
    nombre: "RA Xtrude Manufactura",
    ciudad: "Chihuahua, Chihuahua",
    // Número con código de país, sin espacios ni signos: 52 + 10 dígitos
    whatsapp: "526271138127",
    // Código de tu cuenta en goatcounter.com para contar visitas (ej. "raxtrude"). Vacío = sin contador
    goatcounter: "",
    instagram: "", // ej. "https://instagram.com/raxtrude"
    facebook: ""
  },

  // El orden aquí es el orden en que aparecen las categorías
  categorias: [
    { id: "hogar",      nombre: "Hogar" },
    { id: "oficina",    nombre: "Oficina" },
    { id: "gaming",     nombre: "Gaming" },
    { id: "jardin",     nombre: "Jardín" },
    { id: "automotriz", nombre: "Automotriz" },
    { id: "taller",     nombre: "Taller" }
  ],

  // Descripción corta que ve el cliente al elegir material
  materiales: {
    "PLA":    "Uso en interiores, buen acabado. No para calor ni sol directo.",
    "PETG":   "Resiste agua, golpes y algo de calor. Bueno para cocina y baño.",
    "ASA":    "Para exterior: aguanta sol y lluvia sin decolorarse.",
    "TPU":    "Flexible, tipo hule. Para topes, fundas y agarres.",
    "PA6-GF": "Nylon con fibra de vidrio. Alta resistencia mecánica.",
    "PPA-CF": "Nylon con fibra de carbono. Rígido y resistente al calor."
  },

  /* ---------------------------------------------------------------
     MODELOS — los siguientes son EJEMPLOS. Reemplázalos por los tuyos.
     Campos:
       id            texto único, sin espacios (se usa en el enlace)
       nombre        nombre visible
       categoria     uno de los id de "categorias"
       descripcion   1 a 3 frases
       imagenes      ["imagenes/archivo.webp", ...]  (la primera es la portada)
       precioDesde   número en pesos
       medidas       texto libre
       entrega       texto libre
       materiales    lista, usa los nombres de "materiales"
       colores       lista de colores disponibles
       destacado     true = aparece primero
       disponible    false = se oculta
     --------------------------------------------------------------- */
  modelos: [
    {
      id: "especiero-escalonado",
      nombre: "Especiero escalonado de 3 niveles",
      categoria: "hogar",
      descripcion: "Organiza frascos de especias en alacena o barra. Los niveles escalonados dejan ver todas las etiquetas.",
      imagenes: [],
      precioDesde: 280,
      medidas: "250 × 120 × 90 mm",
      entrega: "2–3 días",
      materiales: ["PLA", "PETG"],
      colores: ["Negro", "Blanco", "Gris"],
      destacado: true
    },
    {
      id: "portallaves-repisa",
      nombre: "Portallaves de pared con repisa",
      categoria: "hogar",
      descripcion: "Cuatro ganchos para llaves y una repisa para cartera o lentes. Se fija con dos taquetes.",
      imagenes: [],
      precioDesde: 190,
      medidas: "200 × 70 × 45 mm",
      entrega: "2 días",
      materiales: ["PLA", "PETG"],
      colores: ["Negro", "Blanco", "Madera"]
    },
    {
      id: "soporte-escoba",
      nombre: "Soporte de pared para escoba y trapeador",
      categoria: "hogar",
      descripcion: "Sujeta mangos de 20 a 30 mm con presión. Para cuarto de lavado o patio.",
      imagenes: [],
      precioDesde: 150,
      medidas: "180 × 50 × 40 mm",
      entrega: "2 días",
      materiales: ["PETG", "ASA"],
      colores: ["Negro", "Gris", "Azul"]
    },
    {
      id: "organizador-escritorio",
      nombre: "Organizador de escritorio modular",
      categoria: "oficina",
      descripcion: "Módulos que se ensamblan entre sí: plumas, notas adhesivas, celular y clips. Arma la combinación que necesites.",
      imagenes: [],
      precioDesde: 240,
      medidas: "Módulo de 80 × 80 mm",
      entrega: "3 días",
      materiales: ["PLA", "PETG"],
      colores: ["Negro", "Blanco", "Azul", "Gris"],
      destacado: true
    },
    {
      id: "soporte-laptop",
      nombre: "Soporte elevador para laptop",
      categoria: "oficina",
      descripcion: "Eleva la pantalla 12 cm y deja pasar aire por debajo. Para laptops de 13 a 16 pulgadas.",
      imagenes: [],
      precioDesde: 420,
      medidas: "260 × 230 × 120 mm",
      entrega: "3–4 días",
      materiales: ["PETG", "PA6-GF"],
      colores: ["Negro", "Gris"]
    },
    {
      id: "canaleta-cables",
      nombre: "Canaleta para cables bajo escritorio",
      categoria: "oficina",
      descripcion: "Se atornilla debajo de la cubierta y esconde cargadores y extensiones. Se puede pedir a la medida de tu escritorio.",
      imagenes: [],
      precioDesde: 260,
      medidas: "300 × 80 × 60 mm por tramo",
      entrega: "3 días",
      materiales: ["PLA", "PETG"],
      colores: ["Negro", "Blanco"]
    },
    {
      id: "soporte-controles",
      nombre: "Soporte de pared para 2 controles",
      categoria: "gaming",
      descripcion: "Para controles de PlayStation, Xbox o Switch Pro. Deja espacio para el cable de carga.",
      imagenes: [],
      precioDesde: 180,
      medidas: "160 × 60 × 70 mm",
      entrega: "2 días",
      materiales: ["PLA", "PETG"],
      colores: ["Negro", "Blanco", "Azul", "Rojo"],
      destacado: true
    },
    {
      id: "base-audifonos",
      nombre: "Base para audífonos con portacables",
      categoria: "gaming",
      descripcion: "Base de escritorio con peso en la parte baja para que no se voltee. El cable se enrolla en la parte trasera.",
      imagenes: [],
      precioDesde: 260,
      medidas: "120 × 120 × 270 mm",
      entrega: "3 días",
      materiales: ["PLA", "PETG"],
      colores: ["Negro", "Blanco", "Azul"]
    },
    {
      id: "organizador-juegos",
      nombre: "Organizador de cartuchos y tarjetas",
      categoria: "gaming",
      descripcion: "Guarda 24 cartuchos de Switch y 4 tarjetas microSD en un bloque de escritorio.",
      imagenes: [],
      precioDesde: 160,
      medidas: "110 × 80 × 40 mm",
      entrega: "2 días",
      materiales: ["PLA"],
      colores: ["Negro", "Blanco", "Rojo", "Azul"]
    },
    {
      id: "maceta-autorriego",
      nombre: "Maceta con autorriego",
      categoria: "jardin",
      descripcion: "Depósito de agua en la base que mantiene húmeda la tierra varios días. Para suculentas, hierbas y plantas de interior.",
      imagenes: [],
      precioDesde: 220,
      medidas: "Ø 140 × 150 mm",
      entrega: "3 días",
      materiales: ["PETG", "ASA"],
      colores: ["Blanco", "Terracota", "Negro", "Verde"],
      destacado: true
    },
    {
      id: "guia-manguera",
      nombre: "Guía para manguera de jardín",
      categoria: "jardin",
      descripcion: "Se clava en la tierra y evita que la manguera aplaste las plantas al jalarla. Se vende en paquete de 4.",
      imagenes: [],
      precioDesde: 140,
      medidas: "60 × 60 × 250 mm",
      entrega: "2 días",
      materiales: ["ASA", "PETG"],
      colores: ["Verde", "Negro"]
    },
    {
      id: "etiquetas-plantas",
      nombre: "Etiquetas para plantas (set de 10)",
      categoria: "jardin",
      descripcion: "Con el nombre de cada planta en relieve. Tú nos mandas la lista de nombres.",
      imagenes: [],
      precioDesde: 160,
      medidas: "25 × 120 mm cada una",
      entrega: "3 días",
      materiales: ["ASA", "PETG"],
      colores: ["Blanco", "Negro", "Verde"]
    },
    {
      id: "soporte-celular-rejilla",
      nombre: "Soporte de celular para rejilla de A/C",
      categoria: "automotriz",
      descripcion: "Se sujeta a la rejilla sin herramientas. Aguanta el calor del tablero en verano.",
      imagenes: [],
      precioDesde: 230,
      medidas: "Para celulares de 65 a 85 mm de ancho",
      entrega: "3 días",
      materiales: ["ASA", "PA6-GF"],
      colores: ["Negro"]
    },
    {
      id: "organizador-brocas",
      nombre: "Organizador de brocas con medidas",
      categoria: "taller",
      descripcion: "Bloque con 21 orificios marcados de 1 a 10 mm. Para banco de trabajo o caja de herramientas.",
      imagenes: [],
      precioDesde: 200,
      medidas: "180 × 60 × 35 mm",
      entrega: "2 días",
      materiales: ["PETG", "PA6-GF"],
      colores: ["Negro", "Azul", "Naranja"]
    },
    {
      id: "soporte-herramientas",
      nombre: "Soporte de pared para herramientas eléctricas",
      categoria: "taller",
      descripcion: "Cuelga taladros o atornilladores de batería de 12 a 20 V. Incluye espacio para una batería extra.",
      imagenes: [],
      precioDesde: 320,
      medidas: "220 × 120 × 90 mm",
      entrega: "3–4 días",
      materiales: ["PETG", "PA6-GF", "PPA-CF"],
      colores: ["Negro", "Gris"]
    }
  ]
};
