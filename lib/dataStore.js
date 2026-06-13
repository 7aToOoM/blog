import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

function readJSON(file) {
  const filePath = path.join(dataDir, file);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJSON(file, data) {
  const filePath = path.join(dataDir, file);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export const getProducts = () => readJSON('products.json');
export const getProduct = (id) => getProducts().find((p) => p.id === id) || null;
export const saveProducts = (data) => writeJSON('products.json', data);

export const getServices = () => readJSON('services.json');
export const getService = (id) => getServices().find((s) => s.id === id) || null;
export const saveServices = (data) => writeJSON('services.json', data);

export const getOrders = () => readJSON('orders.json');
export const saveOrders = (data) => writeJSON('orders.json', data);
