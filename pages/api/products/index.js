import { getProducts, saveProducts } from '../../../lib/dataStore';
import { v4 as uuid } from 'uuid';

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(getProducts());
  }

  if (req.method === 'POST') {
    const { name, description, price, category, image, stock, featured } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'name, price, and category are required' });
    }
    const products = getProducts();
    const newProduct = {
      id: `p${Date.now()}`,
      name,
      description: description || '',
      price: Number(price),
      category,
      image: image || '',
      stock: Number(stock) || 0,
      featured: Boolean(featured),
      createdAt: new Date().toISOString().split('T')[0],
    };
    products.push(newProduct);
    saveProducts(products);
    return res.status(201).json(newProduct);
  }

  res.status(405).end();
}
