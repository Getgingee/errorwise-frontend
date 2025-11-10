import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthEdgeCases } from '../../hooks/useAuthEdgeCases';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/UI/card';
import { Button } from '../../components/UI/button';
import { Alert, AlertDescription } from '../../components/UI/alert';
import { Loader2, CheckCircle, XCircle, Mail } from 'lucide-react';

export const VerifyEmailChange: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loading, error, verifyEmailChange } = useAuthEdgeCases();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      return;
    }

    const verify = async () => {
      try {
        await verifyEmailChange(token);
        setStatus('success');
        setTimeout(() => {
          navigate('/settings/profile');
        }, 3000);
      } catch (err) {
        console.error('Email verification failed:', err);
        setStatus('error');
      }
    };

    verify();
  }, [searchParams, verifyEmailChange, navigate]);

  return (
    <div className=\"flex items-center justify-center min-h-screen bg-gray-50 p-4\">
      <Card className=\"max-w-md w-full\">
        <CardHeader>
          <div className=\"flex items-center justify-center mb-4\">
            {status === 'verifying' && (
              <Loader2 className=\"w-12 h-12 text-blue-500 animate-spin\" />
            )}
            {status === 'success' && (
              <CheckCircle className=\"w-12 h-12 text-green-500\" />
            )}
            {status === 'error' && (
              <XCircle className=\"w-12 h-12 text-red-500\" />
            )}
          </div>
          <CardTitle className=\"text-center\">
            {status === 'verifying' && 'Verifying Email Change'}
            {status === 'success' && 'Email Changed Successfully!'}
            {status === 'error' && 'Verification Failed'}
          </CardTitle>
          <CardDescription className=\"text-center\">
            {status === 'verifying' && 'Please wait while we verify your email change...'}
            {status === 'success' && 'Your email has been updated successfully.'}
            {status === 'error' && 'We could not verify your email change.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && status === 'error' && (
            <Alert variant=\"destructive\" className=\"mb-4\">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {status === 'success' && (
            <Alert className=\"bg-green-50 border-green-200\">
              <Mail className=\"w-4 h-4 text-green-600\" />
              <AlertDescription className=\"text-green-800\">
                Redirecting you to your profile settings...
              </AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <div className=\"space-y-3\">
              <p className=\"text-sm text-gray-600\">Possible reasons:</p>
              <ul className=\"list-disc ml-5 text-sm text-gray-600 space-y-1\">
                <li>Verification link expired (24 hour limit)</li>
                <li>Invalid or tampered token</li>
                <li>Email change already completed or cancelled</li>
              </ul>
              <Button onClick={() => navigate('/settings/profile')} className=\"w-full mt-4\">
                Go to Settings
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
