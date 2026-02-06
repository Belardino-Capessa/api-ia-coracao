import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors({ origin: '*' })); // permite qualquer origem
app.use(express.json());

app.post('/', async (req, res) => {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      }
    );

    const data = await response.json();

    if (data.candidates && data.candidates[0].content) {
      const textoIA = data.candidates[0].content.parts[0].text;
      return res.status(200).json({ resposta: textoIA });
    }

    res.status(500).json({ error: 'IA retornou vazio', detalhes: data });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno', mensagem: err.message });
  }
});

export default app;
