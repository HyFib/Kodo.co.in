export type MenuItem = {
  name: string;
  kind: "veg" | "non-veg";
};

export type MenuCategory = {
  id: string;
  title: string;
  kicker: string;
  tone: "yellow" | "green" | "cream" | "orange" | "pink";
  image?: {
    src: string;
    alt: string;
  };
  items: MenuItem[];
};

const veg = (name: string): MenuItem => ({ name, kind: "veg" });
const nonVeg = (name: string): MenuItem => ({ name, kind: "non-veg" });

export const menuCategories: MenuCategory[] = [
  {
    id: "stackers",
    title: "Stackers",
    kicker: "Smiles between buns",
    tone: "yellow",
    image: {
      src: "/food/millet-burger.jpg",
      alt: "A stacked Kodo millet burger",
    },
    items: [
      nonVeg("Steamed Chicken Burger"),
      nonVeg("Korean Burger"),
      nonVeg("Madras Spice Chicken Burger"),
      nonVeg("Nashville Fried Chicken Burger"),
      nonVeg("Chicken Malai Burger"),
      nonVeg("No Bun Burger"),
      veg("Veg Stacker Burger"),
      veg("Paneer Corn Stacker Burger"),
      veg("Double Cheese Burger (Veg)"),
      nonVeg("Double Cheese Burger (Non-Veg)"),
    ],
  },
  {
    id: "pizza",
    title: "Kodo Crust Pizza",
    kicker: "Millet-powered slices",
    tone: "green",
    image: {
      src: "/menu-assets/kodo-crust-pizza.webp",
      alt: "A Kodo millet-crust vegetable pizza with a lifted cheesy slice",
    },
    items: [
      veg("Multigrain Pizza"),
      veg("Moringa Pizza"),
      veg("Margherita Pizza"),
      veg("Veg Genovese Pizza"),
      veg("Peri Peri Pizza (Paneer)"),
      veg("Paneer Tikka Pizza"),
      nonVeg("Madras Spice Chicken Pizza"),
      nonVeg("Peri Peri Pizza (Chicken)"),
      nonVeg("Piccante Chicken Pizza"),
    ],
  },
  {
    id: "sandwich",
    title: "Multi Millet Sandwich",
    kicker: "Toasted, stacked, sorted",
    tone: "cream",
    image: {
      src: "/menu-assets/multi-millet-sandwich.webp",
      alt: "A stack of toasted multi-millet vegetable and cheese sandwiches",
    },
    items: [
      veg("Grilled Cheese Sandwich"),
      veg("Millet Veg Sandwich"),
      nonVeg("Classic Egg Sandwich"),
      nonVeg("Millet Chicken Sandwich"),
    ],
  },
  {
    id: "munchies",
    title: "Guilt-Free Munchies",
    kicker: "Crunch first, questions later",
    tone: "orange",
    image: {
      src: "/menu-assets/guilt-free-munchies.webp",
      alt: "A bowl of golden crispy vegetable nuggets with millet filling",
    },
    items: [
      veg("Crispy Veg Nugget"),
      veg("Chilli Cheese Toast"),
      veg("Jalapeño Poppers"),
      veg("Peri Peri Fries"),
      veg("Cheesy Fries"),
      veg("Paneer Kur Kure"),
      veg("Cheese Balls (6 pcs)"),
      veg("French Fries"),
      nonVeg("Korean Chicken"),
      nonVeg("Hot Honey Chicken"),
      nonVeg("Cheesy Chicken Fries (5 pcs)"),
      nonVeg("Teriyaki Chicken Drums (6 pcs)"),
      nonVeg("Hot Honey Chicken — Spicy"),
      nonVeg("Chicken Tenders (5 pcs)"),
      nonVeg("Chicken Popcorn"),
      nonVeg("Chicken Wings (5 pcs)"),
    ],
  },
  {
    id: "pasta",
    title: "Millet Pasta",
    kicker: "The feel-good twirl",
    tone: "green",
    image: {
      src: "/menu-assets/millet-pasta.webp",
      alt: "Penne millet pasta with roasted tomatoes, basil and vegetables",
    },
    items: [
      veg("Moringa Pasta"),
      veg("Blue Pea Pasta"),
      veg("Spring Veg Pasta (White)"),
      veg("Spring Veg Mac & Cheese"),
      veg("Tandoori Paneer Pasta"),
      nonVeg("Madras Spice Chicken Pasta"),
      nonVeg("Chicken Millet Pasta (White)"),
      nonVeg("Chicken Mac & Cheese"),
      nonVeg("Tandoori Chicken Pasta"),
    ],
  },
  {
    id: "nachos",
    title: "Nachos",
    kicker: "A loud little snack",
    tone: "yellow",
    image: {
      src: "/menu-assets/nachos.webp",
      alt: "Loaded Kodo nachos with cheese, salsa, jalapeño and vegetables",
    },
    items: [
      veg("Mexican Paneer Nachos"),
      nonVeg("Mexican Chicken Nachos"),
      nonVeg("Kabab Chicken Nachos"),
    ],
  },
  {
    id: "momos",
    title: "Soft Momo-ments",
    kicker: "Little pockets of joy",
    tone: "pink",
    image: {
      src: "/food/millet-momos.jpg",
      alt: "Golden Kodo millet momos with chutney",
    },
    items: [
      veg("Veg Momos Steamed (6 pcs)"),
      veg("Veg Momos Sweet n Sizzle (6 pcs)"),
      veg("Veg Momos Fried (6 pcs)"),
      nonVeg("Chicken Momos Steamed (6 pcs)"),
      nonVeg("Chicken Momos Sweet n Sizzle (6 pcs)"),
      nonVeg("Chicken Momos Fried (6 pcs)"),
    ],
  },
  {
    id: "soups",
    title: "Soup",
    kicker: "Smiles shared warm",
    tone: "cream",
    image: {
      src: "/menu-assets/pearl-millet-mushroom-soup.webp",
      alt: "Creamy pearl millet mushroom soup with sautéed mushrooms and thyme",
    },
    items: [
      veg("Buttered Garlic & Tomato Soup"),
      veg("Pearl Millet Mushroom Soup"),
      veg("Almond & Roasted Broccoli Soup"),
    ],
  },
  {
    id: "quick-brew",
    title: "Quick Brew",
    kicker: "A cup-sized reset",
    tone: "yellow",
    image: {
      src: "/menu-assets/quick-brew.webp",
      alt: "Espresso and cappuccino beside a branded yellow Kodo coffee cup",
    },
    items: [
      veg("Cappuccino"),
      veg("Espresso"),
      veg("Ristretto"),
      veg("Americano"),
      veg("Iced Americano"),
      veg("Macchiato"),
      veg("Latte Macchiato"),
      veg("Filter Coffee"),
      veg("Flat White"),
    ],
  },
  {
    id: "cold-coffee",
    title: "Cold Coffee",
    kicker: "Smile, sip, repeat",
    tone: "green",
    image: {
      src: "/menu-assets/cold-coffee.webp",
      alt: "Iced cold coffee beside a branded yellow Kodo takeaway cup",
    },
    items: [
      veg("Mocha"),
      veg("Strawberry Mocha"),
      veg("Cold Coffee"),
      veg("Chocolate Coffee"),
      veg("Matcha Ice"),
      veg("Cold Milo"),
      veg("Oreo Latte"),
      veg("Lotus Biscoff Latte"),
      veg("Strawberry Matcha Latte"),
      veg("Iced Strawberry Latte"),
      veg("Tiramisu Iced Latte"),
      veg("Iced Coffee Honey Lime"),
      veg("Caramel Frappé"),
      veg("Irish Coffee"),
      veg("Frappé"),
    ],
  },
  {
    id: "tea",
    title: "Tea",
    kicker: "Slow sips, bright days",
    tone: "orange",
    image: {
      src: "/menu-assets/tea.webp",
      alt: "Cardamom tea and fresh lime green tea with a branded Kodo cup",
    },
    items: [
      veg("Lime Tea"),
      veg("Green Tea"),
      veg("Black Tea"),
      veg("Cardamom Tea"),
      veg("Green Apple Lime Tea (Cold)"),
    ],
  },
  {
    id: "quick-sip",
    title: "Quick Sip",
    kicker: "Fresh mocktails",
    tone: "pink",
    image: {
      src: "/menu-assets/quick-sip.webp",
      alt: "Iced green apple mint mocktail beside a branded Kodo cup",
    },
    items: [
      veg("Mint"),
      veg("Strawberry"),
      veg("Green Apple"),
      veg("Blue Berry"),
      veg("Green Tea"),
    ],
  },
  {
    id: "smileo",
    title: "Smileo",
    kicker: "Milkshakes with main-character energy",
    tone: "yellow",
    image: {
      src: "/menu-assets/smileo.webp",
      alt: "Chocolate Oreo Smileo milkshake beside a branded Kodo cup",
    },
    items: [
      veg("Chocolate Smileo"),
      veg("Malai Kulfi Smileo"),
      veg("Oreo Smileo"),
      veg("Strawberry Smileo"),
      veg("Nutty Smileo"),
    ],
  },
  {
    id: "hot-beverage",
    title: "Hot Beverage",
    kicker: "Millet warmth in a mug",
    tone: "cream",
    image: {
      src: "/menu-assets/hot-beverage.webp",
      alt: "Steaming ragi hot chocolate and millet malt with a branded Kodo cup",
    },
    items: [veg("Millet Malt"), veg("Ragi Hot Chocolate")],
  },
];
