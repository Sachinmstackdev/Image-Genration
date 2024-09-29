import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    const prediction = await replicate.predictions.get(id);
    res.status(200).json(prediction);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
}