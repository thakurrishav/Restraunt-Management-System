export const menuItems = [
  { id: 1, name: "Butter Chicken", price: 400, category: "Main Course" },
  { id: 2, name: "Paneer Tikka", price: 250, category: "Starter" },
  { id: 3, name: "Chicken Biryani", price: 450, category: "Main Course" },
  { id: 4, name: "Masala Dosa", price: 150, category: "Starter" },
  { id: 5, name: "Gulab Jamun", price: 100, category: "Dessert" },
  { id: 6, name: "Mango Lassi", price: 120, category: "Beverage" },
  { id: 7, name: "Dal Makhani", price: 180, category: "Main Course" },
  { id: 8, name: "Samosa", price: 80, category: "Starter" },
];

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

export const initialOrders = [
  {
    id: "ORD001",
    customer: "Rahul Shah",
    tableNo: 2,
    items: ["Butter Chicken", "Mango Lassi"],
    total: 520,
    status: "In Progress",
    time: "7:30 PM",
  },
  {
    id: "ORD002",
    customer: "Priya Mehta",
    tableNo: 4,
    items: ["Paneer Tikka", "Masala Dosa", "Gulab Jamun"],
    total: 500,
    status: "Ready",
    time: "7:45 PM",
  },
  {
    id: "ORD003",
    customer: "Amit Patel",
    tableNo: 6,
    items: ["Chicken Biryani", "Dal Makhani"],
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
