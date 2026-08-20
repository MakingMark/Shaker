/* Shaker DCN Nutrition — catálogo del menú
   Fuente: menu.json del negocio, reorganizado en menos categorías para que el
   menú no se sienta sobrecargado. Los precios están en pesos dominicanos (RD$).
   Para cambiar un precio o agregar un producto, edita este archivo.
   Las OFERTAS viven aparte, en assets/data/offers.json. */

const SHAKER_CONFIG = {
  brand: "Shaker",
  brandFull: "Shaker DCN Nutrition",
  tagline: "Comida real para tu rutina",
  currency: "RD$",
  whatsappPedidos: "18292338661",
  whatsappEntrenamiento: "18292338661",
  instagram: "dcnnutritionshaker",
  whatsappGreeting: "¡Hola Shaker! Quiero hacer este pedido:",
};

const MENU = [
  {
    id: "desayunos",
    name: "Desayunos",
    icon: "🍳",
    tagline: "Para arrancar el día con energía",
    img: "assets/img/desayunos.jpg",
    modifierGroups: {
      acompanante: {
        label: "Elige tu acompañante",
        type: "single",
        required: true,
        options: [
          { name: "Huevo hervido", price: 0 },
          { name: "Omelette de vegetales", price: 0 },
          { name: "Chuleta al air fryer", price: 0 },
          { name: "Salami artesanal", price: 0 },
          { name: "Salchicha de desayuno", price: 0 },
          { name: "Aguacate", price: 35 },
          { name: "Queso", price: 0 },
        ],
      },
      extras: {
        label: "Extras",
        type: "multi",
        required: false,
        options: [{ name: "Bacon adicional", price: 65 }],
      },
    },
    subgroups: [
      {
        label: "Platos fit — elige tu acompañante",
        items: [
          { name: "Plátano maduro", price: 175, modifiers: ["acompanante"] },
          { name: "Batata", price: 175, modifiers: ["acompanante"] },
          { name: "Puré de papa light", price: 175, modifiers: ["acompanante"] },
          { name: "Puré de yautía", price: 175, modifiers: ["acompanante"] },
        ],
      },
      {
        label: "Omelettes",
        items: [
          { name: "Huevo y vegetales", price: 125, modifiers: ["extras"] },
          { name: "Huevo, vegetales y mozzarella", price: 175, modifiers: ["extras"] },
        ],
      },
      {
        label: "Sándwiches y pan francés",
        items: [
          { name: "Sándwich de pollo", price: 175, modifiers: ["extras"] },
          { name: "Sándwich de carne de res", price: 200, modifiers: ["extras"] },
          { name: "Sándwich de atún", price: 200, modifiers: ["extras"] },
          { name: "Sándwich jamón, pavo y queso mozzarella", price: 150, modifiers: ["extras"] },
          { name: "Sándwich jamón, queso y pollo o carne de res", price: 225, modifiers: ["extras"] },
          { name: "Sándwich de pollo y huevo", price: 200, modifiers: ["extras"] },
          { name: "Sándwich jamón, queso, huevo, pollo o carne de res", price: 250, modifiers: ["extras"] },
          { name: "Tostadas", price: 100, modifiers: ["extras"] },
          { name: "Pan integral", price: 100, modifiers: ["extras"] },
        ],
      },
      {
        label: "Waffles y pancakes",
        items: [
          { name: "Waffle de avena con granola", price: 175 },
          { name: "Waffle de avena (frutas)", price: 150 },
          { name: "Waffle de avena (huevo revuelto y salchicha)", price: 175 },
          { name: "Waffle de proteína (avena, frutas)", price: 200 },
        ],
      },
    ],
  },

  {
    id: "almuerzos",
    name: "Almuerzos",
    icon: "🥗",
    tagline: "Balanceados, para el mediodía",
    img: "assets/img/almuerzos.jpg",
    modifierGroups: {
      guarnicion: {
        label: "Elige tu guarnición",
        type: "single",
        required: true,
        options: [
          { name: "Batata", price: 0 },
          { name: "Puré de papa light", price: 0 },
          { name: "Vegetales salteados extra", price: 0 },
          { name: "Yautía", price: 0 },
          { name: "Papas al air fryer", price: 0 },
          { name: "Plátano maduro", price: 0 },
        ],
      },
    },
    subgroups: [
      {
        label: "Platos fuertes — elige tu guarnición",
        items: [
          { name: "Pechuga a la plancha con vegetales salteados", price: 350, modifiers: ["guarnicion"] },
          { name: "Lomo de cerdo con vegetales salteados", price: 400, modifiers: ["guarnicion"] },
          { name: "Filete de tilapia con vegetales salteados", price: 400, modifiers: ["guarnicion"] },
        ],
      },
      {
        label: "Otras opciones",
        items: [
          { name: "Canoa de plátano maduro", price: 300 },
          { name: "Hamburguesa artesanal", price: 350 },
          { name: "Hamburguesa en lechuga", price: 300 },
          { name: "Yaroa ligera", price: 325 },
          { name: "Wrap de pavo", price: 300 },
          { name: "Ensalada César", price: 300 },
        ],
      },
      {
        label: "Wraps medianos",
        items: [
          { name: "Wrap mediano de queso y jamón de pavo", price: 150 },
          { name: "Wrap mediano de res o pollo", price: 200 },
          { name: "Wrap mediano de atún", price: 225 },
          { name: "Wrap mediano de huevo, pollo o res", price: 250 },
        ],
      },
      {
        label: "Wraps grandes",
        items: [
          { name: "Wrap grande de pollo o res", price: 250 },
          { name: "Wrap grande de atún", price: 300 },
          { name: "Wrap grande de jamón, queso, pollo o res", price: 300 },
          { name: "Wrap grande de queso, jamón, huevo, pollo o res", price: 325 },
          { name: "Wrap grande tortilla de espinaca, pollo o res", price: 350 },
        ],
      },
    ],
  },

  {
    id: "bebidas",
    name: "Batidas y bebidas",
    icon: "🥤",
    tagline: "Para hidratarte y recargar",
    img: "assets/img/bebidas.jpg",
    modifierGroups: {
      extras: {
        label: "Agrega extras",
        type: "multi",
        required: false,
        options: [
          { name: "Frutas", price: 25 },
          { name: "Avena", price: 25 },
          { name: "Mantequilla de maní", price: 25 },
          { name: "Creatina", price: 50 },
        ],
      },
    },
    subgroups: [
      {
        label: "Batidas proteicas",
        items: [
          { name: "Coco Paradise", price: 225, modifiers: ["extras"] },
          { name: "Coffee Delight", price: 225, modifiers: ["extras"] },
          { name: "Tropical Sunset", price: 225, modifiers: ["extras"] },
          { name: "Cookie Crush", price: 225, modifiers: ["extras"] },
          { name: "Shaker Boom", price: 260, modifiers: ["extras"] },
          { name: "Shaker Muscle", price: 260, modifiers: ["extras"] },
        ],
      },
      {
        label: "Batidos naturales",
        items: [
          { name: "Batido de fresa", price: 150, modifiers: ["extras"] },
          { name: "Batido de guineo", price: 100, modifiers: ["extras"] },
          { name: "Batido de zapote", price: 140, modifiers: ["extras"] },
          { name: "Batido de ciruela", price: 150, modifiers: ["extras"] },
          { name: "Batido de lechoza", price: 100, modifiers: ["extras"] },
          { name: "Batido cerelac", price: 125, modifiers: ["extras"] },
          { name: "Batido de mango", price: 100, modifiers: ["extras"] },
        ],
      },
      {
        label: "Frappé y café frío",
        items: [
          { name: "Helado de vainilla o chocolate", price: 250 },
          { name: "Café frío sin licuado", price: 175 },
        ],
      },
      {
        label: "Jugos y refrescos",
        items: [
          { name: "Jugos naturales", price: 100 },
          { name: "Jugo verde", price: 125 },
          { name: "Frozen de fresa", price: 125 },
          { name: "Frozen de piña limón", price: 100 },
          { name: "Agua", price: 25 },
          { name: "Bebida energética", price: 150 },
          { name: "Coca Cola", price: 40 },
        ],
      },
    ],
  },

  {
    id: "aperitivos",
    name: "Aperitivos",
    icon: "🍓",
    tagline: "Snacks ligeros y rápidos",
    img: "assets/img/aperitivos.jpg",
    items: [
      { name: "Yogurt con frutas", price: 100 },
      { name: "Yogurt con granola", price: 100 },
      { name: "Yogurt mixto", price: 125 },
      { name: "Barra de proteína", price: 75 },
      { name: "Gelatina", price: 50 },
    ],
  },

  {
    id: "menu-fat",
    name: "Menú FAT",
    icon: "🍔",
    tagline: "Cargado y especial, para darte un gusto",
    img: "assets/img/fat.jpg",
    subgroups: [
      {
        label: "Hamburguesas",
        items: [
          { name: "Hamburguesa clásica", price: 250 },
          { name: "Cheese burger", price: 275 },
          { name: "Doble cheese burger", price: 325 },
          { name: "Smash Alfred", price: 350 },
          { name: "Smash Shaker", price: 300 },
          { name: "Súper especial", price: 450 },
        ],
      },
      {
        label: "Yaroas y papas especiales",
        items: [
          { name: "Papas Alfred", price: 400 },
          { name: "Papas Alfred con bacon caramelizado", price: 425 },
          { name: "Yaroa normal mediana", price: 275 },
          { name: "Yaroa normal grande", price: 375 },
        ],
      },
      {
        label: "Burritos",
        items: [
          { name: "Burrito de pollo con bacon caramelizado", price: 350 },
          { name: "Burrito Shaker", price: 325 },
          { name: "Burrito de carne de res con mozzarella", price: 350 },
        ],
      },
      {
        label: "Quesadillas",
        items: [
          { name: "Quesadilla de pollo con mozzarella", price: 300 },
          { name: "Quesadilla de res con mozzarella", price: 300 },
        ],
      },
    ],
  },
];
