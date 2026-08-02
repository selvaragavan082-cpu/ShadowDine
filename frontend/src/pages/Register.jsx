import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import OtpInput from '../components/OtpInput';
import { API_BASE_URL } from '../services/api';

const Register = () => {
  const navigate = useNavigate();

  // Form States
  const [step, setStep] = useState(1); // 1: User Details | 2: Enter OTP
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('customer');
  const [otp, setOtp] = useState('');

  const [loading, setLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 1. Send OTP for Registration
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Please enter your full name.' });
      return;
    }
    if (!phone || phone.length < 10) {
      setMessage({ type: 'error', text: 'Please enter a valid 10-digit mobile number.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/send-otp`, { phone });
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Verification code sent to your mobile number.' });
        setStep(2);
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to send verification code.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP Handler
  const handleResendOtp = async () => {
    setIsResending(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/send-otp`, { phone });
      if (res.data.success) {
        setMessage({ type: 'success', text: 'A new verification code has been sent.' });
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to resend code.'
      });
    } finally {
      setIsResending(false);
    }
  };

  // 2. Verify OTP & Complete Registration
  const handleVerifyOtp = async (otpCode) => {
    const codeToVerify = otpCode || otp;
    if (!codeToVerify || codeToVerify.length < 4) {
      setMessage({ type: 'error', text: 'Please enter all digits of the verification code.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
        name,
        phone,
        email: email || null,
        role,
        otp: codeToVerify
      });


      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        setMessage({ type: 'success', text: 'Account registered successfully. Redirecting...' });

        setTimeout(() => {
          if (res.data.user?.role === 'admin') {
            navigate('/admin-dashboard');
          } else {
            navigate('/');
          }
        }, 1000);
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Invalid or expired verification code.'
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
          maxWidth: '460px',
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
            {step === 1 ? 'Create ShadowDine Account' : 'Enter OTP Digits'}
          </h2>
          <p style={{ margin: 0, color: '#94A3B8', fontSize: '14px' }}>
            {step === 1
              ? 'Complete your profile to get started'
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

        {/* STEP 1: USER DETAILS FORM */}
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>
                Full Name <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>
                Mobile Number <span style={{ color: '#EF4444' }}>*</span>
              </label>
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

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Email Address (Optional):</label>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={labelStyle}>Account Role:</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  ...inputStyle,
                  cursor: 'pointer'
                }}
              >
                <option value="customer" style={{ color: '#000' }}>Customer (Dining & Pre-Orders)</option>
                <option value="admin" style={{ color: '#000' }}>Restaurant Admin (Console & Menu Management)</option>
              </select>
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
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#F59E0B', fontWeight: '700', textDecoration: 'none' }}>
                Sign In
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
              {loading ? 'Creating Account...' : 'Complete Registration'}
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
              ← Edit Account Details
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

export default Register;