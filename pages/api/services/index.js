import { getServices, saveServices } from '../../../lib/dataStore';

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(getServices());
  }

  if (req.method === 'POST') {
    const { name, description, price, duration, image, featured } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: 'name and price are required' });
    }
    const services = getServices();
    const newService = {
      id: `s${Date.now()}`,
      name,
      description: description || '',
      price: Number(price),
      duration: duration || '',
      image: image || '',
      featured: Boolean(featured),
      createdAt: new Date().toISOString().split('T')[0],
    };
    services.push(newService);
    saveServices(services);
    return res.status(201).json(newService);
  }

  res.status(405).end();
}
