import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';

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

  if (!restaurant) return <div style={{ padding: '30px' }}>Loading...</div>;

  return (
    <div style={{ padding: '30px' }}>
      <h1>{restaurant.name}</h1>
      <p>📍 {restaurant.address}, {restaurant.city}</p>
      
      <hr style={{ margin: '20px 0' }} />
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
        <button style={{ padding: '10px 20px', background: '#ff6b6b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>
          Reserve Table Now
        </button>
      </Link>
    </div>
  );
}