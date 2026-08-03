import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  
  const token = localStorage.getItem('token') || localStorage.getItem('userToken');
  const userStr = localStorage.getItem('user');
  let user = auth?.user || null;

  if (!user && userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      user = { name: 'ragavan' };
    }
  }

  const isAuthenticated = Boolean(token || user);

  const handleLogout = () => {
    if (auth?.logout) {
      auth.logout();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('userToken');
      localStorage.removeItem('user');
    }
    navigate('/login');
  };

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px 40px',
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
      }}
    >
      {/* BRAND LOGO WITH GOLDEN GLOW */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px', filter: 'drop-shadow(0 0 10px #e2e8f0)' }}>👑</span>
          <h1
            style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '900',
              letterSpacing: '2px',
              background: 'linear-gradient(135deg, #FFF 0%, #CBD5E1 50%, #94A3B8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase'
            }}
          >
            Shadow<span style={{ color: '#F59E0B' }}>Dine</span>
          </h1>
        </div>
      </Link>

      {/* NAVIGATION & PLATINUM CONTROLS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link
          to="/"
          style={{
            color: '#E2E8F0',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '15px',
            letterSpacing: '0.5px',
            transition: '0.3s'
          }}
        >
          Explore Dining
        </Link>

        {isAuthenticated ? (
          <>
            {user?.role !== 'admin' && (
              <Link
                to="/my-bookings"
                style={{
                  color: '#CBD5E1',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '15px'
                }}
              >
                My Reservations
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link
                to="/admin-dashboard"
                style={{
                  color: '#F59E0B',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '15px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: '1px solid rgba(245, 158, 11, 0.3)'
                }}
              >
                ⚙️ Admin Console
              </Link>
            )}

            {/* PLATINUM MEMBER BADGE */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)',
                padding: '8px 16px',
                borderRadius: '30px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
            >
              <span style={{ fontSize: '14px' }}>✨</span>
              <span style={{ color: '#F8FAFC', fontWeight: '700', fontSize: '13px', letterSpacing: '0.5px' }}>
                {user?.name || 'ragavan'}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  background: 'linear-gradient(90deg, #E2E8F0, #94A3B8)',
                  color: '#0F172A',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontWeight: '800'
                }}
              >
                {user?.role === 'admin' ? 'ADMIN' : 'PLATINUM'}
              </span>
            </div>

            {/* LUXURY LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #EF4444 0%, #991B1B 100%)',
                color: '#FFF',
                border: 'none',
                borderRadius: '30px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '13px',
                letterSpacing: '1px',
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                transition: 'transform 0.2s'
              }}
            >
              LOGOUT 🚪
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link
              to="/login"
              style={{
                color: '#FFF',
                textDecoration: 'none',
                padding: '10px 22px',
                borderRadius: '30px',
                border: '1px solid rgba(255,255,255,0.2)',
                fontWeight: '600',
                fontSize: '14px',
                background: 'rgba(255,255,255,0.05)'
              }}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              style={{
                color: '#0F172A',
                textDecoration: 'none',
                padding: '10px 22px',
                borderRadius: '30px',
                fontWeight: '800',
                fontSize: '14px',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)'
              }}
            >
              VIP Access
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;