const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Responda de forma curta e acolhedora: " + prompt }] }]
            })
        });

        const data = await response.json();
        const textoIA = data.candidates[0].content.parts[0].text;
        res.status(200).json({ resposta: textoIA });
    } catch (error) {
        res.status(500).json({ error: "Erro na conexão com a IA" });
    }
});

module.exports = app;
