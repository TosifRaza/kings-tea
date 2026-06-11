import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCartItems, selectCartTotal, clearCart } from '../../store/cartSlice';
import { products } from '../../assets/data';
import { orderAPI } from '../../services/api';

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const shipping = subtotal > 100 ? 0 : 12;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const cartItems = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return { ...item, product };
    })
    .filter((item) => item.product);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
        shippingAddress: {
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
        },
        subtotal,
        shipping,
        tax,
        total,
        paymentMethod: 'card',
      };
      await orderAPI.createOrder(orderData);
      dispatch(clearCart());
      setOrderPlaced(true);
    } catch {
      // Handle error
    }
    setSubmitting(false);
  };

  if (orderPlaced) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 rounded-full bg-tea-green/10 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="h-8 w-8 text-tea-green" />
          </div>
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-deep-walnut mb-3">Order Confirmed!</h2>
          <p className="text-deep-walnut/60 font-[family-name:var(--font-inter)] text-sm mb-6">Thank you for your order. You will receive a confirmation email shortly.</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-tea-green hover:bg-tea-green-light text-warm-ivory text-xs uppercase tracking-wider rounded-none px-8 py-3 transition-colors"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-deep-walnut/50 font-[family-name:var(--font-inter)] mb-4">Your cart is empty.</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-tea-green hover:bg-tea-green-light text-warm-ivory text-xs uppercase tracking-wider rounded-none px-6 py-3 transition-colors"
          >
            Browse Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-deep-walnut/60 hover:text-deep-walnut transition-colors mb-8 font-[family-name:var(--font-inter)] text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-deep-walnut mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-sm border border-imperial-gold/10">
              <h2 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-lg mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5 text-imperial-gold" /> Shipping Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">First Name *</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} required className="h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold" />
                </div>
                <div>
                  <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">Last Name *</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} required className="h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold" />
                </div>
                <div>
                  <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required className="h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold" />
                </div>
                <div>
                  <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className="h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">Address *</label>
                  <input name="address" value={form.address} onChange={handleChange} required className="h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold" />
                </div>
                <div>
                  <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">City *</label>
                  <input name="city" value={form.city} onChange={handleChange} required className="h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold" />
                </div>
                <div>
                  <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">State *</label>
                  <input name="state" value={form.state} onChange={handleChange} required className="h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold" />
                </div>
                <div>
                  <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">ZIP *</label>
                  <input name="zip" value={form.zip} onChange={handleChange} required className="h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold" />
                </div>
                <div>
                  <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">Country *</label>
                  <input name="country" value={form.country} onChange={handleChange} required className="h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-sm border border-imperial-gold/10">
              <h2 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-lg mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-imperial-gold" /> Payment
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">Card Number *</label>
                  <input name="cardNumber" value={form.cardNumber} onChange={handleChange} required placeholder="1234 5678 9012 3456" className="h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold" />
                </div>
                <div>
                  <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">Expiry *</label>
                  <input name="cardExpiry" value={form.cardExpiry} onChange={handleChange} required placeholder="MM/YY" className="h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold" />
                </div>
                <div>
                  <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">CVC *</label>
                  <input name="cardCvc" value={form.cardCvc} onChange={handleChange} required placeholder="123" className="h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white p-6 rounded-sm border border-imperial-gold/10 sticky top-24">
              <h2 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-lg mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex justify-between text-xs font-[family-name:var(--font-inter)]">
                    <span className="text-deep-walnut/70">{item.product.name} × {item.quantity}</span>
                    <span className="text-deep-walnut">${item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-4 border-t border-imperial-gold/10">
                <div className="flex justify-between text-xs font-[family-name:var(--font-inter)]">
                  <span className="text-deep-walnut/50">Subtotal</span>
                  <span className="text-deep-walnut">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-[family-name:var(--font-inter)]">
                  <span className="text-deep-walnut/50">Shipping</span>
                  <span className="text-deep-walnut">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-xs font-[family-name:var(--font-inter)]">
                  <span className="text-deep-walnut/50">Tax</span>
                  <span className="text-deep-walnut">${tax.toFixed(2)}</span>
                </div>
                <div className="h-px bg-imperial-gold/10" />
                <div className="flex justify-between">
                  <span className="font-[family-name:var(--font-playfair)] font-bold text-deep-walnut">Total</span>
                  <span className="font-[family-name:var(--font-playfair)] font-bold text-deep-walnut">${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-tea-green hover:bg-tea-green-light text-warm-ivory py-4 text-xs font-semibold uppercase tracking-widest rounded-none mt-6 flex items-center justify-center gap-2 transition-colors"
              >
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
              <div className="flex items-center gap-2 mt-4 text-deep-walnut/30 text-[10px] font-[family-name:var(--font-inter)]">
                <ShieldCheck className="h-3 w-3" />
                <span>Your payment information is secure</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
