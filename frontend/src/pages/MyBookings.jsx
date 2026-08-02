import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success || Array.isArray(res.data)) {
          setBookings(res.data.bookings || res.data);
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);


  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', color: '#F8FAFC', padding: '40px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '25px', color: '#FFF' }}>📖 VIP Reservation History</h2>

        {loading ? (
          <p style={{ color: '#94A3B8' }}>Fetching reservation pass...</p>
        ) : bookings.length === 0 ? (
          <div style={{ padding: '30px', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
            No active reservations found.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {bookings.map((booking, index) => (
              <div
                key={booking._id || index}
                style={{ background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(12px)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 15px 35px rgba(0,0,0,0.3)', borderLeft: '6px solid #22C55E' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ margin: 0, color: '#38BDF8', fontSize: '22px' }}>{booking.hotelName || 'ShadowDine Platinum Dining'}</h3>
                  <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ADE80', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '6px 14px', borderRadius: '20px', fontWeight: '800', fontSize: '13px' }}>
                    Confirmed VIP ✅
                  </span>
                </div>

                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '15px', borderRadius: '12px', marginBottom: '15px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', fontSize: '14px', color: '#94A3B8' }}>
                  <p style={{ margin: 0 }}>Name: <strong style={{ color: '#FFF' }}>{booking.customerName || 'Ragavan'}</strong></p>
                  <p style={{ margin: 0 }}>Phone: <strong style={{ color: '#FFF' }}>{booking.customerPhone || 'N/A'}</strong></p>
                  <p style={{ margin: 0 }}>Date & Time: <strong style={{ color: '#FFF' }}>{booking.date} | {booking.time}</strong></p>
                  <p style={{ margin: 0 }}>Guests & Tables: <strong style={{ color: '#FFF' }}>{booking.guests} Guests ({booking.tablesCount} Tables)</strong></p>
                </div>

                {booking.orderedItems && booking.orderedItems.length > 0 && (
                  <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '15px', borderRadius: '12px' }}>
                    <h4 style={{ margin: '0 0 10px', color: '#F59E0B' }}>🛒 Pre-Ordered Gourmet Dishes:</h4>
                    {booking.orderedItems.map((item, i) => (
                      <p key={i} style={{ margin: '4px 0', fontSize: '14px', color: '#CBD5E1' }}>
                        • {item.itemName} x {item.quantity} = <strong style={{ color: '#FFF' }}>₹{item.price * item.quantity}</strong> {item.isVeg ? '🟢' : '🔴'}
                      </p>
                    ))}
                    <strong style={{ color: '#F59E0B', display: 'block', marginTop: '10px', fontSize: '16px' }}>
                      Total Bill Paid: ₹{booking.totalAmount || 0}
                    </strong>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;