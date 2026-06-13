import { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    setIsAdmin(token === 'authenticated');
    setChecked(true);
  }, []);

  const login = (password) => {
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
    if (password === adminPass) {
      localStorage.setItem('admin_token', 'authenticated');
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, checked, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
