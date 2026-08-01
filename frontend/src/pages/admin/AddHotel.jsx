import { useState } from 'react';
import API from '../../services/api';

export default function AddHotel() {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/restaurants', { name, city, address });
      setMsg('✅ Hotel Added Successfully!');
      setName(''); setCity(''); setAddress('');
    } catch (err) {
      setMsg('❌ Failed to add hotel');
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '500px' }}>
      <h2>Admin Panel - Add New Hotel</h2>
      {msg && <p>{msg}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Hotel Name" value={name} onChange={(e) => setName(e.target.value)} required /><br/><br/>
        <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required /><br/><br/>
        <input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required /><br/><br/>
        <button type="submit" style={{ padding: '10px 20px', background: '#ff6b6b', color: '#fff', border: 'none' }}>
          Add Hotel
        </button>
      </form>
    </div>
  );
}