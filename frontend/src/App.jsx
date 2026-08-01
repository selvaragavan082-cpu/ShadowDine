import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

// Styling Import
import './App.css';

// Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookTable from './pages/BookTable';
import MyBookings from './pages/MyBookings';

// Navigation Bar Component
const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check logged in user from LocalStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    alert('Logged out successfully!');
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 30px',
      backgroundColor: '#111',
      color: '#fff',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
    }}>
      {/* Brand Logo */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h1 style={{ color: '#ff3f6c', margin: 0, fontSize: '1.8rem', fontWeight: 'bold' }}>
          ShadowDine
        </h1>
      </Link>

      {/* Navigation Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}>
          Home
        </Link>

        {user && (
          <Link to="/my-bookings" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}>
            My Bookings 📖
          </Link>
        )}

        {user ? (
          <>
            <span style={{ color: '#ddd', fontSize: '14px' }}>
              Welcome, <strong>{user.name || 'User'}</strong>
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link
              to="/login"
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '5px',
                fontWeight: 'bold'
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '5px',
                fontWeight: 'bold'
              }}
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

// Main App Router Component
function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <Navbar />

        {/* Routes Section */}
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/book/:hotelId" element={<BookTable />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            {/* Catch-all route */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;