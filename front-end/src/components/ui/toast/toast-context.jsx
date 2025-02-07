// components/ui/toast/toast-context.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => !toast.expired));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toast = ({ title, description, variant = 'default' }) => {
    const id = Math.random().toString(36).substr(2, 9);
    const createdAt = Date.now();

    setToasts((prevToasts) => [
      ...prevToasts,
      {
        id,
        title,
        description,
        variant,
        createdAt,
        get expired() {
          return Date.now() - this.createdAt > 5000; // 5 seconds
        },
      },
    ]);
  };

  return (
    <ToastContext.Provider value={{ toast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}