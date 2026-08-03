import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import OtpInput from '../components/OtpInput';
import { API_BASE_URL } from '../services/api';

const Login = () => {
  const navigate = useNavigate();

  // State Management
  const [step, setStep] = useState(1); // 1: Request OTP | 2: Enter OTP
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 1. Send Real SMS OTP via Twilio Backend API
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!phone || phone.length < 10) {
      setMessage({ type: 'error', text: 'Please enter a valid 10-digit mobile number.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    try {
      const res = await axios.post(`${API_BASE_URL}/otp/send-otp`, { phoneNumber: formattedPhone, phone: formattedPhone });
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Real SMS OTP sent to your phone via Twilio!' });
        setStep(2);
      } else {
        throw new Error(res.data.message || 'Failed to send OTP via Twilio');
      }
    } catch (err) {
      console.error('Twilio Send OTP Error:', err);
      setMessage({
        type: 'error',
        text: err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to send verification code.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Resend Real SMS OTP Handler
  const handleResendOtp = async () => {
    setIsResending(true);
    setMessage({ type: '', text: '' });
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    try {
      const res = await axios.post(`${API_BASE_URL}/otp/send-otp`, { phoneNumber: formattedPhone, phone: formattedPhone });
      if (res.data.success) {
        setMessage({ type: 'success', text: 'A new Real SMS OTP has been sent via Twilio.' });
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.error || err.response?.data?.message || 'Failed to resend code.'
      });
    } finally {
      setIsResending(false);
    }
  };

  // 2. Verify OTP Handler via Twilio Backend API
  const handleVerifyOtp = async (otpCode) => {
    const codeToVerify = otpCode || otp;
    if (!codeToVerify || codeToVerify.length < 4) {
      setMessage({ type: 'error', text: 'Please enter all digits of the verification code.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    try {
      const verifyRes = await axios.post(`${API_BASE_URL}/otp/verify-otp`, {
        phoneNumber: formattedPhone,
        phone: formattedPhone,
        otp: codeToVerify
      });

      if (!verifyRes.data.success) {
        throw new Error(verifyRes.data.message || 'Invalid OTP Code');
      }

      // Session registration & token generation
      const authRes = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
        phone,
        otp: codeToVerify,
        name: name.trim() || 'VIP Guest'
      }).catch(() => null);

      const user = authRes?.data?.user || {
        phone,
        name: name.trim() || 'VIP Guest',
        role: 'user'
      };

      const token = authRes?.data?.token || 'shadowdine-vip-session-token';

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setMessage({ type: 'success', text: 'OTP Verified Successfully! Redirecting...' });

      setTimeout(() => {
        if (user?.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/');
        }
      }, 1000);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Invalid or expired verification code.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '36px',
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(16px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
          color: '#F8FAFC'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{ fontSize: '32px' }}>👑</span>
          <h2 style={{ margin: '8px 0 4px', fontSize: '24px', fontWeight: '900', color: '#FFF' }}>
            {step === 1 ? 'Sign In to ShadowDine' : 'Enter OTP Digits'}
          </h2>
          <p style={{ margin: 0, color: '#94A3B8', fontSize: '14px' }}>
            {step === 1
              ? 'Enter your phone number to receive a secure login code'
              : `Code sent to +91 ${phone}`}
          </p>
        </div>

        {/* Alert Notifications */}
        {message.text && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '24px',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'center',
              backgroundColor: message.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: message.type === 'success' ? '#4ADE80' : '#F87171',
              border: `1px solid ${message.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
            }}
          >
            {message.text}
          </div>
        )}

        {/* STEP 1: MOBILE NUMBER ENTRY */}
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Full Name (Optional):</label>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={labelStyle}>Mobile Number:</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span
                  style={{
                    padding: '14px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    color: '#94A3B8',
                    fontWeight: '700',
                    fontSize: '15px'
                  }}
                >
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="10-digit Mobile Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  maxLength={10}
                  style={inputStyle}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: '#0F172A',
                border: 'none',
                borderRadius: '14px',
                fontWeight: '800',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 20px rgba(245, 158, 11, 0.35)'
              }}
            >
              {loading ? 'Sending Verification Code...' : 'Get Verification Code ✨'}
            </button>

            <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#94A3B8' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#F59E0B', fontWeight: '700', textDecoration: 'none' }}>
                Register here
              </Link>
            </div>
          </form>
        )}

        {/* STEP 2: MINIMAL & FOCUSED OTP INPUT SCREEN */}
        {step === 2 && (
          <div>
            <OtpInput
              length={6}
              onChange={(val) => setOtp(val)}
              onComplete={(val) => handleVerifyOtp(val)}
              onResend={handleResendOtp}
              isResending={isResending}
            />

            <button
              type="button"
              onClick={() => handleVerifyOtp()}
              disabled={loading || otp.length < 6}
              style={{
                width: '100%',
                padding: '16px',
                marginTop: '24px',
                background: otp.length === 6 ? 'linear-gradient(135deg, #22C55E 0%, #15803D 100%)' : 'rgba(255, 255, 255, 0.1)',
                color: '#FFF',
                border: 'none',
                borderRadius: '14px',
                fontWeight: '800',
                fontSize: '16px',
                cursor: loading || otp.length < 6 ? 'not-allowed' : 'pointer',
                boxShadow: otp.length === 6 ? '0 4px 20px rgba(34, 197, 94, 0.35)' : 'none',
                transition: 'all 0.3s'
              }}
            >
              {loading ? 'Verifying Code...' : 'Verify Code & Sign In'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp('');
                setMessage({ type: '', text: '' });
              }}
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '12px',
                background: 'transparent',
                color: '#94A3B8',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              ← Change Mobile Number
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  background: 'rgba(15, 23, 42, 0.8)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '12px',
  color: '#FFF',
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box'
};

const labelStyle = {
  display: 'block',
  fontWeight: '700',
  marginBottom: '8px',
  fontSize: '13px',
  color: '#CBD5E1',
  letterSpacing: '0.5px'
};

export default Login;