import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();

  // Form States
  const [step, setStep] = useState(1); // Step 1: User Info & OTP | Step 2: Verify OTP
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('customer'); // Default 'customer' or 'admin'
  const [otp, setOtp] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 1. Send OTP for Registration
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Please enter your full name.' });
      return;
    }
    if (!phone || phone.length < 10) {
      setMessage({ type: 'error', text: 'Please enter a valid 10-digit phone number.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await axios.post('http://localhost:5000/api/auth/send-otp', { phone });
      if (res.data.success) {
        setMessage({ type: 'success', text: 'OTP sent to your mobile! (Test OTP: 1234)' });
        setStep(2); // Move to OTP verification step
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to send OTP. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP & Complete Registration
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setMessage({ type: 'error', text: 'Please enter the OTP.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        name,
        phone,
        email: email || null,
        role,
        otp
      });

      if (res.data.success) {
        // LocalStorage-il Token and User Details-a save panroam
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        setMessage({ type: 'success', text: '🎉 Account Registered Successfully! Redirecting...' });

        // 🔀 Role-Based Navigation
        setTimeout(() => {
          if (res.data.user?.role === 'admin') {
            navigate('/admin-dashboard'); // Redirect to Admin Page
          } else {
            navigate('/'); // Redirect to Customer Home Page
          }
        }, 1200);
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Invalid or Expired OTP.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '450px',
        margin: '50px auto',
        padding: '30px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '8px', color: '#111' }}>
        Create ShadowDine Account 🍽️
      </h2>
      <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '24px' }}>
        {step === 1 ? 'Fill details to get started' : 'Verify your mobile number'}
      </p>

      {/* Alert Notification */}
      {message.text && (
        <div
          style={{
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            fontWeight: 'bold',
            textAlign: 'center',
            backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
          }}
        >
          {message.text}
        </div>
      )}

      {/* STEP 1: USER DETAILS FORM */}
      {step === 1 && (
        <form onSubmit={handleSendOtp}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
              Full Name: <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Ragavan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontSize: '15px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
              Phone Number (+91): <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="tel"
              placeholder="Enter 10-digit Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              maxLength={10}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontSize: '15px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
              Email Address (Optional):
            </label>
            <input
              type="email"
              placeholder="e.g. ragavan@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontSize: '15px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* ROLE SELECTOR */}
          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
              Register As:
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontSize: '15px',
                backgroundColor: '#fff',
                boxSizing: 'border-box',
                fontWeight: 'bold'
              }}
            >
              <option value="customer">Customer 👤 (Table Booking & Food Order)</option>
              <option value="admin">Restaurant Admin ⚙️ (Manage Menu & Bookings)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#007bff',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Sending OTP...' : 'Continue & Get OTP 📲'}
          </button>
        </form>
      )}

      {/* STEP 2: VERIFY OTP FORM */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
              Confirm Phone:
            </label>
            <input
              type="text"
              value={`+91 ${phone} (${role.toUpperCase()})`}
              disabled
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                backgroundColor: '#f8f9fa',
                fontSize: '15px',
                boxSizing: 'border-box',
                color: '#666'
              }}
            />
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
              Enter 4-Digit OTP:
            </label>
            <input
              type="text"
              placeholder="e.g. 1234"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #28a745',
                fontSize: '18px',
                letterSpacing: '4px',
                textAlign: 'center',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#28a745',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '12px'
            }}
          >
            {loading ? 'Creating Account...' : 'Complete Registration 🎉'}
          </button>

          <button
            type="button"
            onClick={() => setStep(1)}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'transparent',
              color: '#6c757d',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              textDecoration: 'underline'
            }}
          >
            Edit Registration Info
          </button>
        </form>
      )}

      {/* LOGIN LINK */}
      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#555' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#007bff', fontWeight: 'bold', textDecoration: 'none' }}>
          Login here
        </Link>
      </div>
    </div>
  );
};

export default Register;