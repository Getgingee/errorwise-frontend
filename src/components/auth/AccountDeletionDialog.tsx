import React, { useState } from 'react';
import { useAuthEdgeCases } from '../../hooks/useAuthEdgeCases';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../UI/dialog';
import { Button } from '../UI/button';
import { Input } from '../UI/input';
import { Label } from '../UI/label';
import { Alert, AlertDescription } from '../UI/alert';
import { Loader2, AlertTriangle, Trash2 } from 'lucide-react';

interface AccountDeletionDialogProps {
  trigger?: React.ReactNode;
  onDeleted?: () => void;
}

export const AccountDeletionDialog: React.FC<AccountDeletionDialogProps> = ({
  trigger,
  onDeleted,
}) => {
  const { loading, error, deleteAccount } = useAuthEdgeCases();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showFinalStep, setShowFinalStep] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteAccount(password);
      onDeleted?.();
    } catch (err) {
      console.error('Account deletion failed:', err);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setPassword('');
    setConfirmation('');
    setShowFinalStep(false);
  };

  const isConfirmationValid = confirmation === 'DELETE MY ACCOUNT';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant=\"destructive\">
            <Trash2 className=\"w-4 h-4 mr-2\" />
            Delete Account
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className=\"text-red-600\">Delete Account</DialogTitle>
          <DialogDescription>
            This action cannot be easily undone. Your account will be scheduled for permanent deletion.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant=\"destructive\">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Alert variant=\"destructive\" className=\"bg-red-50 border-red-200\">
          <AlertTriangle className=\"w-4 h-4 text-red-600\" />
          <AlertDescription className=\"text-red-800\">
            <strong>Warning:</strong> Account deletion will:
            <ul className=\"list-disc ml-5 mt-2 space-y-1\">
              <li>Cancel your subscription immediately</li>
              <li>Disable account access</li>
              <li>Schedule permanent data deletion in 30 days</li>
              <li>Require restoration within 30 days to recover</li>
            </ul>
          </AlertDescription>
        </Alert>

        {!showFinalStep ? (
          <div className=\"space-y-4\">
            <div>
              <Label htmlFor=\"confirmation-text\">
                Type <strong>DELETE MY ACCOUNT</strong> to confirm
              </Label>
              <Input
                id=\"confirmation-text\"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                placeholder=\"DELETE MY ACCOUNT\"
                className=\"font-mono\"
              />
            </div>

            <DialogFooter>
              <Button variant=\"outline\" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant=\"destructive\"
                onClick={() => setShowFinalStep(true)}
                disabled={!isConfirmationValid}
              >
                Continue
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className=\"space-y-4\">
            <div>
              <Label htmlFor=\"password\">Confirm Your Password</Label>
              <Input
                id=\"password\"
                type=\"password\"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=\"Enter your password\"
              />
            </div>

            <DialogFooter>
              <Button variant=\"outline\" onClick={() => setShowFinalStep(false)}>
                Back
              </Button>
              <Button
                variant=\"destructive\"
                onClick={handleDelete}
                disabled={loading || !password}
              >
                {loading ? (
                  <>
                    <Loader2 className=\"w-4 h-4 mr-2 animate-spin\" />
                    Deleting...
                  </>
                ) : (
                  'Delete My Account'
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
