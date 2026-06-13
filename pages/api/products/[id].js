import { getProducts, saveProducts } from '../../../lib/dataStore';

export default function handler(req, res) {
  const { id } = req.query;
  const products = getProducts();
  const idx = products.findIndex((p) => p.id === id);

  if (req.method === 'GET') {
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(products[idx]);
  }

  if (req.method === 'PUT') {
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    const updated = { ...products[idx], ...req.body, id };
    updated.price = Number(updated.price);
    updated.stock = Number(updated.stock);
    products[idx] = updated;
    saveProducts(products);
    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    products.splice(idx, 1);
    saveProducts(products);
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
