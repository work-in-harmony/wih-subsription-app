import React from 'react';

// Pricing Card Component
export const PricingCard = ({ plan, billingPeriod, onSubscribe, isProcessing }) => {
  const price = plan.price[billingPeriod];
  const yearlyPrice = plan.price.yearly;
  const monthlyEquivalent = Math.round(yearlyPrice / 12);

  return (
    <div
      className={`relative rounded-2xl p-8 transition-all ${plan.highlight
          ? 'bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] shadow-2xl scale-105'
          : 'bg-[#232323] hover:bg-[#2a2a2a]'}`}
    >
      {plan.highlight && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-[#6366f1] px-4 py-1 rounded-full text-sm font-bold">
          Most Popular
        </div>
      )}

      <div className="text-center mb-6">
        <h3
          className={`text-2xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-white'}`}
        >
          {plan.name}
        </h3>
        <div className="flex items-baseline justify-center gap-2">
          <span
            className={`text-5xl font-bold ${plan.highlight ? 'text-white' : 'text-white'}`}
          >
            ₹{price}
          </span>
          <span
            className={`text-lg ${plan.highlight ? 'text-white/80' : 'text-gray-400'}`}
          >
            /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
          </span>
        </div>
        {billingPeriod === 'yearly' && (
          <p
            className={`text-sm mt-2 ${plan.highlight ? 'text-white/70' : 'text-gray-500'}`}
          >
            ₹{monthlyEquivalent}/month billed annually
          </p>
        )}
      </div>

      <ul className="space-y-4 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <svg
              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-white' : 'text-[#6366f1]'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7" />
            </svg>
            <span
              className={`text-sm ${plan.highlight ? 'text-white/90' : 'text-gray-300'}`}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSubscribe(plan.name, price)}
        disabled={isProcessing}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${plan.highlight
            ? 'bg-white text-[#6366f1] hover:bg-gray-100'
            : 'bg-[#6366f1] text-white hover:bg-[#5558e3]'} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isProcessing ? 'Processing...' : 'Subscribe Now'}
      </button>
    </div>
  );
};
