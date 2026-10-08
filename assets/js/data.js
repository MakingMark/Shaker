/* Shaker DCN Nutrition — catálogo del menú
   Fuente: menú impreso de Shaker by DCN (octubre 2026), en pocas categorías
   para que el menú no se sienta sobrecargado. Los precios están en pesos dominicanos (RD$).
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
      base: {
        label: "Elige tu base",
        type: "single",
        required: true,
        options: [
          { name: "Puré de papa", price: 0 },
          { name: "Puré de yautía", price: 0 },
          { name: "Plátano maduro", price: 0 },
          { name: "Batata hervida", price: 0 },
        ],
      },
      acompanante: {
        label: "Elige tu acompañante",
        type: "single",
        required: true,
        options: [
          { name: "Chuleta", price: 0 },
          { name: "Derretido de queso", price: 0 },
          { name: "Omelette", price: 0 },
          { name: "Salchichas", price: 0 },
          { name: "Huevo hervido", price: 0 },
          { name: "Salami", price: 0 },
        ],
      },
      acompanante2: {
        label: "Segundo acompañante",
        type: "single",
        required: true,
        options: [
          { name: "Chuleta", price: 0 },
          { name: "Derretido de queso", price: 0 },
          { name: "Omelette", price: 0 },
          { name: "Salchichas", price: 0 },
          { name: "Huevo hervido", price: 0 },
          { name: "Salami", price: 0 },
        ],
      },
    },
    subgroups: [
      {
        label: "Desayuno — elige tu base y acompañante",
        items: [
          { name: "Desayuno con 1 acompañante", price: 175, modifiers: ["base", "acompanante"] },
          { name: "Desayuno con 2 acompañantes", price: 200, modifiers: ["base", "acompanante", "acompanante2"] },
        ],
      },
      {
        label: "Sándwiches",
        items: [
          { name: "Sándwich de pollo", price: 175 },
          { name: "Sándwich de res", price: 200 },
          { name: "Sándwich de jamón de pavo y mozzarella", price: 150 },
          { name: "Tostada", price: 100 },
        ],
      },
      {
        label: "Waffles",
        items: [
          { name: "Waffle de huevo revuelto y salchichas", price: 175 },
          { name: "Waffle de granola", price: 175 },
        ],
      },
      {
        label: "Wraps",
        items: [
          { name: "Wrap de pollo", price: 250 },
          { name: "Wrap de res", price: 300 },
          { name: "Wrap de jamón de pavo y queso", price: 200 },
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
          { name: "Papas a la air fryer", price: 0 },
          { name: "Plátano maduro", price: 0 },
        ],
      },
    },
    subgroups: [
      {
        label: "Platos fuertes — incluyen 1 guarnición y ensalada",
        items: [
          { name: "Carne molida", price: 350, modifiers: ["guarnicion"] },
          { name: "Pechuga a la plancha", price: 350, modifiers: ["guarnicion"] },
          { name: "Lomo de cerdo", price: 400, modifiers: ["guarnicion"] },
        ],
      },
      {
        label: "Otras opciones",
        items: [
          { name: "Canoa de plátano maduro", price: 300 },
          { name: "Ensalada de pollo", price: 300 },
        ],
      },
    ],
  },

  {
    id: "bebidas",
    name: "Batidos y bebidas",
    icon: "🥤",
    tagline: "Para hidratarte y recargar",
    img: "assets/img/bebidas.jpg",
    modifierGroups: {
      sabor: {
        label: "Sabor de la proteína",
        type: "single",
        required: true,
        options: [
          { name: "Vainilla", price: 0 },
          { name: "Chocolate", price: 0 },
          { name: "Cookie cream", price: 0 },
        ],
      },
      fruta: {
        label: "Elige 1 fruta",
        type: "single",
        required: true,
        options: [
          { name: "Guineo", price: 0 },
          { name: "Fresa", price: 0 },
          { name: "Lechosa", price: 0 },
          { name: "Piña", price: 0 },
        ],
      },
    },
    subgroups: [
      {
        label: "Batido de proteína — incluye topping",
        items: [
          { name: "Batido de proteína", price: 250, modifiers: ["sabor", "fruta"] },
        ],
      },
      {
        label: "Batidos",
        items: [
          { name: "Batido de guineo", price: 100 },
          { name: "Batido de lechosa", price: 110 },
          { name: "Batido de zapote", price: 150 },
          { name: "Batido de fresa", price: 150 },
          { name: "Frappé de café", price: 275 },
        ],
      },
      {
        label: "Jugos naturales",
        items: [
          { name: "Jugo de chinola", price: 80 },
          { name: "Jugo de limón", price: 80 },
          { name: "Jugo de fresa", price: 80 },
          { name: "Jugo de naranja", price: 80 },
        ],
      },
      {
        label: "Bebidas",
        items: [
          { name: "Agua", price: 25 },
          { name: "Refresco", price: 40 },
          { name: "Bebida energética", price: 150 },
          { name: "Café", price: 50 },
        ],
      },
    ],
  },

  {
    id: "menu-fat",
    name: "Menú FAT",
    icon: "🍔",
    tagline: "Cargado y especial, para darte un gusto",
    img: "assets/img/fat.jpg",
    modifierGroups: {
      proteina: {
        label: "Pollo o res",
        type: "single",
        required: true,
        options: [
          { name: "Pollo", price: 0 },
          { name: "Res", price: 0 },
        ],
      },
      baseYaroa: {
        label: "Papas o plátano maduro",
        type: "single",
        required: true,
        options: [
          { name: "Papas", price: 0 },
          { name: "Plátano maduro", price: 0 },
        ],
      },
    },
    subgroups: [
      {
        label: "Hamburguesas",
        items: [
          { name: "Hamburguesa clásica", price: 250 },
          { name: "Cheese burger", price: 275 },
          { name: "Doble carne", price: 350 },
          { name: "Smash Shaker", price: 300 },
        ],
      },
      {
        label: "Burritos",
        items: [
          { name: "Burrito de pollo o res", price: 300, modifiers: ["proteina"] },
          { name: "Quesadilla", price: 325 },
        ],
      },
      {
        label: "Yaroa",
        items: [
          { name: "Yaroa mediana", price: 300, modifiers: ["proteina", "baseYaroa"] },
          { name: "Yaroa grande", price: 400, modifiers: ["proteina", "baseYaroa"] },
        ],
      },
    ],
  },
];
