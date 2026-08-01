import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookTable = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();

  const todayDate = new Date().toISOString().split('T')[0];
  const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = savedUser.role === 'admin';

  const [hotel, setHotel] = useState(null);
  
  // Form State
  const [customerName, setCustomerName] = useState(savedUser.name || 'Ragavan');
  const [customerPhone, setCustomerPhone] = useState(savedUser.phone || '9342079507');
  const [tablesCount, setTablesCount] = useState(1);
  const [totalGuests, setTotalGuests] = useState(2);
  const [eventType, setEventType] = useState('Casual Dining');
  const [date, setDate] = useState(todayDate);
  const [timeSlot, setTimeSlot] = useState('07:30 PM (Dinner)');
  const [specialRequest, setSpecialRequest] = useState('');

  // Diet & AI State
  const [dietFilter, setDietFilter] = useState('all'); 
  const [aiRecommendation, setAiRecommendation] = useState('');

  // Cart State
  const [cart, setCart] = useState([]);

  // Admin State
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishPrice, setNewDishPrice] = useState('');
  const [newDishCategory, setNewDishCategory] = useState('');
  const [newDishIsVeg, setNewDishIsVeg] = useState(true);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchHotelDetails = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/hotels/${hotelId}`);
      if (res.data.success || res.data) {
        setHotel(res.data.hotel || res.data);
      }
    } catch (err) {
      console.error('Fetch Hotel Error:', err);
    }
  }, [hotelId]);

  useEffect(() => {
    fetchHotelDetails();
  }, [fetchHotelDetails]);

  const handleAddToCart = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.itemName === item.itemName);
      if (existing) {
        return prevCart.map((i) =>
          i.itemName === item.itemName ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1, isVeg: item.isVeg, price: item.price }];
    });
  };

  const handleRemoveFromCart = (itemName) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.itemName === itemName);
      if (!existing) return prevCart;
      if (existing.quantity === 1) {
        return prevCart.filter((i) => i.itemName !== itemName);
      }
      return prevCart.map((i) =>
        i.itemName === itemName ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  };

  const calculateTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleAiSuggest = () => {
    if (!hotel || !hotel.menu) return;

    if (dietFilter === 'veg') {
      const vegItems = hotel.menu.filter(i => i.isVeg).map(i => `${i.itemName} (₹${i.price})`);
      setAiRecommendation(`🤖 Platinum AI Veg Sommelier: ${vegItems.join(', ')}`);
    } else if (dietFilter === 'nonveg') {
      const nonVegItems = hotel.menu.filter(i => !i.isVeg).map(i => `${i.itemName} (₹${i.price})`);
      setAiRecommendation(`🤖 Platinum AI Masterchef Selection: ${nonVegItems.join(', ')}`);
    } else {
      setAiRecommendation(`🤖 Executive AI Recommendation: Try Chef's Signature Truffle Pasta & Special Biryani!`);
    }
  };

  const handleAddDish = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/api/hotels/${hotelId}/menu`, {
        itemName: newDishName,
        price: newDishPrice,
        category: newDishCategory || 'Chef Special',
        isVeg: newDishIsVeg
      });

      if (res.data.success) {
        alert('✨ Executive Dish Added To Platinum Menu!');
        setNewDishName('');
        setNewDishPrice('');
        setNewDishCategory('');
        setShowAdminForm(false);
        fetchHotelDetails();
      }
    } catch (err) {
      alert('Failed to add dish.');
    }
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/bookings', {
        hotelId,
        hotelName: hotel?.name || 'ShadowDine VIP Restaurant',
        customerName,
        customerPhone,
        tablesCount: Number(tablesCount),
        guests: Number(totalGuests),
        eventType,
        date,
        time: timeSlot,
        specialRequest,
        orderedItems: cart,
        totalAmount: calculateTotalAmount()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success || res.data) {
        setMessage('🎉 Platinum VIP Reservation Confirmed Successfully!');
        setTimeout(() => navigate('/my-bookings'), 1500);
      }
    } catch (err) {
      setMessage('❌ Reservation Failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const displayedMenu = hotel?.menu?.filter((item) => {
    if (dietFilter === 'veg') return item.isVeg;
    if (dietFilter === 'nonveg') return !item.isVeg;
    return true;
  }) || [];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0F172A',
        color: '#F8FAFC',
        padding: '40px 20px',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* HOTEL BANNER HEADER */}
        {hotel && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
              backdropFilter: 'blur(12px)',
              padding: '30px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              marginBottom: '30px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px'
            }}
          >
            <div>
              <span style={{ fontSize: '12px', letterSpacing: '2px', color: '#F59E0B', fontWeight: '800', textTransform: 'uppercase' }}>
                ⭐ Platinum Certified Fine Dining
              </span>
              <h1 style={{ margin: '8px 0', fontSize: '32px', fontWeight: '900', color: '#FFF' }}>{hotel.name}</h1>
              <p style={{ margin: 0, color: '#94A3B8', fontSize: '15px' }}>📍 {hotel.address} | Rating: {hotel.rating}</p>
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowAdminForm(!showAdminForm)}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)'
                }}
              >
                {showAdminForm ? 'Close Admin' : '⚙️ Admin: Add Dish'}
              </button>
            )}
          </div>
        )}

        {/* ⚙️ ADMIN VIP PANEL */}
        {isAdmin && showAdminForm && (
          <div
            style={{
              background: 'rgba(139, 92, 246, 0.08)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '20px',
              padding: '25px',
              marginBottom: '30px'
            }}
          >
            <h3 style={{ margin: '0 0 20px', color: '#A78BFA' }}>⚙️ Admin Portal: Add Executive Dish</h3>
            <form onSubmit={handleAddDish} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <input type="text" placeholder="Dish Name" value={newDishName} onChange={(e) => setNewDishName(e.target.value)} required style={inputStyle} />
              <input type="number" placeholder="Price (₹)" value={newDishPrice} onChange={(e) => setNewDishPrice(e.target.value)} required style={inputStyle} />
              <input type="text" placeholder="Custom Category Name" value={newDishCategory} onChange={(e) => setNewDishCategory(e.target.value)} required style={inputStyle} />
              
              <select value={newDishIsVeg ? 'veg' : 'nonveg'} onChange={(e) => setNewDishIsVeg(e.target.value === 'veg')} style={inputStyle}>
                <option value="veg" style={{ color: '#000' }}>Pure Veg 🟢</option>
                <option value="nonveg" style={{ color: '#000' }}>Non-Veg 🔴</option>
              </select>

              <button type="submit" style={{ gridColumn: 'span 2', padding: '14px', background: '#8B5CF6', color: '#FFF', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}>
                + Publish Dish to Live Menu
              </button>
            </form>
          </div>
        )}

        {/* 🍽️ MENU & AI EXPERIENCE SECTION */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.6)',
            backdropFilter: 'blur(12px)',
            padding: '30px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            marginBottom: '30px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800' }}>🍽️ Chef's Curated Menu</h2>
            
            {/* DIET TOGGLES */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setDietFilter('all')} style={filterBtnStyle(dietFilter === 'all', '#38BDF8')}>All Items</button>
              <button onClick={() => setDietFilter('veg')} style={filterBtnStyle(dietFilter === 'veg', '#22C55E')}>Pure Veg 🟢</button>
              <button onClick={() => setDietFilter('nonveg')} style={filterBtnStyle(dietFilter === 'nonveg', '#EF4444')}>Non-Veg 🔴</button>
            </div>
          </div>

          {/* AI BUTTON */}
          <button
            onClick={handleAiSuggest}
            style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(56, 189, 248, 0.05) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: '#38BDF8',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: '700',
              marginBottom: '20px'
            }}
          >
            ✨ Consult Platinum AI Sommelier
          </button>

          {aiRecommendation && (
            <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#4ADE80', padding: '14px', borderRadius: '12px', fontWeight: '700', marginBottom: '20px' }}>
              {aiRecommendation}
            </div>
          )}

          {/* DISH CARDS GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '20px' }}>
            {displayedMenu.map((item, index) => {
              const cartItem = cart.find(c => c.itemName === item.itemName);
              return (
                <div
                  key={index}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: item.isVeg ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                    padding: '20px',
                    borderRadius: '16px',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
                  }}
                >
                  <span style={{ fontSize: '11px', fontWeight: '800', color: item.isVeg ? '#22C55E' : '#EF4444', float: 'right' }}>
                    {item.isVeg ? '🟢 VEG' : '🔴 NON-VEG'}
                  </span>
                  <h4 style={{ margin: '0 0 6px', fontSize: '18px', color: '#FFF' }}>{item.itemName}</h4>
                  <p style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '800', color: '#F59E0B' }}>₹{item.price}</p>
                  <small style={{ color: '#64748B', display: 'block', marginBottom: '16px' }}>Category: {item.category || 'Special'}</small>

                  {cartItem ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '10px' }}>
                      <button onClick={() => handleRemoveFromCart(item.itemName)} style={qtyBtnStyle('#EF4444')}>-</button>
                      <span style={{ fontWeight: '800', fontSize: '16px' }}>{cartItem.quantity}</span>
                      <button onClick={() => handleAddToCart(item)} style={qtyBtnStyle('#22C55E')}>+</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(item)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      + Add Dish
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 🛒 FLOATING VIP CART SUMMARY */}
        {cart.length > 0 && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.05) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              padding: '20px',
              borderRadius: '16px',
              marginBottom: '30px'
            }}
          >
            <h4 style={{ margin: '0 0 10px', color: '#F59E0B', fontSize: '16px' }}>🛒 Pre-Ordered VIP Menu Summary</h4>
            {cart.map((c, i) => (
              <p key={i} style={{ margin: '6px 0', fontSize: '14px', color: '#CBD5E1' }}>
                • {c.itemName} x {c.quantity} = <strong style={{ color: '#FFF' }}>₹{c.price * c.quantity}</strong>
              </p>
            ))}
            <h3 style={{ margin: '14px 0 0', color: '#F59E0B', borderTop: '1px solid rgba(245, 158, 11, 0.2)', paddingTop: '10px' }}>
              Total Pre-Order Amount: ₹{calculateTotalAmount()}
            </h3>
          </div>
        )}

        {/* 📝 PLATINUM RESERVATION FORM */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.6)',
            backdropFilter: 'blur(12px)',
            padding: '30px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <h2 style={{ marginBottom: '24px', fontSize: '22px', fontWeight: '800' }}>📝 Platinum Table Reservation</h2>
          
          {message && <p style={{ fontWeight: '700', color: '#22C55E', marginBottom: '20px' }}>{message}</p>}

          <form onSubmit={handleConfirmBooking} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Guest Name:</label>
              <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Contact Number:</label>
              <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Number of Guests:</label>
              <input type="number" min="1" value={totalGuests} onChange={(e) => setTotalGuests(e.target.value)} required style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Tables Reserved:</label>
              <input type="number" min="1" value={tablesCount} onChange={(e) => setTablesCount(e.target.value)} required style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Reservation Date:</label>
              <input type="date" min={todayDate} value={date} onChange={(e) => setDate(e.target.value)} required style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Preferred Time Slot:</label>
              <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} style={inputStyle}>
                <option value="12:30 PM (Lunch)" style={{ color: '#000' }}>12:30 PM (Lunch)</option>
                <option value="07:30 PM (Dinner)" style={{ color: '#000' }}>07:30 PM (Dinner)</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Event Type:</label>
              <select value={eventType} onChange={(e) => setEventType(e.target.value)} style={inputStyle}>
                <option value="Casual Dining" style={{ color: '#000' }}>Casual Dining</option>
                <option value="Birthday Party" style={{ color: '#000' }}>Birthday Party</option>
                <option value="Anniversary" style={{ color: '#000' }}>Anniversary</option>
                <option value="Business Lunch" style={{ color: '#000' }}>Business Lunch</option>
              </select>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Special Requests:</label>
              <input type="text" placeholder="e.g. Window seat, Candlelight setup" value={specialRequest} onChange={(e) => setSpecialRequest(e.target.value)} style={inputStyle} />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                gridColumn: 'span 2',
                padding: '16px',
                background: 'linear-gradient(135deg, #22C55E 0%, #15803D 100%)',
                color: '#FFF',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '800',
                fontSize: '18px',
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(34, 197, 94, 0.4)'
              }}
            >
              {loading ? 'Securing VIP Table...' : `Confirm VIP Reservation & Pay ₹${calculateTotalAmount()} ✨`}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

// Custom Styles
const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  background: 'rgba(15, 23, 42, 0.8)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '10px',
  color: '#FFF',
  fontSize: '15px',
  boxSizing: 'border-box'
};

const labelStyle = {
  display: 'block',
  fontWeight: '700',
  marginBottom: '8px',
  fontSize: '13px',
  color: '#94A3B8',
  letterSpacing: '0.5px'
};

const filterBtnStyle = (active, color) => ({
  padding: '8px 18px',
  borderRadius: '20px',
  border: `1px solid ${color}`,
  background: active ? color : 'transparent',
  color: active ? '#FFF' : color,
  fontWeight: '700',
  cursor: 'pointer'
});

const qtyBtnStyle = (color) => ({
  padding: '4px 12px',
  background: color,
  color: '#FFF',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '800'
});

export default BookTable;