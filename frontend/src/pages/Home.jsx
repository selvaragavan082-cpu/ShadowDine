import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../services/api';

// Fallback Demo Hotels Data (ALWAYS AVAILABLE)
const DEFAULT_DEMO_HOTELS = [
  {
    _id: 'demo_hotel_1',
    name: 'SR Platinum Fine Dining',
    city: 'Salem',
    address: 'Near Junction, Salem, Tamil Nadu',
    rating: '4.9 ⭐',
    cuisine: 'Chettinad, South Indian & Tandoori',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600',
    location: { lat: 11.6643, lng: 78.1460 }
  },
  {
    _id: 'demo_hotel_2',
    name: 'Grand Estancia VIP Lounge',
    city: 'Salem',
    address: 'Bangalore Highway, Salem, Tamil Nadu',
    rating: '4.8 ⭐',
    cuisine: 'Continental, Italian & Multi-Cuisine',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600',
    location: { lat: 11.6850, lng: 78.1380 }
  },
  {
    _id: 'demo_hotel_3',
    name: 'Le Royal Sky Gourmet',
    city: 'Chennai',
    address: 'Nungambakkam High Road, Chennai, Tamil Nadu',
    rating: '4.9 ⭐',
    cuisine: 'Mediterranean, Seafood & Mughlai',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600',
    location: { lat: 13.0604, lng: 80.2496 }
  },
  {
    _id: 'demo_hotel_4',
    name: 'Royal Orchid Rooftop',
    city: 'Coimbatore',
    address: 'Avinashi Road, Coimbatore, Tamil Nadu',
    rating: '4.7 ⭐',
    cuisine: 'North Indian, Asian Fusion & Bakery',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600',
    location: { lat: 11.0168, lng: 76.9558 }
  },
  {
    _id: 'demo_hotel_5',
    name: 'Taj Gateway Heritage',
    city: 'Madurai',
    address: 'Pasumalai, Madurai, Tamil Nadu',
    rating: '4.9 ⭐',
    cuisine: 'Traditional Royal Feast & Barbecue',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600',
    location: { lat: 9.9252, lng: 78.1198 }
  },
  {
    _id: 'demo_hotel_6',
    name: 'ShadowDine Executive Suite',
    city: 'Bengaluru',
    address: 'Indiranagar 100ft Road, Bengaluru, Karnataka',
    rating: '4.8 ⭐',
    cuisine: 'Pan-Asian, Japanese & Gourmet Steak',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600',
    location: { lat: 12.9716, lng: 77.5946 }
  }
];

// Haversine formula to compute distance in km
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
};

const Home = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState(DEFAULT_DEMO_HOTELS);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/hotels`);
        const apiHotels = res.data?.hotels || (Array.isArray(res.data) ? res.data : []);
        if (apiHotels && apiHotels.length > 0) {
          setHotels(apiHotels);
        } else {
          setHotels(DEFAULT_DEMO_HOTELS);
        }
      } catch (err) {
        console.warn('Backend API fetch failed, using Default Demo Hotels:', err.message);
        setHotels(DEFAULT_DEMO_HOTELS);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  // Nearest Hotel Search Handler via Geolocation
  const handleFindNearest = () => {
    if (!navigator.geolocation) {
      setLocationStatus('⚠️ Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setLocationStatus('🔍 Accessing your location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Calculate distance and sort hotels
        const sorted = [...hotels].map((h) => {
          const distance = calculateDistanceKm(
            lat,
            lng,
            h.location?.lat || 11.6643,
            h.location?.lng || 78.1460
          );
          return { ...h, distance: Number(distance) };
        }).sort((a, b) => (a.distance || 9999) - (b.distance || 9999));

        setHotels(sorted);
        setLocating(false);
        setLocationStatus('✅ Hotels sorted by nearest proximity to your location!');
      },
      (error) => {
        console.warn('Geolocation Error:', error.message);
        setLocating(false);
        setLocationStatus('📍 Showing top featured regional restaurants.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const filteredHotels = hotels.filter((h) =>
    h.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.cuisine?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', color: '#F8FAFC', padding: '40px 20px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* HERO BANNER */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '40px',
            padding: '44px 24px',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}
        >
          <span style={{ fontSize: '12px', letterSpacing: '3px', color: '#F59E0B', fontWeight: '800', textTransform: 'uppercase' }}>
            👑 Premium Dining & Table Reservations
          </span>
          <h1
            style={{
              fontSize: '42px',
              fontWeight: '900',
              margin: '12px 0',
              background: 'linear-gradient(135deg, #FFF 0%, #CBD5E1 50%, #94A3B8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Discover Platinum Fine Dining
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '16px', maxWidth: '650px', margin: '0 auto 28px' }}>
            Reserve exclusive VIP tables, pre-order gourmet dishes, and locate nearby luxury restaurants.
          </p>

          {/* SEARCH BAR & NEAREST HOTEL BUTTON */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', maxWidth: '700px', margin: '0 auto' }}>
            <input
              type="text"
              placeholder="🔍 Search fine dining, cuisines, or cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                minWidth: '280px',
                padding: '16px 24px',
                borderRadius: '30px',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                background: 'rgba(15, 23, 42, 0.85)',
                color: '#FFF',
                fontSize: '15px',
                outline: 'none'
              }}
            />
            <button
              onClick={handleFindNearest}
              disabled={locating}
              style={{
                padding: '16px 26px',
                borderRadius: '30px',
                border: 'none',
                background: 'linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)',
                color: '#FFF',
                fontSize: '15px',
                fontWeight: '800',
                cursor: locating ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 20px rgba(56, 189, 248, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>📍</span>
              <span>{locating ? 'Locating...' : 'Find Nearest Hotels'}</span>
            </button>
          </div>

          {locationStatus && (
            <p style={{ color: '#4ADE80', fontSize: '13px', fontWeight: '600', marginTop: '16px', marginBotton: 0 }}>
              {locationStatus}
            </p>
          )}
        </div>

        {/* RESTAURANTS GRID */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#FFF' }}>
            ✨ Featured Platinum Restaurants
          </h2>
          <span style={{ color: '#F59E0B', fontSize: '14px', fontWeight: '700' }}>
            Showing {filteredHotels.length} Luxury Venues
          </span>
        </div>

        {loading ? (
          <p style={{ color: '#94A3B8' }}>Curating luxury restaurants...</p>
        ) : filteredHotels.length === 0 ? (
          <div style={{ padding: '30px', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', color: '#94A3B8' }}>
            No matching restaurants found for "{searchTerm}".
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
            {filteredHotels.map((hotel) => (
              <div
                key={hotel._id || hotel.id}
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
                    height: '200px',
                    background: `url(${hotel.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600'}) center/cover`,
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
                    ⭐ {hotel.rating || '4.8'}
                  </span>

                  {hotel.distance && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '15px',
                        left: '15px',
                        background: 'rgba(56, 189, 248, 0.9)',
                        color: '#0F172A',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontWeight: '800',
                        fontSize: '12px'
                      }}
                    >
                      📍 {hotel.distance} km away
                    </span>
                  )}
                </div>

                <div style={{ padding: '22px' }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: '20px', color: '#FFF' }}>{hotel.name}</h3>
                  <p style={{ margin: '0 0 10px', color: '#94A3B8', fontSize: '14px' }}>📍 {hotel.address || hotel.city}</p>
                  <p style={{ margin: '0 0 20px', color: '#CBD5E1', fontSize: '13px', fontWeight: '600' }}>
                    Cuisine: {hotel.cuisine || 'Multi-Cuisine Fine Dining'}
                  </p>

                  <button
                    onClick={() => navigate(`/book/${hotel._id || 'demo_hotel_1'}`)}
                    style={{
                      width: '100%',
                      padding: '14px',
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
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;