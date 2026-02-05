const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/', async (req, res) => {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Se a chave não estiver configurada no Vercel, ele avisa aqui
    if (!apiKey) {
        return res.status(500).json({ error: "Chave API não configurada no Vercel" });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        
        // Verifica se o Google retornou erro (ex: chave inválida)
        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        const textoIA = data.candidates[0].content.parts[0].text;
        res.status(200).json({ resposta: textoIA });

    } catch (error) {
        res.status(500).json({ error: "Falha interna: " + error.message });
    }
});

module.exports = app;
