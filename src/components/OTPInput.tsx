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

    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete when all filled
    const otpString = newOtp.join('');
    if (otpString.length === length && !otpString.includes('')) {
      onComplete(otpString);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
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
          width: 50px;
          height: 60px;
          text-align: center;
          font-size: 24px;
          font-weight: 600;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          outline: none;
          transition: all 0.3s;
          background: white;
          color: #333;
        }

        .otp-input:focus {
          border-color: #4F46E5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .otp-input:not(:placeholder-shown) {
          border-color: #4F46E5;
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
