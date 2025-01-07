import express from "express";
import {translate} from "@vitalets/google-translate-api";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { text, language } = req.body;
        if (!text || !language) {
            return res.status(400).json({ error: "Both 'text' and 'language' fields are required" });
        }
        const translation = await translate(text, { to: language });
        res.json({ translatedText: translation.text });
    } catch (err) {
        res.status(500).json({ error: "Failed to translate the text" });
    }
});

export default router;
