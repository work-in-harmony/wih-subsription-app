import React from "react";

// Main App Component
export function BillingToggle(props) {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      <span
        className={`text-base font-medium transition-colors ${props.billingPeriod === "monthly" ? "text-white" : "text-gray-500"}`}
      >
        Monthly
      </span>
      <button
        onClick={() => props.setBillingPeriod(
          props.billingPeriod === "monthly" ? "yearly" : "monthly"
        )}
        className="relative w-14 h-6 bg-[#353535] rounded-full transition-all hover:bg-[#424242]"
      >
        <div
          className={`absolute top-1 left-1 w-4 h-4 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full transition-transform shadow-lg ${props.billingPeriod === "yearly" ? "translate-x-8" : "translate-x-0"}`} />
      </button>
      <span
        className={`text-base font-medium transition-colors ${props.billingPeriod === "yearly" ? "text-white" : "text-gray-500"}`}
      >
        Yearly
      </span>
      {props.billingPeriod === "yearly" && (
        <span className="ml-2 px-2 py-1 bg-[#6366f1] text-white text-xs font-semibold rounded-full">
          Save 17%
        </span>
      )}
    </div>
  );
}
