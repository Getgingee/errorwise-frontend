import { Plan } from '../../services/subscription';
import { Check, Star, Loader2 } from 'lucide-react';

interface PlanCardProps {
  plan: Plan;
  isPopular?: boolean;
  isLoading?: boolean;
  onSelect: () => void;
}

export function PlanCard({ plan, isPopular, isLoading, onSelect }: PlanCardProps) {
  const isFree = plan.id === 'free';

  return (
    <div
      className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-blue-500/30 hover:shadow-blue-500/20 ${
        isPopular ? 'ring-2 ring-blue-600 scale-105' : ''
      }`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg flex items-center gap-1">
          <Star className="w-4 h-4 fill-current" />
          Most Popular
        </div>
      )}

      <div className="p-8">
        {/* Plan Name */}
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-bold text-gray-900">
              ${plan.price}
            </span>
            <span className="text-gray-600">/month</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onSelect}
          disabled={isLoading}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            isFree
              ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              : isPopular
              ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : isFree ? (
            'Get Started'
          ) : (
            'Subscribe Now'
          )}
        </button>

        {/* Features List */}
        <div className="mt-8 space-y-4">
          <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
            What's Included:
          </h4>
          <ul className="space-y-3">
            {/* Queries */}
            <FeatureItem
              text={
                plan.limits.daily_queries === -1
                  ? 'Unlimited queries'
                  : `${plan.limits.daily_queries} queries/day`
              }
            />

            {/* Explanation Type */}
            <FeatureItem text={`${plan.limits.explanation_type} AI explanations`} />

            {/* Solutions */}
            {plan.limits.solutions_provided && (
              <FeatureItem text="Fix suggestions & code examples" />
            )}

            {/* Team Features */}
            {plan.limits.team_features && (
              <>
                <FeatureItem text="Team collaboration" />
                <FeatureItem text="Shared error history" />
                {plan.limits.max_team_members && (
                  <FeatureItem text={`Up to ${plan.limits.max_team_members} team members`} />
                )}
              </>
            )}

            {/* Video Chat */}
            {plan.limits.video_chat && (
              <FeatureItem 
                text={`Video support sessions${plan.limits.video_session_duration ? ` (${plan.limits.video_session_duration} min)` : ''}`} 
              />
            )}

            {/* String features from the features array */}
            {plan.features.map((feature, index) => (
              <FeatureItem key={index} text={feature} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
      <span className="text-gray-700 text-sm">{text}</span>
    </li>
  );
}
