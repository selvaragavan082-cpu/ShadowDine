import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem('token') || localStorage.getItem('userToken');
  const userStr = localStorage.getItem('user');
  let storedUser = null;
  if (userStr) {
    try {
      storedUser = JSON.parse(userStr);
    } catch (e) {}
  }

  const activeUser = user || storedUser;
  const isAuthenticated = Boolean(token || activeUser);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && activeUser?.role !== 'admin') return <Navigate to="/" replace />;

  return children;
}