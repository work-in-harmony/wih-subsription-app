import { useState } from 'react';
import {
  API_RAZORPAY_CREATE_ORDER,
  API_RAZORPAY_SUCCESS,
  IMAGE_URL_LIGHT,
} from "../config/urls";

// Custom Hook: useRazorpay
export const useRazorpay = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initiatePayment = async ({
    amount, currency = 'INR', receiptId, address, planType, planInterval, orderUrl = API_RAZORPAY_CREATE_ORDER, successUrl = API_RAZORPAY_SUCCESS, razorpayKey = 'rzp_test_RSZU6lPKkrRJRt', prefill = {}, notes = {}, theme = {}, onSuccess, onFailure,
  }) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Create Order with address
      const response = await fetch(orderUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency,
          receipt_id: receiptId,
          address,
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
          // Prepare the request DTO matching your backend structure
          const requestDto = {
            email: address.email,
            amount: amount.toString(),
            transactionId: razorpayResponse.razorpay_payment_id,
            address: {
              fullName: address.fullName,
              email: address.email,
              phone: address.phone,
              addressLine1: address.addressLine1,
              addressLine2: address.addressLine2,
              city: address.city,
              state: address.state,
              pincode: address.pincode,
              country: address.country,
            },
            planType: planType,
            planInterval: planInterval,
          };

          const successResponse = await fetch(successUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestDto),
          });

          const successData = await successResponse.json();
          console.log('Success response:', successData);

          if (onSuccess) {
            onSuccess(razorpayResponse, successData);
          }
        } catch (err) {
          console.error('Success handler failed:', err);
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
