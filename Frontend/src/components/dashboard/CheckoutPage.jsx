import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCartItems, selectCartTotal, clearCart } from '../../store/cartSlice';
import { orderAPI } from '../../services/api';

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const { products } = useSelector((state) => state.products);

  const shipping = subtotal > 1000 ? 0 : 99;
  const total = subtotal + shipping;

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
      const product = (products || []).find(
        (p) => (p._id || p.id) === item.productId
      );
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
        quantity: item.quantity,
      })),
      shippingName: `${form.firstName} ${form.lastName}`.trim(),
      shippingAddress: form.address,
      shippingCity: form.city,
      shippingState: form.state,
      shippingZip: form.zip,
      shippingCountry: form.country,
      paymentMethod: 'card',
    };
    await orderAPI.createOrder(orderData);
    dispatch(clearCart());
    setOrderPlaced(true);
  } catch (error) {
    console.error('Order error:', error);
  }
  setSubmitting(false);
};

  if (orderPlaced) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 rounded-full bg-[#1F4D3A]/10 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="h-8 w-8 text-[#1F4D3A]" />
          </div>
          <h2 className="text-2xl font-bold text-[#3A281C] mb-3">Order Confirmed!</h2>
          <p className="text-[#3A281C]/60 text-sm mb-6">Thank you for your order. You will receive a confirmation email shortly.</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-[#1F4D3A] hover:bg-[#1F4D3A]/90 text-[#F8F3E9] text-xs uppercase tracking-wider px-8 py-3 transition-colors"
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
          <p className="text-[#3A281C]/50 mb-4">Your cart is empty.</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-[#1F4D3A] hover:bg-[#1F4D3A]/90 text-[#F8F3E9] text-xs uppercase tracking-wider px-6 py-3 transition-colors"
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
          className="flex items-center gap-2 text-[#3A281C]/60 hover:text-[#3A281C] transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <h1 className="text-3xl font-bold text-[#3A281C] mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-sm border border-[#C9A86A]/10">
              <h2 className="font-semibold text-[#3A281C] text-lg mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5 text-[#C9A86A]" /> Shipping Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#3A281C]/70 text-xs mb-1 block">First Name *</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} required className="h-10 border border-[#C9A86A]/20 text-sm w-full px-3 focus:outline-none focus:border-[#C9A86A]" />
                </div>
                <div>
                  <label className="text-[#3A281C]/70 text-xs mb-1 block">Last Name *</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} required className="h-10 border border-[#C9A86A]/20 text-sm w-full px-3 focus:outline-none focus:border-[#C9A86A]" />
                </div>
                <div>
                  <label className="text-[#3A281C]/70 text-xs mb-1 block">Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required className="h-10 border border-[#C9A86A]/20 text-sm w-full px-3 focus:outline-none focus:border-[#C9A86A]" />
                </div>
                <div>
                  <label className="text-[#3A281C]/70 text-xs mb-1 block">Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className="h-10 border border-[#C9A86A]/20 text-sm w-full px-3 focus:outline-none focus:border-[#C9A86A]" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[#3A281C]/70 text-xs mb-1 block">Address *</label>
                  <input name="address" value={form.address} onChange={handleChange} required className="h-10 border border-[#C9A86A]/20 text-sm w-full px-3 focus:outline-none focus:border-[#C9A86A]" />
                </div>
                <div>
                  <label className="text-[#3A281C]/70 text-xs mb-1 block">City *</label>
                  <input name="city" value={form.city} onChange={handleChange} required className="h-10 border border-[#C9A86A]/20 text-sm w-full px-3 focus:outline-none focus:border-[#C9A86A]" />
                </div>
                <div>
                  <label className="text-[#3A281C]/70 text-xs mb-1 block">State *</label>
                  <input name="state" value={form.state} onChange={handleChange} required className="h-10 border border-[#C9A86A]/20 text-sm w-full px-3 focus:outline-none focus:border-[#C9A86A]" />
                </div>
                <div>
                  <label className="text-[#3A281C]/70 text-xs mb-1 block">ZIP *</label>
                  <input name="zip" value={form.zip} onChange={handleChange} required className="h-10 border border-[#C9A86A]/20 text-sm w-full px-3 focus:outline-none focus:border-[#C9A86A]" />
                </div>
                <div>
                  <label className="text-[#3A281C]/70 text-xs mb-1 block">Country *</label>
                  <input name="country" value={form.country} onChange={handleChange} required className="h-10 border border-[#C9A86A]/20 text-sm w-full px-3 focus:outline-none focus:border-[#C9A86A]" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-sm border border-[#C9A86A]/10">
              <h2 className="font-semibold text-[#3A281C] text-lg mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#C9A86A]" /> Payment
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-[#3A281C]/70 text-xs mb-1 block">Card Number *</label>
                  <input name="cardNumber" value={form.cardNumber} onChange={handleChange} required placeholder="1234 5678 9012 3456" className="h-10 border border-[#C9A86A]/20 text-sm w-full px-3 focus:outline-none focus:border-[#C9A86A]" />
                </div>
                <div>
                  <label className="text-[#3A281C]/70 text-xs mb-1 block">Expiry *</label>
                  <input name="cardExpiry" value={form.cardExpiry} onChange={handleChange} required placeholder="MM/YY" className="h-10 border border-[#C9A86A]/20 text-sm w-full px-3 focus:outline-none focus:border-[#C9A86A]" />
                </div>
                <div>
                  <label className="text-[#3A281C]/70 text-xs mb-1 block">CVC *</label>
                  <input name="cardCvc" value={form.cardCvc} onChange={handleChange} required placeholder="123" className="h-10 border border-[#C9A86A]/20 text-sm w-full px-3 focus:outline-none focus:border-[#C9A86A]" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white p-6 rounded-sm border border-[#C9A86A]/10 sticky top-24">
              <h2 className="font-semibold text-[#3A281C] text-lg mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex justify-between text-xs">
                    <span className="text-[#3A281C]/70">{item.product.name} × {item.quantity}</span>
                    <span className="text-[#3A281C]">₹{(item.product.price * item.quantity)?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-4 border-t border-[#C9A86A]/10">
                <div className="flex justify-between text-xs">
                  <span className="text-[#3A281C]/50">Subtotal</span>
                  <span className="text-[#3A281C]">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#3A281C]/50">Shipping</span>
                  <span className="text-[#3A281C]">{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                <div className="h-px bg-[#C9A86A]/10" />
                <div className="flex justify-between">
                  <span className="font-bold text-[#3A281C]">Total</span>
                  <span className="font-bold text-[#3A281C]">₹{total.toLocaleString()}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#1F4D3A] hover:bg-[#1F4D3A]/90 text-[#F8F3E9] py-4 text-xs font-semibold uppercase tracking-widest mt-6 flex items-center justify-center gap-2 transition-colors"
              >
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
              <div className="flex items-center gap-2 mt-4 text-[#3A281C]/30 text-[10px]">
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