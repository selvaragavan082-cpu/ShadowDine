import React, { useState, useEffect, useRef } from 'react';

const OtpInput = ({ length = 4, onComplete, onChange, onResend, isResending }) => {
  const [digits, setDigits] = useState(Array(length).fill(''));
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);

  // Auto focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Countdown timer logic
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    // Only numeric digits
    if (value && !/^\d+$/.test(value)) return;

    const newDigits = [...digits];

    // Handle pasting multiple digits
    if (value.length > 1) {
      const pasted = value.slice(0, length).split('');
      pasted.forEach((char, i) => {
        if (i < length) newDigits[i] = char;
      });
      setDigits(newDigits);
      const combined = newDigits.join('');
      if (onChange) onChange(combined);
      if (combined.length === length && onComplete) onComplete(combined);
      const focusIndex = Math.min(pasted.length, length - 1);
      if (inputRefs.current[focusIndex]) inputRefs.current[focusIndex].focus();
      return;
    }

    newDigits[index] = value;
    setDigits(newDigits);
    const combined = newDigits.join('');
    if (onChange) onChange(combined);

    // Auto-advance to next input box
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }

    if (combined.length === length && onComplete) {
      onComplete(combined);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleResend = () => {
    if (timer > 0 || isResending) return;
    setDigits(Array(length).fill(''));
    setTimer(60);
    if (onResend) onResend();
    if (inputRefs.current[0]) inputRefs.current[0].focus();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
      {/* Digits Input Boxes */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', margin: '10px 0' }}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={length}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            style={{
              width: '56px',
              height: '62px',
              textAlign: 'center',
              fontSize: '24px',
              fontWeight: '800',
              borderRadius: '12px',
              border: digit ? '2px solid #F59E0B' : '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(15, 23, 42, 0.85)',
              color: '#FFF',
              outline: 'none',
              boxShadow: digit ? '0 0 15px rgba(245, 158, 11, 0.3)' : 'none',
              transition: 'all 0.2s'
            }}
          />
        ))}
      </div>

      {/* Countdown Timer & Resend Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', fontSize: '14px' }}>
        <span style={{ color: timer > 0 ? '#94A3B8' : '#EF4444', fontWeight: '600' }}>
          {timer > 0 ? `Code expires in ${formatTime(timer)}` : 'Code expired'}
        </span>

        <button
          type="button"
          onClick={handleResend}
          disabled={timer > 0 || isResending}
          style={{
            background: 'none',
            border: 'none',
            color: timer > 0 ? '#64748B' : '#F59E0B',
            fontWeight: '700',
            cursor: timer > 0 ? 'not-allowed' : 'pointer',
            textDecoration: timer > 0 ? 'none' : 'underline',
            fontSize: '14px'
          }}
        >
          {isResending ? 'Sending...' : 'Resend OTP'}
        </button>
      </div>

      {/* Security Warning */}
      <div
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: '10px',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          color: '#F59E0B',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxSizing: 'border-box'
        }}
      >
        <span>🔒</span>
        <span>Security Note: Never share your OTP or verification code with anyone.</span>
      </div>
    </div>
  );
};

export default OtpInput;
