import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthEdgeCases } from '../../hooks/useAuthEdgeCases';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from \'../../components/ui/card';
import { Button } from \'../../components/ui/button';
import { Input } from \'../../components/ui/input';
import { Label } from \'../../components/ui/label';
import { Alert, AlertDescription } from \'../../components/ui/alert';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';

export const RestoreAccount: React.FC = () => {
  const navigate = useNavigate();
  const { loading, error, restoreAccount } = useAuthEdgeCases();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await restoreAccount(email, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      console.error('Account restoration failed:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <RefreshCw className="w-12 h-12 text-blue-500" />
          </div>
          <CardTitle className="text-center">Restore Your Account</CardTitle>
          <CardDescription className="text-center">
            Welcome back! You can restore your account within 30 days of deletion.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success ? (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                Account restored successfully! Redirecting to dashboard...
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleRestore} className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription className="text-blue-800 text-sm">
                  Your account and all data will be fully restored. Your previous subscription
                  status will be reinstated.
                </AlertDescription>
              </Alert>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Restoring...
                  </>
                ) : (
                  'Restore My Account'
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Can't restore? Contact support at support@errorwise.com
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
