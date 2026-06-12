import { getServices, saveServices } from '../../../lib/dataStore';

export default function handler(req, res) {
  const { id } = req.query;
  const services = getServices();
  const idx = services.findIndex((s) => s.id === id);

  if (req.method === 'GET') {
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(services[idx]);
  }

  if (req.method === 'PUT') {
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    const updated = { ...services[idx], ...req.body, id };
    updated.price = Number(updated.price);
    services[idx] = updated;
    saveServices(services);
    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    services.splice(idx, 1);
    saveServices(services);
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
