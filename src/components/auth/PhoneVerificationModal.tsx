import React, { useState } from 'react';
import { sendPhoneOTP, verifyPhoneOTP } from '../../services/auth';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PhoneVerificationModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSendOTP = async () => {
    setError('');
    setLoading(true);

    try {
      await sendPhoneOTP(phoneNumber);
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError('');
    setLoading(true);

    try {
      await verifyPhoneOTP(otp);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Verify Phone Number</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm">
            {error}
          </div>
        )}

        {step === 'phone' && (
          <div>
            <p className="text-gray-600 mb-4">
              Enter your phone number to receive a verification code
            </p>
            <input
              type="tel"
              placeholder="+1234567890"
              className="w-full px-4 py-2 border rounded-lg mb-4"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSendOTP}
                disabled={loading || !phoneNumber}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
              >
                {loading ? 'Sending...' : 'Send Code'}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {step === 'otp' && (
          <div>
            <p className="text-gray-600 mb-4">
              Enter the 6-digit code sent to {phoneNumber}
            </p>
            <input
              type="text"
              placeholder="123456"
              maxLength={6}
              className="w-full px-4 py-2 border rounded-lg mb-4 text-center text-2xl tracking-widest"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            />
            <div className="flex gap-2">
              <button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
              <button
                onClick={() => setStep('phone')}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
            </div>
            <button
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full mt-2 text-sm text-blue-500 hover:underline"
            >
              Resend Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


