import React, { useState } from 'react';
import { ArrowLeft, Lock, ShieldCheck, CheckCircle2, CreditCard, Sparkles, Truck, Printer, FileCheck } from 'lucide-react';
import { CartItem, ShippingAddress, PaymentInfo, OrderRecord } from '../types';

interface CheckoutViewProps {
  cart: CartItem[];
  onBack: () => void;
  onOrderComplete: (order: OrderRecord) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ cart, onBack, onOrderComplete }) => {
  const [shipping, setShipping] = useState<ShippingAddress>({
    email: '',
    phone: '',
    country: 'United Kingdom',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const [payment, setPayment] = useState<PaymentInfo>({
    cardNumber: '',
    expDate: '',
    cvc: '',
    cardholderName: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'express'>('card');
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Subtotal calculation
  const subtotal = cart.reduce((sum, item) => {
    return sum + (item.artwork.price + item.framePrice) * item.quantity;
  }, 0);

  const discountAmount = (subtotal * appliedDiscount) / 100;
  const shippingFee = 0; // Free archival delivery
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'STUDIO10') {
      setAppliedDiscount(10);
      setPromoSuccess('10% Studio Collector Discount Applied!');
    } else if (code === 'DATAART20') {
      setAppliedDiscount(20);
      setPromoSuccess('20% Generative Special Discount Applied!');
    } else if (code === '') {
      setPromoError('Please enter a voucher code.');
    } else {
      setPromoError('Invalid coupon code. Try STUDIO10 or DATAART20.');
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setPayment({ ...payment, cardNumber: formatted });
  };

  const handleExpDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = raw.slice(0, 2) + '/' + raw.slice(2);
    }
    setPayment({ ...payment, expDate: raw });
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!shipping.email || !shipping.email.includes('@')) errs.email = 'Valid email is required for receipt';
    if (!shipping.firstName) errs.firstName = 'First name is required';
    if (!shipping.lastName) errs.lastName = 'Last name is required';
    if (!shipping.address) errs.address = 'Street address is required';
    if (!shipping.city) errs.city = 'City is required';
    if (!shipping.postalCode) errs.postalCode = 'Postal code is required';

    if (paymentMethod === 'card') {
      if (!payment.cardNumber || payment.cardNumber.replace(/\s/g, '').length < 15) {
        errs.cardNumber = 'Valid 16-digit card number is required';
      }
      if (!payment.expDate || payment.expDate.length < 5) {
        errs.expDate = 'MM/YY required';
      }
      if (!payment.cvc || payment.cvc.length < 3) {
        errs.cvc = 'CVC required';
      }
      if (!payment.cardholderName) {
        errs.cardholderName = 'Cardholder name is required';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const newOrder: OrderRecord = {
        orderId: `FT-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        items: [...cart],
        shippingAddress: shipping,
        subtotal,
        shipping: shippingFee,
        total: finalTotal
      };
      onOrderComplete(newOrder);
    }, 1200);
  };

  return (
    <div id="checkout-view" className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Navigation & Header */}
        <div className="mb-10 flex items-center justify-between border-b border-zinc-200 pb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-zinc-600 hover:text-black transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Studio Gallery</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted Studio Checkout</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Contact, Shipping, Payment */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Express Checkout Options */}
            <div className="p-6 bg-zinc-50 border border-zinc-200 space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 text-center">
                Express Payment Options
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('express')}
                  className={`py-3 px-4 rounded border text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    paymentMethod === 'express'
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-zinc-300 hover:border-black'
                  }`}
                >
                  <span> Apple Pay</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('express')}
                  className={`py-3 px-4 rounded border text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    paymentMethod === 'express'
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-zinc-300 hover:border-black'
                  }`}
                >
                  <span>G Google Pay</span>
                </button>
              </div>
              <div className="relative flex items-center justify-center py-2">
                <div className="border-t border-zinc-200 w-full"></div>
                <span className="bg-zinc-50 px-3 text-[11px] font-mono text-zinc-400 uppercase absolute">
                  Or pay with credit card
                </span>
              </div>
            </div>

            {/* Section 1: Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                <h2 className="font-serif text-2xl text-black font-medium">1. Contact Information</h2>
                <span className="text-xs font-mono text-zinc-400">Step 1 of 3</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={shipping.email}
                    onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                    placeholder="collector@example.com"
                    className={`w-full px-3.5 py-2.5 border text-sm focus:outline-none focus:border-black ${
                      errors.email ? 'border-red-500' : 'border-zinc-300'
                    }`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-700 mb-1">
                    Phone (for courier delivery updates)
                  </label>
                  <input
                    type="tel"
                    value={shipping.phone}
                    onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                    placeholder="+44 20 7946 0192"
                    className="w-full px-3.5 py-2.5 border border-zinc-300 text-sm focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Delivery & Shipping Address */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                <h2 className="font-serif text-2xl text-black font-medium">2. Shipping Destination</h2>
                <span className="text-xs font-mono text-zinc-400">Step 2 of 3</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-700 mb-1">
                    Country / Territory *
                  </label>
                  <select
                    value={shipping.country}
                    onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-zinc-300 text-sm bg-white focus:outline-none focus:border-black cursor-pointer"
                  >
                    <option value="United Kingdom">United Kingdom (Free Insured Next-Day / Express Courier)</option>
                    <option value="United States">United States (Free Insured 2-Day Air Freight)</option>
                    <option value="Canada">Canada (Free Carbon-Neutral Courier)</option>
                    <option value="Germany">Germany (Free DHL Express Art Transport)</option>
                    <option value="France">France (Free Priority Art Courier)</option>
                    <option value="Japan">Japan (Free FedEx Priority International)</option>
                    <option value="Australia">Australia (Free Courier Art Freight)</option>
                    <option value="Other">International Worldwide (Complimentary)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={shipping.firstName}
                      onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })}
                      placeholder="Jane"
                      className={`w-full px-3.5 py-2.5 border text-sm focus:outline-none focus:border-black ${
                        errors.firstName ? 'border-red-500' : 'border-zinc-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={shipping.lastName}
                      onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })}
                      placeholder="Doe"
                      className={`w-full px-3.5 py-2.5 border text-sm focus:outline-none focus:border-black ${
                        errors.lastName ? 'border-red-500' : 'border-zinc-300'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={shipping.address}
                    onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                    placeholder="24 Hackney Road, Flat 3B"
                    className={`w-full px-3.5 py-2.5 border text-sm focus:outline-none focus:border-black ${
                      errors.address ? 'border-red-500' : 'border-zinc-300'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      placeholder="London"
                      className={`w-full px-3.5 py-2.5 border text-sm focus:outline-none focus:border-black ${
                        errors.city ? 'border-red-500' : 'border-zinc-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-700 mb-1">
                      Postal / ZIP Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={shipping.postalCode}
                      onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                      placeholder="E2 7NS"
                      className={`w-full px-3.5 py-2.5 border text-sm focus:outline-none focus:border-black ${
                        errors.postalCode ? 'border-red-500' : 'border-zinc-300'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Payment Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                <h2 className="font-serif text-2xl text-black font-medium">3. Payment Information</h2>
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Visa, MC, Amex, Discover</span>
                </div>
              </div>

              <div className="p-6 bg-zinc-50 border border-zinc-200 space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-700 mb-1">
                    Cardholder Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={payment.cardholderName}
                    onChange={(e) => setPayment({ ...payment, cardholderName: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full px-3.5 py-2.5 border border-zinc-300 text-sm bg-white focus:outline-none focus:border-black"
                  />
                  {errors.cardholderName && <p className="text-xs text-red-500 mt-1">{errors.cardholderName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-700 mb-1">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    value={payment.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4532 •••• •••• 8921"
                    className="w-full px-3.5 py-2.5 border border-zinc-300 text-sm bg-white font-mono focus:outline-none focus:border-black"
                  />
                  {errors.cardNumber && <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-700 mb-1">
                      Expiration (MM/YY) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      value={payment.expDate}
                      onChange={handleExpDateChange}
                      placeholder="12/26"
                      className="w-full px-3.5 py-2.5 border border-zinc-300 text-sm bg-white font-mono focus:outline-none focus:border-black"
                    />
                    {errors.expDate && <p className="text-xs text-red-500 mt-1">{errors.expDate}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-700 mb-1">
                      Security Code (CVC) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={4}
                      value={payment.cvc}
                      onChange={(e) => setPayment({ ...payment, cvc: e.target.value.replace(/\D/g, '') })}
                      placeholder="842"
                      className="w-full px-3.5 py-2.5 border border-zinc-300 text-sm bg-white font-mono focus:outline-none focus:border-black"
                    />
                    {errors.cvc && <p className="text-xs text-red-500 mt-1">{errors.cvc}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Submission Button */}
            <div className="space-y-3 pt-4">
              <button
                type="submit"
                id="btn-complete-order"
                disabled={isProcessing || cart.length === 0}
                className="w-full py-4 px-6 bg-black text-white text-xs uppercase tracking-[0.25em] font-medium hover:bg-zinc-800 disabled:bg-zinc-400 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Transmitting Encrypted Authorization...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Complete Purchase • £{finalTotal} GBP</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-zinc-400 text-xs font-mono">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-600" />
                  Direct Studio Guarantee
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-zinc-600" />
                  Insured White Glove Transit
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-[#F4F4F4] p-6 sm:p-8 border border-zinc-200 space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-300 pb-3">
                <h3 className="font-serif text-xl font-medium text-black">Order Summary</h3>
                <span className="text-xs font-mono text-zinc-500">{cart.length} Item(s)</span>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 pb-4 border-b border-zinc-200">
                    <div className="relative w-16 h-20 bg-white border border-zinc-300 flex-shrink-0 overflow-hidden p-1">
                      <img
                        src={item.artwork.image}
                        alt={item.artwork.title}
                        referrerPolicy="no-referrer"
                        className={`w-full h-full object-cover ${item.artwork.objectPosition || 'object-center'}`}
                      />
                      <span className="absolute top-0.5 right-0.5 bg-black text-white text-[9px] font-mono px-1">
                        ×{item.quantity}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-base font-medium text-black truncate">
                        {item.artwork.title}
                      </h4>
                      <p className="text-xs font-mono text-zinc-500">
                        {item.artwork.edition}
                      </p>
                      <p className="text-[11px] text-zinc-600 font-sans mt-0.5">
                        Framing: <span className="font-medium">{
                          item.frameOption === 'unframed' ? 'Unframed Mat (£0)' :
                          item.frameOption === 'black-gallery' ? 'Black Aluminum Frame (+£1200)' :
                          'English Natural Oak (+£1400)'
                        }</span>
                      </p>
                    </div>

                    <div className="text-right font-sans font-semibold text-sm text-black">
                      £{(item.artwork.price + item.framePrice) * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="pt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Collector Code (e.g. STUDIO10)"
                    className="flex-1 px-3 py-2 text-xs border border-zinc-300 bg-white uppercase font-mono focus:outline-none focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-zinc-800 text-white text-xs uppercase tracking-wider font-medium hover:bg-black transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-[11px] text-red-600 mt-1">{promoError}</p>}
                {promoSuccess && <p className="text-[11px] text-emerald-700 mt-1 font-medium">{promoSuccess}</p>}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-2.5 pt-4 border-t border-zinc-300 text-sm font-sans">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span className="font-mono text-black font-medium">£{subtotal}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Studio Collector Voucher ({appliedDiscount}%)</span>
                    <span className="font-mono">-£{discountAmount.toFixed(0)}</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-600">
                  <span>Archival White-Glove Shipping</span>
                  <span className="font-mono text-emerald-700 font-medium">FREE</span>
                </div>

                <div className="flex justify-between text-zinc-600">
                  <span>UK VAT & Duties (Studio Direct)</span>
                  <span className="font-mono text-black font-medium">INCLUDED</span>
                </div>

                <div className="flex justify-between text-base font-semibold text-black pt-3 border-t border-zinc-300">
                  <span>Total Amount</span>
                  <span className="font-sans text-xl">£{finalTotal} GBP</span>
                </div>
              </div>

              {/* Authenticity Certificate guarantee */}
              <div className="p-4 bg-white border border-zinc-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-medium text-black">
                  <FileCheck className="w-4 h-4 text-zinc-800" />
                  <span>Physical Collector Inclusions</span>
                </div>
                <ul className="text-zinc-600 text-[11px] font-light space-y-1 list-disc list-inside">
                  <li>Physical archival drawing on 300gsm cotton</li>
                  <li>Certificate of Authenticity with algorithm SHA-256 seed</li>
                  <li>Artist signature & numbering in graphite</li>
                  <li>Cotton studio inspection gloves included</li>
                </ul>
              </div>

            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
