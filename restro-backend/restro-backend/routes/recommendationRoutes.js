const express = require("express");
const router = express.Router();

const {
    getHistoricalRecommendations,
} = require("../services/recommendationService");

const { protect } = require("../middleware/authMiddleware");

router.post("/", async (req, res) => {
    try {
        console.log(req.body);
        const { cartItems } = req.body;

        const recommendations =
            await getHistoricalRecommendations(cartItems);

        const aiResponse =
            await getAIRecommendations(
                cartItems,
                recommendations
            );

        const aiRecommendations =
            JSON.parse(aiResponse);

        res.json({
            success: true,
            historicalRecommendations: recommendations,
            aiRecommendations,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
const {
    testGemini,
} = require("../services/geminiService");
router.get("/test-ai", async (req, res) => {
    try {

        const response = await testGemini();

        res.json({
            success: true,
            response,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
});
const {
    getAIRecommendations,
} = require("../services/geminiService");
module.exports = router;