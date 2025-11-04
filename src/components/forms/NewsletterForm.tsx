/**
 * Newsletter Form Component
 * Example implementation with dynamic API
 */

import React, { useState } from 'react';
import { useNewsletter } from '@/hooks/useNewsletter';

interface NewsletterFormProps {
  source?: 'website' | 'footer' | 'modal' | 'api';
  className?: string;
}

export const NewsletterForm: React.FC<NewsletterFormProps> = ({ 
  source = 'footer',
  className = '' 
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const { subscribe, loading, error, success, reset } = useNewsletter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      return;
    }

    try {
      const response = await subscribe({
        email,
        name: name || undefined,
        subscription_type: 'all',
        source,
      });

      console.log('✅ Subscribed:', response);
      
      // Reset form on success
      if (response.success) {
        setEmail('');
        setName('');
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => reset(), 5000);
      }
    } catch (err) {
      console.error('❌ Subscription error:', err);
    }
  };

  return (
    <div className={`newsletter-form ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={loading}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            disabled={loading}
            className="form-control"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading || !email}
          className="btn btn-primary"
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>

      {/* Success Message */}
      {success && (
        <div className="alert alert-success mt-3">
          🎉 Thank you for subscribing! Check your email for confirmation.
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-error mt-3">
          ❌ {error}
        </div>
      )}
    </div>
  );
};
