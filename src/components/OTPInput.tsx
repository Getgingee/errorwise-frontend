import React, { useRef, useState, KeyboardEvent, ChangeEvent } from 'react';

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  onResend?: () => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({ 
  length = 6, 
  onComplete,
  onResend 
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (isNaN(Number(value)) && value !== '') return;

    const newOtp = [...otp];
    // Take only the last character if multiple are entered
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    console.log('📝 OTP digit entered at index', index, ':', value);
    console.log('📋 Current OTP:', newOtp.join(''));

    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete when all filled
    const otpString = newOtp.join('');
    if (otpString.length === length && !otpString.includes('')) {
      console.log('✅ OTP Complete! Calling onComplete with:', otpString);
      onComplete(otpString);
    }
  };  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, length);
    
    if (!/^\d+$/.test(pastedData)) return; // Only allow numbers

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex(val => val === '');
    const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();

    // Check if complete
    if (newOtp.every(digit => digit !== '')) {
      onComplete(newOtp.join(''));
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-inputs">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={el => inputRefs.current[index] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="otp-input"
            autoFocus={index === 0}
            aria-label={`OTP digit ${index + 1} of ${length}`}
            style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#0f172a',
              backgroundColor: '#ffffff',
              textAlign: 'center'
            }}
          />
        ))}
      </div>
      
      {onResend && (
        <div className="otp-resend">
          <button type="button" onClick={onResend} className="resend-link">
            Resend OTP
          </button>
        </div>
      )}

      <style>{`
        .otp-container {
          width: 100%;
          margin: 20px 0;
        }

        .otp-inputs {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-bottom: 16px;
        }

        .otp-input {
          width: 50px !important;
          height: 60px !important;
          text-align: center !important;
          font-size: 32px !important;
          font-weight: 700 !important;
          font-family: 'Courier New', Courier, monospace !important;
          border: 2px solid rgba(255, 255, 255, 0.3) !important;
          border-radius: 12px !important;
          outline: none !important;
          transition: all 0.3s !important;
          background: #ffffff !important;
          color: #1e293b !important;
          caret-color: #3b82f6 !important;
          padding: 0 !important;
          line-height: 60px !important;
        }

        .otp-input:focus {
          border-color: #60a5fa !important;
          box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.3) !important;
          background: #ffffff !important;
          transform: scale(1.05) !important;
          color: #0f172a !important;
        }

        .otp-input:not(:placeholder-shown) {
          border-color: #3b82f6 !important;
          background: #ffffff !important;
          color: #0f172a !important;
        }

        .otp-resend {
          text-align: center;
          margin-top: 16px;
        }

        .resend-link {
          background: none;
          border: none;
          color: #4F46E5;
          font-size: 14px;
          cursor: pointer;
          text-decoration: underline;
          padding: 8px 16px;
        }

        .resend-link:hover {
          color: #3730A3;
        }
      `}</style>
    </div>
  );
};
