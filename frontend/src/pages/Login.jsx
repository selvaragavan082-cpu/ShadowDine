import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();

  // State Management
  const [step, setStep] = useState(1); // Step 1: Send OTP | Step 2: Verify OTP
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 1. Send OTP Handler
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setMessage({ type: 'error', text: 'Please enter a valid 10-digit phone number.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await axios.post('http://localhost:5000/api/auth/send-otp', { phone });
      if (res.data.success) {
        setMessage({ type: 'success', text: 'OTP sent successfully! (Test OTP: 1234)' });
        setStep(2); // Move to OTP input screen
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to send OTP. Please check backend.'
      });
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP & Dynamic Role Redirection Handler
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
        phone,
        otp,
        name: name || 'Guest User'
      });

      if (res.data.success) {
        // Save Auth Token & User Object in LocalStorage
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        setMessage({ type: 'success', text: 'Login Successful! Redirecting...' });

        // 🔀 DYNAMIC ROLE BASED REDIRECTION
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
        maxWidth: '420px',
        margin: '60px auto',
        padding: '30px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '8px', color: '#111' }}>
        ShadowDine Login 🍽️
      </h2>
      <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '24px' }}>
        {step === 1 ? 'Enter your mobile number to receive OTP' : 'Enter the OTP sent to your phone'}
      </p>

      {/* Alert Notification Message */}
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

      {/* STEP 1: SEND OTP FORM */}
      {step === 1 && (
        <form onSubmit={handleSendOtp}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
              Full Name (Optional):
            </label>
            <input
              type="text"
              placeholder="e.g. Ragavan"
              value={name}
              onChange={(e) => setName(e.target.value)}
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

          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
              Phone Number (+91):
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
            {loading ? 'Sending OTP...' : 'Get OTP 📲'}
          </button>
        </form>
      )}

      {/* STEP 2: VERIFY OTP FORM */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
              Phone Number:
            </label>
            <input
              type="text"
              value={`+91 ${phone}`}
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
                border: '2px solid #007bff',
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
            {loading ? 'Verifying OTP...' : 'Verify OTP & Login 🎉'}
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
            Change Phone Number
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;