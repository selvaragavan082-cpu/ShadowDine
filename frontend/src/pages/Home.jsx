import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/hotels`);
        if (res.data.success || Array.isArray(res.data)) {
          setHotels(res.data.hotels || res.data);
        }
      } catch (err) {
        console.error('Fetch Hotels Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);


  const filteredHotels = hotels.filter((h) =>
    h.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.cuisine?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', color: '#F8FAFC', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* HERO BANNER */}
        <div style={{ textAlign: 'center', marginBottom: '40px', padding: '40px 20px', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          <span style={{ fontSize: '12px', letterSpacing: '3px', color: '#F59E0B', fontWeight: '800', textTransform: 'uppercase' }}>👑 Premium Dining Reservation</span>
          <h1 style={{ fontSize: '40px', fontWeight: '900', margin: '12px 0', background: 'linear-gradient(135deg, #FFF 0%, #CBD5E1 50%, #94A3B8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Discover Platinum Fine Dining
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '16px', maxWidth: '600px', margin: '0 auto 25px' }}>
            Reserve exclusive VIP tables, pre-order signature gourmet dishes, and enjoy seamless culinary excellence.
          </p>

          {/* SEARCH BAR */}
          <input
            type="text"
            placeholder="🔍 Search fine dining, cuisines, or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', maxWidth: '550px', padding: '16px 24px', borderRadius: '30px', border: '1px solid rgba(245, 158, 11, 0.4)', background: 'rgba(15, 23, 42, 0.8)', color: '#FFF', fontSize: '15px', outline: 'none' }}
          />
        </div>

        {/* RESTAURANTS GRID */}
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: '#FFF' }}>✨ Featured Platinum Restaurants</h2>

        {loading ? (
          <p style={{ color: '#94A3B8' }}>Curating luxury restaurants...</p>
        ) : filteredHotels.length === 0 ? (
          <div style={{ padding: '30px', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
            No matching restaurants found.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
            {filteredHotels.map((hotel) => (
              <div
                key={hotel._id || hotel.id}
                style={{ background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(12px)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.3)', transition: 'transform 0.3s' }}
              >
                <div style={{ height: '180px', background: `url(${hotel.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'}) center/cover`, position: 'relative' }}>
                  <span style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', color: '#F59E0B', padding: '6px 12px', borderRadius: '20px', fontWeight: '800', fontSize: '13px', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                    ⭐ {hotel.rating || '4.8'}
                  </span>
                </div>

                <div style={{ padding: '20px' }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: '20px', color: '#FFF' }}>{hotel.name}</h3>
                  <p style={{ margin: '0 0 12px', color: '#94A3B8', fontSize: '14px' }}>📍 {hotel.address}</p>
                  <p style={{ margin: '0 0 20px', color: '#CBD5E1', fontSize: '13px', fontWeight: '600' }}>Cuisine: {hotel.cuisine || 'Multi-Cuisine Fine Dining'}</p>

                  <button
                    onClick={() => navigate(`/book/${hotel._id || 'real_place_1'}`)}
                    style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: '#0F172A', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)' }}
                  >
                    Reserve Table & Pre-Order ✨
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;