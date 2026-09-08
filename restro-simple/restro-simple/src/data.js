export const menuItems = [
  // Starters
  { id: 1, name: "Paneer Tikka", price: 250, category: "Starter" },
  { id: 2, name: "Chicken Tikka", price: 280, category: "Starter" },
  { id: 3, name: "Samosa", price: 80, category: "Starter" },
  { id: 4, name: "Spring Roll", price: 120, category: "Starter" },
  { id: 5, name: "Veg Manchurian", price: 180, category: "Starter" },

  // Main Course
  { id: 6, name: "Butter Chicken", price: 400, category: "Main Course" },
  { id: 7, name: "Chicken Biryani", price: 450, category: "Main Course" },
  { id: 8, name: "Veg Biryani", price: 300, category: "Main Course" },
  { id: 9, name: "Dal Makhani", price: 180, category: "Main Course" },
  { id: 10, name: "Kadai Paneer", price: 250, category: "Main Course" },
  { id: 11, name: "Shahi Paneer", price: 270, category: "Main Course" },

  // Breads
  { id: 12, name: "Butter Naan", price: 40, category: "Bread" },
  { id: 13, name: "Garlic Naan", price: 60, category: "Bread" },
  { id: 14, name: "Tandoori Roti", price: 30, category: "Bread" },
  { id: 15, name: "Laccha Paratha", price: 50, category: "Bread" },

  // Rice
  { id: 16, name: "Jeera Rice", price: 120, category: "Rice" },
  { id: 17, name: "Steam Rice", price: 100, category: "Rice" },

  // Sides
  { id: 18, name: "Mint Chutney", price: 30, category: "Side" },
  { id: 19, name: "Raita", price: 50, category: "Side" },
  { id: 20, name: "Green Salad", price: 70, category: "Side" },
  { id: 21, name: "French Fries", price: 120, category: "Side" },

  // Beverages
  { id: 22, name: "Coke", price: 50, category: "Beverage" },
  { id: 23, name: "Pepsi", price: 50, category: "Beverage" },
  { id: 24, name: "Sprite", price: 50, category: "Beverage" },
  { id: 25, name: "Mango Lassi", price: 120, category: "Beverage" },
  { id: 26, name: "Masala Chaas", price: 80, category: "Beverage" },
  { id: 27, name: "Lemon Soda", price: 70, category: "Beverage" },

  // Desserts
  { id: 28, name: "Gulab Jamun", price: 100, category: "Dessert" },
  { id: 29, name: "Kulfi", price: 120, category: "Dessert" },
  { id: 30, name: "Brownie", price: 180, category: "Dessert" },
  { id: 31, name: "Vanilla Ice Cream", price: 120, category: "Dessert" }
];
const foodTypes = ["All", ...new Set(menuItems.map(m => m.type))];
export const initialTables = [
  { id: 1, tableNo: 1, seats: 4, status: "Available", customer: "" },
  { id: 2, tableNo: 2, seats: 6, status: "Booked", customer: "Rahul Shah" },
  { id: 3, tableNo: 3, seats: 2, status: "Available", customer: "" },
  { id: 4, tableNo: 4, seats: 4, status: "Booked", customer: "Priya Mehta" },
  { id: 5, tableNo: 5, seats: 6, status: "Available", customer: "" },
  { id: 6, tableNo: 6, seats: 3, status: "Booked", customer: "Amit Patel" },
  { id: 7, tableNo: 7, seats: 4, status: "Available", customer: "" },
  { id: 8, tableNo: 8, seats: 5, status: "Available", customer: "" },
];
const combos = {
  "Chicken Tikka": [
    "Butter Naan",
    "Butter Chicken",
    "Mango Lassi"
  ],

  "Paneer Tikka": [
    "Butter Naan",
    "Dal Makhani",
    "Sweet Lassi"
  ],

  "Burger": [
    "French Fries",
    "Coke"
  ]
};
export const initialOrders = [
  {
    id: "ORD001",
    customer: "Rahul Shah",
    tableNo: 2,
    items: ["Butter Chicken", "Butter Naan", "Coke"],
    total: 520,
    status: "In Progress",
    time: "7:30 PM",
  },
  {
    id: "ORD002",
    customer: "Priya Mehta",
    tableNo: 4,
    items: ["Paneer Tikka", "Mint Chutney", "Masala Chaas"],
    total: 500,
    status: "Ready",
    time: "7:45 PM",
  },
  {
    id: "ORD003",
    customer: "Amit Patel",
    tableNo: 6,
    items: ["Chicken Biryani", "Raita", "Coke"],
    total: 630,
    status: "In Progress",
    time: "8:00 PM",
  },
];
export const recommendations = {
  "Butter Chicken": ["Mango Lassi", "Gulab Jamun"],
  "Paneer Tikka": ["Mango Lassi"],
  "Chicken Biryani": ["Mango Lassi", "Gulab Jamun"],
  "Masala Dosa": ["Mango Lassi"],
  "Dal Makhani": ["Gulab Jamun"],
  "Samosa": ["Mango Lassi"],
};
