import React, { useState } from 'react';

// Address Modal Component
export const AddressModal = ({ isOpen, onClose, planName, amount, billingPeriod, onConfirm }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 3) return 'Name must be at least 3 characters';
        return '';

      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Invalid email format';
        return '';

      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(value)) return 'Invalid Indian phone number';
        return '';

      case 'addressLine1':
        if (!value.trim()) return 'Address is required';
        if (value.trim().length < 5) return 'Address must be at least 5 characters';
        return '';

      case 'city':
        if (!value.trim()) return 'City is required';
        if (value.trim().length < 2) return 'City must be at least 2 characters';
        return '';

      case 'state':
        if (!value.trim()) return 'State is required';
        return '';

      case 'pincode':
        if (!value.trim()) return 'Pincode is required';
        const pincodeRegex = /^[1-9][0-9]{5}$/;
        if (!pincodeRegex.test(value)) return 'Invalid pincode';
        return '';

      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    const requiredFields = ['fullName', 'email', 'phone', 'addressLine1', 'city', 'state', 'pincode'];

    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    setTouched(Object.fromEntries(requiredFields.map(field => [field, true])));

    if (Object.keys(newErrors).length === 0) {
      onConfirm(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-[#232323] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#232323] p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Complete Your Order</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Order Summary */}
          <div className="bg-[#2a2a2a] rounded-lg p-4 mb-6">
            <h3 className="text-white font-semibold mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Plan:</span>
                <span className="font-medium text-white">{planName}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Billing:</span>
                <span className="font-medium text-white capitalize">{billingPeriod}</span>
              </div>
              <div className="border-t border-gray-700 pt-2 mt-2 flex justify-between text-white">
                <span className="font-semibold">Total Amount:</span>
                <span className="font-bold text-lg">₹{amount}</span>
              </div>
            </div>
          </div>

          {/* Address Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 bg-[#2a2a2a] text-white rounded-lg focus:outline-none focus:ring-2 ${errors.fullName && touched.fullName
                    ? 'ring-2 ring-red-500'
                    : 'focus:ring-[#6366f1]'}`}
                placeholder="John Doe" />
              {errors.fullName && touched.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email & Phone */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 bg-[#2a2a2a] text-white rounded-lg focus:outline-none focus:ring-2 ${errors.email && touched.email
                      ? 'ring-2 ring-red-500'
                      : 'focus:ring-[#6366f1]'}`}
                  placeholder="john@example.com" />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 bg-[#2a2a2a] text-white rounded-lg focus:outline-none focus:ring-2 ${errors.phone && touched.phone
                      ? 'ring-2 ring-red-500'
                      : 'focus:ring-[#6366f1]'}`}
                  placeholder="9876543210" />
                {errors.phone && touched.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Address Line 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address Line 1 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 bg-[#2a2a2a] text-white rounded-lg focus:outline-none focus:ring-2 ${errors.addressLine1 && touched.addressLine1
                    ? 'ring-2 ring-red-500'
                    : 'focus:ring-[#6366f1]'}`}
                placeholder="House no, Building name" />
              {errors.addressLine1 && touched.addressLine1 && (
                <p className="text-red-500 text-xs mt-1">{errors.addressLine1}</p>
              )}
            </div>

            {/* Address Line 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address Line 2
              </label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#2a2a2a] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                placeholder="Street, Area, Landmark" />
            </div>

            {/* City & State */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 bg-[#2a2a2a] text-white rounded-lg focus:outline-none focus:ring-2 ${errors.city && touched.city
                      ? 'ring-2 ring-red-500'
                      : 'focus:ring-[#6366f1]'}`}
                  placeholder="Mumbai" />
                {errors.city && touched.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 bg-[#2a2a2a] text-white rounded-lg focus:outline-none focus:ring-2 ${errors.state && touched.state
                      ? 'ring-2 ring-red-500'
                      : 'focus:ring-[#6366f1]'}`}
                  placeholder="Maharashtra" />
                {errors.state && touched.state && (
                  <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                )}
              </div>
            </div>

            {/* Pincode & Country */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 bg-[#2a2a2a] text-white rounded-lg focus:outline-none focus:ring-2 ${errors.pincode && touched.pincode
                      ? 'ring-2 ring-red-500'
                      : 'focus:ring-[#6366f1]'}`}
                  placeholder="400001" />
                {errors.pincode && touched.pincode && (
                  <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  readOnly
                  className="w-full px-4 py-2 bg-[#1a1a1a] text-gray-400 rounded-lg cursor-not-allowed" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-6 bg-[#2a2a2a] text-white rounded-lg font-semibold hover:bg-[#353535] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-6 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Proceed to Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
