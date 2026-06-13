import { getOrders, saveOrders } from '../../../lib/dataStore';

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(getOrders());
  }

  if (req.method === 'POST') {
    const { customer, items, total, address } = req.body;
    if (!customer || !items || !total) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }
    const orders = getOrders();
    const newOrder = {
      id: `ord${Date.now()}`,
      customer,
      items,
      total: Number(total),
      address: address || {},
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    orders.push(newOrder);
    saveOrders(orders);
    return res.status(201).json(newOrder);
  }

  res.status(405).end();
}
