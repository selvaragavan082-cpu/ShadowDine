import { useState, useEffect } from 'react';
import { fetchRestaurants, addDishAPI } from '../../services/restaurantService';

export default function AddDish() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRest, setSelectedRest] = useState('');
  const [dishName, setDishName] = useState('');
  const [price, setPrice] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchRestaurants('', '').then((res) => setRestaurants(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDishAPI(selectedRest, { dishName, price: Number(price) });
      setMsg('✅ Dish Added Successfully by Admin!');
      setDishName('');
      setPrice('');
    } catch (err) {
      setMsg('❌ Failed to add dish');
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '500px' }}>
      <h2>Admin Panel - Add New Dish</h2>
      {msg && <p>{msg}</p>}
      <form onSubmit={handleSubmit}>
        <label>Select Hotel: </label>
        <select onChange={(e) => setSelectedRest(e.target.value)} required>
          <option value="">-- Choose Hotel --</option>
          {restaurants.map((r) => (
            <option key={r._id} value={r._id}>{r.name}</option>
          ))}
        </select><br/><br/>

        <input placeholder="Dish Name" value={dishName} onChange={(e) => setDishName(e.target.value)} required /><br/><br/>
        <input placeholder="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required /><br/><br/>

        <button type="submit" style={{ padding: '10px 20px', background: '#ffa502', color: '#fff', border: 'none' }}>
          Add Dish
        </button>
      </form>
    </div>
  );
}