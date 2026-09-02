const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

const getAIRecommendations = async (
    cartItems,
    historicalRecommendations
) => {

    const model = genAI.getGenerativeModel({
        model: "gemini-3.5-flash-lite",
    });

    const prompt = `
Customer Cart:
${cartItems.join(", ")}

Historical Recommendations:
${historicalRecommendations
        .map(r => `${r.item} (${r.score})`)
        .join("\n")}

Recommend up to 3 menu items.

Explain briefly why each item is recommended.

Return ONLY valid JSON in this format:

[
  {
    "item": "Mango Lassi",
    "reason": "Pairs well with spicy dishes"
  }
]
`;

    const result = await model.generateContent(prompt);

    return result.response.text();
};

module.exports = {
    getAIRecommendations,
};