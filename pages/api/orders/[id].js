import { getOrders, saveOrders } from '../../../lib/dataStore';

export default function handler(req, res) {
  const { id } = req.query;
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === id);

  if (req.method === 'PATCH') {
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    orders[idx] = { ...orders[idx], ...req.body, id };
    saveOrders(orders);
    return res.status(200).json(orders[idx]);
  }

  res.status(405).end();
}
