import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { CreditCard, CheckCircle, XCircle } from 'lucide-react';

const MockPaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<'success' | 'cancelled' | null>(null);

  const sessionId = searchParams.get('sessionId');
  const planId = searchParams.get('planId');

  useEffect(() => {
    if (!sessionId || !planId) {
      navigate('/subscription');
    }
  }, [sessionId, planId, navigate]);

  const handlePayment = async (success: boolean) => {
    setProcessing(true);

    try {
      if (success) {
        // Simulate successful payment - update subscription
        const response = await fetch('http://localhost:3001/api/subscriptions', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            plan: planId,
            status: 'active',
            end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
          })
        });

        if (response.ok) {
          setResult('success');
          setTimeout(() => {
            navigate('/subscription?payment=success');
          }, 2000);
        } else {
          throw new Error('Failed to update subscription');
        }
      } else {
        setResult('cancelled');
        setTimeout(() => {
          navigate('/subscription?payment=cancelled');
        }, 2000);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setResult('cancelled');
      setTimeout(() => {
        navigate('/subscription?payment=error');
      }, 2000);
    } finally {
      setProcessing(false);
    }
  };

  if (result === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Your subscription has been activated.</p>
          <p className="text-sm text-gray-500">Redirecting to subscription page...</p>
        </div>
      </div>
    );
  }

  if (result === 'cancelled') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h2>
          <p className="text-gray-600 mb-4">Your payment was cancelled.</p>
          <p className="text-sm text-gray-500">Redirecting to subscription page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-6">
          <CreditCard className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Mock Payment Gateway</h2>
          <p className="text-gray-600 text-sm mb-4">
            This is a development environment. No real payment will be processed.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Plan:</strong> {planId?.toUpperCase()}
            </p>
            <p className="text-sm text-blue-800">
              <strong>Session:</strong> {sessionId?.slice(0, 20)}...
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handlePayment(true)}
            disabled={processing}
            className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {processing ? 'Processing...' : 'Simulate Successful Payment'}
          </button>

          <button
            onClick={() => handlePayment(false)}
            disabled={processing}
            className="w-full py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {processing ? 'Processing...' : 'Simulate Failed Payment'}
          </button>

          <button
            onClick={() => navigate('/subscription')}
            disabled={processing}
            className="w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Cancel
          </button>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800 text-center">
            ⚠️ <strong>Development Mode:</strong> Configure DODO_API_KEY in .env for production payment processing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MockPaymentPage;
