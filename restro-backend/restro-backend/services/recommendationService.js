const Order = require("../models/Order");

const getHistoricalRecommendations = async (cartItems) => {
    // Get all orders

    const orders = await Order.find();
    console.log("TOTAL ORDERS:", orders.length);
    const recommendationCount = {};

    for (const order of orders) {

        // Get item names from this order
        const orderItems = order.items.map(item => item.name);

        // Check if this order contains any item from current cart
        const containsCartItem = cartItems.some(cartItem =>
            orderItems.includes(cartItem)
        );

        if (!containsCartItem) continue;

        // Count other items ordered together
        for (const item of orderItems) {

            // Don't recommend items already in cart
            if (cartItems.includes(item)) continue;

            recommendationCount[item] =
                (recommendationCount[item] || 0) + 1;
        }
    }

    return Object.entries(recommendationCount)
        .map(([item, score]) => ({
            item,
            score
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
};

module.exports = {
    getHistoricalRecommendations,
};