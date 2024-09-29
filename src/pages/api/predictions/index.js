import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!process.env.REPLICATE_API_TOKEN) {
    return res.status(500).json({ detail: 'REPLICATE_API_TOKEN is not set' });
  }

  const { prompt, negative_prompt } = req.body;

  if (!prompt || prompt.trim() === '') {
    return res.status(400).json({ detail: 'Prompt is required' });
  }

  try {
    const prediction = await replicate.predictions.create({
      version: '8beff3369e81422112d93b89ca01426147de542cd4684c244b673b105188fe5f',
      input: { prompt, negative_prompt },
    });

    res.status(201).json(prediction);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
}