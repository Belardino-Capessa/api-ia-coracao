const express = require('express');
const cors = require('cors');
const app = express();

// Permitir CORS de qualquer origem
app.use(cors({ origin: '*' }));
app.use(express.json());

// Endpoint de chat
app.post('/chat', async (req, res) => {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0].content) {
            const textoIA = data.candidates[0].content.parts[0].text;
            res.status(200).json({ resposta: textoIA });
        } else {
            res.status(500).json({ error: "Erro na resposta da IA", detalhes: data });
        }

    } catch (error) {
        res.status(500).json({ error: "Erro interno", mensagem: error.message });
    }
});

// Exportar app para Vercel
module.exports = app;
