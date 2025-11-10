import React, { useState, useEffect } from 'react';
import { useSubscriptionEdgeCases } from '../../hooks/useSubscriptionEdgeCases';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../UI/card';
import { Button } from '../UI/button';
import { Alert, AlertDescription } from '../UI/alert';
import { Loader2, DollarSign, Calendar } from 'lucide-react';

interface ProrationPreviewProps {
  currentTier: string;
  onUpgrade?: () => void;
}

export const ProrationPreview: React.FC<ProrationPreviewProps> = ({ currentTier, onUpgrade }) => {
  const { loading, error, getProration } = useSubscriptionEdgeCases();
  const [preview, setPreview] = useState<any>(null);
  const [selectedTier, setSelectedTier] = useState<string>('pro');

  useEffect(() => {
    loadPreview();
  }, [selectedTier]);

  const loadPreview = async () => {
    const data = await getProration(selectedTier);
    if (data) setPreview(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upgrade Preview</CardTitle>
        <CardDescription>See the cost before upgrading</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant=\"destructive\" className=\"mb-4\">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className=\"space-y-4\">
          <div>
            <label className=\"block text-sm font-medium mb-2\">Select New Tier</label>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className=\"w-full p-2 border rounded\"
              disabled={loading}
            >
              <option value=\"pro\">Pro (`.99/month)</option>
              <option value=\"team\">Team (`.99/month)</option>
            </select>
          </div>

          {loading && (
            <div className=\"flex items-center justify-center py-8\">
              <Loader2 className=\"w-6 h-6 animate-spin\" />
            </div>
          )}

          {preview && !loading && (
            <div className=\"bg-gray-50 p-4 rounded-lg space-y-3\">
              <div className=\"flex justify-between items-center\">
                <span className=\"text-sm text-gray-600\">Current Tier:</span>
                <span className=\"font-semibold\">{preview.currentTier}</span>
              </div>
              <div className=\"flex justify-between items-center\">
                <span className=\"text-sm text-gray-600\">New Tier:</span>
                <span className=\"font-semibold\">{preview.newTier}</span>
              </div>
              <div className=\"flex justify-between items-center\">
                <span className=\"text-sm text-gray-600 flex items-center gap-1\">
                  <Calendar className=\"w-4 h-4\" />
                  Days Remaining:
                </span>
                <span className=\"font-semibold\">{preview.daysRemaining} days</span>
              </div>
              <div className=\"border-t pt-3 flex justify-between items-center\">
                <span className=\"text-sm text-gray-600 flex items-center gap-1\">
                  <DollarSign className=\"w-4 h-4\" />
                  Prorated Amount:
                </span>
                <span className=\"text-lg font-bold text-green-600\">
                  `$`{preview.prorationAmount.toFixed(2)}
                </span>
              </div>
              <p className=\"text-xs text-gray-500\">
                Next billing date: {new Date(preview.nextBillingDate).toLocaleDateString()}
              </p>
            </div>
          )}

          {preview && !loading && (
            <Button onClick={onUpgrade} className=\"w-full\" size=\"lg\">
              Upgrade to {preview.newTier} for `$`{preview.prorationAmount.toFixed(2)}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
