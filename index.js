const express = require('express');
const cors = require('cors');
// Esta linha abaixo resolve o erro 500 de importação
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

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
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        
        // Proteção caso o Gemini mude a resposta
        if (data.candidates && data.candidates[0].content) {
            const textoIA = data.candidates[0].content.parts[0].text;
            res.status(200).json({ resposta: textoIA });
        } else {
            res.status(500).json({ error: "Resposta inválida da API" });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro interno no servidor" });
    }
});

module.exports = app;
