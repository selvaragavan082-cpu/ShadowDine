import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext'; // 👈 AuthProvider இறக்குமதி செய்யவும்

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* 👈 AuthProvider சுற்றப்பட வேண்டும் */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);