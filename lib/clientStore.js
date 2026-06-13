import { DEFAULT_PRODUCTS, DEFAULT_SERVICES } from './defaultData';

const KEYS = {
  products: 'lf_products',
  services: 'lf_services',
  orders: 'lf_orders',
};

function load(key, defaults) {
  if (typeof window === 'undefined') return defaults;
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) return JSON.parse(raw);
    localStorage.setItem(key, JSON.stringify(defaults));
    return defaults;
  } catch {
    return defaults;
  }
}

function save(key, data) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

export const getProducts = () => load(KEYS.products, DEFAULT_PRODUCTS);
export const getProduct = (id) => getProducts().find((p) => p.id === id) || null;
export const saveProducts = (data) => save(KEYS.products, data);

export const addProduct = (product) => {
  const list = getProducts();
  list.push(product);
  saveProducts(list);
  return product;
};

export const updateProduct = (id, updates) => {
  const list = getProducts().map((p) => (p.id === id ? { ...p, ...updates, id } : p));
  saveProducts(list);
};

export const deleteProduct = (id) => {
  saveProducts(getProducts().filter((p) => p.id !== id));
};

export const getServices = () => load(KEYS.services, DEFAULT_SERVICES);
export const getService = (id) => getServices().find((s) => s.id === id) || null;
export const saveServices = (data) => save(KEYS.services, data);

export const addService = (service) => {
  const list = getServices();
  list.push(service);
  saveServices(list);
  return service;
};

export const updateService = (id, updates) => {
  const list = getServices().map((s) => (s.id === id ? { ...s, ...updates, id } : s));
  saveServices(list);
};

export const deleteService = (id) => {
  saveServices(getServices().filter((s) => s.id !== id));
};

export const getOrders = () => load(KEYS.orders, []);

export const addOrder = (order) => {
  const list = getOrders();
  list.push(order);
  save(KEYS.orders, list);
  return order;
};

export const updateOrderStatus = (id, status) => {
  const list = getOrders().map((o) => (o.id === id ? { ...o, status } : o));
  save(KEYS.orders, list);
};
