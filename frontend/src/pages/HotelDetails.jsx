import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import RestaurantMap from '../components/RestaurantMap';

export default function HotelDetails() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    API.get(`/restaurants`)
      .then((res) => {
        const found = res.data.find((item) => item._id === id);
        setRestaurant(found);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!restaurant) return <div style={{ padding: '30px', color: '#FFF' }}>Loading...</div>;

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>{restaurant.name}</h1>
      <p>📍 {restaurant.address}, {restaurant.city}</p>
      
      {/* GEOLOCATION & NEARBY MAP */}
      <RestaurantMap address={`${restaurant.address}, ${restaurant.city}`} restaurantName={restaurant.name} />

      <hr style={{ margin: '30px 0' }} />
      <h2>🍽️ Menu & Dishes</h2>

      {restaurant.dishes.length === 0 ? (
        <p>No dishes added yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
          {restaurant.dishes.map((dish, index) => (
            <div key={index} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: '#fafafa' }}>
              <h4>{dish.dishName}</h4>
              <p style={{ color: '#2ed573', fontWeight: 'bold' }}>₹{dish.price}</p>
              <small style={{ color: '#888' }}>{dish.category || 'Main Course'}</small>
            </div>
          ))}
        </div>
      )}

      <br />
      <Link to={`/book/${restaurant._id}`} state={{ restaurant }}>
        <button style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: '#0F172A', border: 'none', borderRadius: '30px', cursor: 'pointer', fontSize: '16px', fontWeight: '800' }}>
          Reserve Table Now ✨
        </button>
      </Link>
    </div>
  );
}