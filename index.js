import express from 'express';
import { HfInference } from '@huggingface/inference';

const app = express();
const port = 3000;

const hf = new HfInference('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');

// Servir archivos estáticos desde el directorio 'public'
app.use(express.static('public'));

// Ruta para manejar la solicitud del usuario y obtener respuesta
app.get('/api/query', async (req, res) => {
  try {
    const userInput = req.query.input; // Obtener el parámetro 'input' de la solicitud GET
    if (!userInput) {
      throw new Error('No input provided');
    }

    let out = "";
    for await (const chunk of hf.chatCompletionStream({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [
        { role: "user", content: userInput },
      ],
      max_tokens: 500,
      temperature: 0.1,
      seed: 1,
    })) {
      if (chunk.choices && chunk.choices.length > 0) {
        out += chunk.choices[0].delta.content;
      }
    }

    // Enviar la respuesta al cliente
    res.json({ answer: out });

  } catch (error) {
    console.error('Error handling request:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
