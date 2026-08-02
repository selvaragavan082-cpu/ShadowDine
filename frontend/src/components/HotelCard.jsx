import React from 'react';
import { useNavigate } from 'react-router-dom';

const HotelCard = ({ hotel }) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: 'rgba(30, 41, 59, 0.6)',
        backdropFilter: 'blur(12px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
        boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
        transition: 'transform 0.3s'
      }}
    >
      <div
        style={{
          height: '180px',
          background: `url(${hotel.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'}) center/cover`,
          position: 'relative'
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            color: '#F59E0B',
            padding: '6px 12px',
            borderRadius: '20px',
            fontWeight: '800',
            fontSize: '13px',
            border: '1px solid rgba(245, 158, 11, 0.4)'
          }}
        >
          ⭐ {hotel.rating || '4.5'}
        </span>
      </div>

      <div style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 8px', fontSize: '20px', color: '#FFF' }}>{hotel.name}</h3>
        <p style={{ margin: '0 0 12px', color: '#94A3B8', fontSize: '14px' }}>📍 {hotel.address || hotel.city}</p>
        <p style={{ margin: '0 0 20px', color: '#CBD5E1', fontSize: '13px', fontWeight: '600' }}>
          Cuisine: {hotel.cuisine || 'Multi-Cuisine Fine Dining'}
        </p>

        <button
          onClick={() => navigate(`/book/${hotel._id || 'real_place_1'}`)}
          style={{
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            color: '#0F172A',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '800',
            fontSize: '15px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
          }}
        >
          Reserve Table & Pre-Order ✨
        </button>
      </div>
    </div>
  );
};

export default HotelCard;
