import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../services/api';

const AdminDashboard = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success || Array.isArray(res.data)) {
          setAllBookings(res.data.bookings || res.data);
        }
      } catch (err) {
        console.error('Fetch Admin Bookings Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllBookings();
  }, []);


  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', color: '#F8FAFC', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(139, 92, 246, 0.3)', marginBottom: '30px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#A78BFA', fontWeight: '900' }}>⚙️ Executive Admin Management Console</h1>
          <p style={{ margin: '8px 0 0', color: '#94A3B8' }}>Monitor all active customer table reservations & pre-ordered gourmet dishes live.</p>
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '20px' }}>📋 Live Customer Reservations</h2>

        {loading ? (
          <p style={{ color: '#94A3B8' }}>Loading customer bookings...</p>
        ) : allBookings.length === 0 ? (
          <div style={{ padding: '30px', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '16px' }}>No bookings logged yet.</div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {allBookings.map((b, i) => (
              <div key={b._id || i} style={{ background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(12px)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, color: '#FFF' }}>Guest: {b.customerName} ({b.customerPhone})</h3>
                  <span style={{ color: '#4ADE80', fontWeight: 'bold' }}>Status: Confirmed</span>
                </div>
                <p style={{ color: '#94A3B8', margin: '4px 0', fontSize: '14px' }}>Date: {b.date} | Time: {b.time} | Guests: {b.guests}</p>
                {b.orderedItems && b.orderedItems.length > 0 && (
                  <p style={{ color: '#F59E0B', margin: '8px 0 0', fontSize: '14px', fontWeight: 'bold' }}>
                    Food Pre-Order: {b.orderedItems.map(item => `${item.itemName} (${item.quantity})`).join(', ')} | Total: ₹{b.totalAmount}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;