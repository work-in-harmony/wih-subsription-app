import { useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRazorpay } from "./useRazorpay";
import { AddressModal } from "./AddressModal";
import { PricingCard } from "./PricingCard";
import { BillingToggle } from "./BillingToggle";

export const PaymentSuccessModal = ({ isOpen, onClose, transactionId, planName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1f1f1f] rounded-lg p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <CheckCircle size={64} className="text-green-500" />
          </div>

          <h2 className="text-white text-2xl font-bold mb-2">
            Payment Successful!
          </h2>

          <p className="text-gray-400 mb-4">
            Your subscription has been activated
          </p>

          <div className="bg-[#2a2a2a] rounded-lg p-4 w-full mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Plan:</span>
              <span className="text-white font-semibold">{planName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Transaction ID:</span>
              <span className="text-white font-mono text-sm">{transactionId}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export const PaymentFailureModal = ({ isOpen, onClose, errorMessage }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1f1f1f] rounded-lg p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <XCircle size={64} className="text-red-500" />
          </div>

          <h2 className="text-white text-2xl font-bold mb-2">
            Payment Failed
          </h2>

          <p className="text-gray-400 mb-6">
            {errorMessage || "Something went wrong with your payment. Please try again."}
          </p>

          <button
            onClick={onClose}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default function SubscriptionPage() {


  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [failureModalOpen, setFailureModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const { initiatePayment, loading } = useRazorpay();
  const navigate = useNavigate();

  const plans = {
    basic: {
      name: "Basic",
      price: { monthly: 350, yearly: 3500 },
      savePercent: 17,
      features: [
        "Up to 10 team members",
        "Kanban board view",
        "List view management",
        "Basic reporting",
        "Email support",
      ],
      highlight: false,
    },
    pro: {
      name: "Pro",
      price: { monthly: 500, yearly: 5000 },
      savePercent: 17,
      features: [
        "Everything in Basic",
        "AI-powered insights",
        "HD video calling",
        "Up to 50 team members",
        "Advanced analytics",
        "Priority support",
      ],
      highlight: true,
    },
  };

  const handleSubscribe = (planName, amount) => {
    setSelectedPlan({ planName, amount });
    setModalOpen(true);
  };

  const handleAddressConfirm = (addressData) => {
    const { planName, amount } = selectedPlan;
    const receiptId = `receipt_${Date.now()}`;

    // Convert plan name to enum format
    const planType = planName.toUpperCase(); // "Basic" -> "BASIC", "Pro" -> "PRO"
    const planInterval = billingPeriod.toUpperCase(); // "monthly" -> "MONTHLY", "yearly" -> "YEARLY"

    // Close modal before opening Razorpay
    setModalOpen(false);

    initiatePayment({
      amount,
      currency: "INR",
      receiptId,
      address: addressData,
      planType,
      planInterval,
      prefill: {
        name: addressData.fullName,
        email: addressData.email,
        contact: addressData.phone,
      },
      notes: {
        plan: planName,
        billing_period: billingPeriod,
      },
      onSuccess: (response, successData) => {
        setPaymentData({
          transactionId: response.razorpay_payment_id,
          planName: planName,
        });
        setSuccessModalOpen(true);
      },
      onFailure: (err) => {
        setPaymentData({
          errorMessage: err.message,
        });
        setFailureModalOpen(true);
      },
    });
  };

  const handleSuccessModalClose = () => {
    setSuccessModalOpen(false);
    
    navigate("/add-member");
  };

  const handleFailureModalClose = () => {
    setFailureModalOpen(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#181818] p-4 md:p-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Choose Your Plan
          </h1>
          <p className="text-gray-400 text-md">
            Select the perfect plan for your team's needs
          </p>
        </div>

        {/* Billing Toggle */}
        <BillingToggle
          billingPeriod={billingPeriod}
          setBillingPeriod={setBillingPeriod}
        ></BillingToggle>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <PricingCard
            plan={plans.basic}
            billingPeriod={billingPeriod}
            onSubscribe={handleSubscribe}
            isProcessing={loading}
          />
          <PricingCard
            plan={plans.pro}
            billingPeriod={billingPeriod}
            onSubscribe={handleSubscribe}
            isProcessing={loading}
          />
        </div>
      </div>

      {/* Address Modal */}
      {selectedPlan && (
        <AddressModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          planName={selectedPlan.planName}
          amount={selectedPlan.amount}
          billingPeriod={billingPeriod}
          onConfirm={handleAddressConfirm}
        />
      )}

      {/* Success Modal */}
      {paymentData && (
        <PaymentSuccessModal
          isOpen={successModalOpen}
          onClose={handleSuccessModalClose}
          transactionId={paymentData.transactionId}
          planName={paymentData.planName}
        />
      )}

      {/* Failure Modal */}
      {paymentData && (
        <PaymentFailureModal
          isOpen={failureModalOpen}
          onClose={handleFailureModalClose}
          errorMessage={paymentData.errorMessage}
        />
      )}
    </div>
  );
}