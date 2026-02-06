import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key não configurada' });
  }

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
      return res.status(200).json({ resposta: data.candidates[0].content.parts[0].text });
    }

    return res.status(500).json({ error: 'IA retornou vazio', detalhes: data });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno', mensagem: err.message });
  }
      }
