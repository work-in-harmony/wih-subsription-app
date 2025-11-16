import React, { useState } from 'react';
import {
  API_RAZORPAY_CREATE_ORDER,
  API_RAZORPAY_VERIFY,
  IMAGE_URL_LIGHT,
} from "../config/urls";

// Custom Hook: useRazorpay
const useRazorpay = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initiatePayment = async ({
    amount,
    currency = 'INR',
    receiptId,
    orderUrl = API_RAZORPAY_CREATE_ORDER,
    verifyUrl = API_RAZORPAY_VERIFY,
    razorpayKey = 'rzp_test_RSZU6lPKkrRJRt',
    prefill = {},
    notes = {},
    theme = {},
    onSuccess,
    onFailure,
  }) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Create Order
      const response = await fetch(orderUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency,
          receipt_id: receiptId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      console.log('Order created:', data);

      // Check if Razorpay script is loaded
      if (!window.Razorpay) {
        throw new Error('Razorpay script not loaded');
      }

      // 2. Handle Payment Success
      const handlePaymentSuccess = async (razorpayResponse) => {
        console.log('Payment SUCCESS:', JSON.stringify(razorpayResponse));
        
        try {
          const verifyResponse = await fetch(verifyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(razorpayResponse),
          });

          const verifyText = await verifyResponse.text();
          console.log('Verification result:', verifyText);

          if (onSuccess) {
            onSuccess(razorpayResponse, verifyText);
          }
        } catch (err) {
          console.error('Verification failed:', err);
          if (onFailure) {
            onFailure(err);
          }
        } finally {
          setLoading(false);
        }
      };

      // 3. Handle Payment Failure
      const handlePaymentFailure = () => {
        console.log('Payment FAILED: User closed modal');
        if (onFailure) {
          onFailure(new Error('Payment cancelled by user'));
        }
        setLoading(false);
      };

      // 4. Configure Razorpay Options
      const options = {
        key: razorpayKey,
        amount: amount * 100,
        currency,
        name: 'Work in harmony',
        description: 'Transaction',
        order_id: data.order,
        handler: handlePaymentSuccess,
        image: IMAGE_URL_LIGHT,
        prefill: {
          name: prefill.name || '',
          email: prefill.email || '',
          contact: prefill.contact || '',
        },
        notes,
        theme: {
          color: theme.color || '#181818',
          backdrop_color: theme.backdrop_color || 'rgba(0, 0, 0, 0.6)',
        },
        modal: {
          ondismiss: handlePaymentFailure,
        },
      };

      // 5. Open Razorpay Modal
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment initiation failed:', err);
      setError(err.message);
      setLoading(false);
      if (onFailure) {
        onFailure(err);
      }
    }
  };

  return { initiatePayment, loading, error };
};

// Example Usage Component
export default function PaymentPage() {
  const { initiatePayment, loading, error } = useRazorpay();

  const handlePayment = () => {
    initiatePayment({
      amount: 500,
      currency: 'INR',
      receiptId: '123',
      prefill: {
        name: 'Elu',
        email: 'elu@example.com',
        contact: '9999999999',
      },
      onSuccess: (response, verifyText) => {
        alert(`Payment Successful!\n${verifyText}`);
        // Additional success logic here
      },
      onFailure: (err) => {
        alert(`Payment Failed: ${err.message}`);
        // Additional failure logic here
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Pay with Razorpay
        </h1>
        <p className="text-gray-600 mb-8">
          Click the button below to complete your secure payment.
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            Error: {error}
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Pay ₹500'}
        </button>
      </div>
    </div>
  );
}
