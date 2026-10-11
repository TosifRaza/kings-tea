import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, ShieldCheck, AlertCircle, Truck, CheckCircle2, QrCode, Banknote } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart, selectCartItems } from '../../store/cartSlice';
import { paymentAPI } from '../../services/api';
import { getPriceForWeight, parseWeightGrams } from '../../utils/weight';

const initialAddress = { name: '', phone: '', address: '', city: '', state: '', zip: '', country: 'India' };
const loadRazorpay = () => new Promise((resolve) => {
  if (window.Razorpay) return resolve(true);
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const products = useSelector((state) => state.products.products || []);
  const user = useSelector((state) => state.auth.user);
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [form, setForm] = useState(initialAddress);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  useEffect(() => {
    let active = true;
    paymentAPI.getConfig().then(({ data }) => {
      if (active) {
        const config = data?.data || { enabled: false };
        setPaymentConfig(config);
        if (config.enabled) setPaymentMethod('upi');
      }
    }).catch(() => { if (active) setPaymentConfig({ enabled: false }); });
    setForm((current) => ({ ...current, name: user?.name || '', phone: user?.phone || '' }));
    return () => { active = false; };
  }, [user]);

  const cartItems = useMemo(() => items.map((item) => {
    const storedProduct = products.find((p) => (p._id || p.id) === item.productId);
    const product = storedProduct ? {
      ...storedProduct,
      price: getPriceForWeight(storedProduct.price, parseWeightGrams(storedProduct.weight) || 100, item.weightGrams),
      weight: item.weight || storedProduct.weight || '',
    } : (item.productName || item.name ? {
      _id: item.productId, name: item.productName || item.name, price: Number(item.price) || 0, images: item.image ? [item.image] : [],
    } : null);
    return { ...item, product };
  }).filter((item) => item.product), [items, products]);
  const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);
  const shipping = subtotal >= 1000 ? 0 : 99;

  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    if (!localStorage.getItem('token')) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    if (paymentMethod === 'upi' && !paymentConfig?.enabled) {
      setMessage('UPI checkout is not configured yet. Choose Cash on Delivery or try again later.');
      return;
    }
    setBusy(true);
    try {
      const idempotencyKey = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const orderPayload = {
        items: cartItems.map(({ productId, quantity, weightGrams }) => ({ productId, quantity, weightGrams })),
        shippingName: form.name,
        shippingPhone: form.phone,
        shippingAddress: form.address,
        shippingCity: form.city,
        shippingState: form.state,
        shippingZip: form.zip,
        shippingCountry: form.country,
      };
      if (paymentMethod === 'cod') {
        const { data: created } = await paymentAPI.createCodOrder(orderPayload, idempotencyKey);
        setConfirmedOrder(created?.data);
        dispatch(clearCart());
        setBusy(false);
        return;
      }

      const loaded = await loadRazorpay();
      if (!loaded) throw new Error('Secure payment window could not be loaded. Check your connection and try again.');
      const { data: created } = await paymentAPI.createPaymentOrder(orderPayload, idempotencyKey);
      const paymentOrder = created?.data;
      if (!paymentOrder?.razorpayOrderId || !paymentOrder?.keyId) throw new Error('The payment provider returned an incomplete checkout.');

      const checkout = new window.Razorpay({
        key: paymentOrder.keyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: "KING'S TEA",
        description: `Order ${paymentOrder.orderNumber}`,
        order_id: paymentOrder.razorpayOrderId,
        config: {
          display: {
            blocks: {
              upi: {
                name: 'UPI and Scan QR',
                instruments: [{ method: 'upi', flows: ['qr', 'intent'] }],
              },
            },
            sequence: ['block.upi'],
            preferences: { show_default_blocks: false },
          },
        },
        prefill: { name: form.name, email: user?.email || '', contact: form.phone },
        theme: { color: '#104c38' },
        modal: { ondismiss: () => setBusy(false) },
        handler: async (response) => {
          try {
            const { data: verification } = await paymentAPI.verifyPayment({ orderId: paymentOrder.orderId, ...response });
            setConfirmedOrder(verification?.data);
            dispatch(clearCart());
          } catch (error) {
            setMessage(error.response?.data?.message || 'Payment is awaiting server verification. Your cart has been kept; contact support with your payment reference if charged.');
          } finally {
            setBusy(false);
          }
        },
      });
      checkout.on('payment.failed', (response) => {
        setMessage(response.error?.description || 'Payment failed. Your cart has been kept so you can try again.');
        setBusy(false);
      });
      checkout.open();
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || 'Could not start secure checkout. Please try again.');
      setBusy(false);
    }
  };

  if (confirmedOrder) return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="max-w-lg text-center rounded-xl bg-white p-8 shadow-lg">
        <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-emerald-700" />
        <h1 className="mb-2 text-3xl font-serif text-[#173e30]">{confirmedOrder.paymentMethod === 'cod' ? 'Order placed' : 'Order confirmed'}</h1>
        <p className="text-[#3A281C]/70">{confirmedOrder.paymentMethod === 'cod' ? <>Order <strong>{confirmedOrder.orderNumber}</strong> is confirmed. Pay ₹{Number(confirmedOrder.total).toLocaleString('en-IN')} when it is delivered.</> : <>Payment verified. Your order number is <strong>{confirmedOrder.orderNumber}</strong>.</>}</p>
        <button onClick={() => navigate('/dashboard?tab=orders')} className="mt-6 rounded bg-[#104c38] px-6 py-3 text-white">View my orders</button>
      </div>
    </div>
  );

  if (cartItems.length === 0) return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="text-center"><p className="mb-4 text-[#3A281C]/60">Your cart is empty.</p><button onClick={() => navigate('/shop')} className="bg-[#1F4D3A] px-6 py-3 text-sm text-white">Browse Collection</button></div>
    </div>
  );

  const fieldClass = 'h-11 w-full rounded border border-[#C9A86A]/30 bg-white px-3 text-sm outline-none focus:border-[#1F4D3A]';
  const fields = [['name', 'Full name'], ['phone', 'Phone number'], ['address', 'Street address'], ['city', 'City'], ['state', 'State'], ['zip', 'Postal code'], ['country', 'Country']];

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen px-4 pb-16 pt-24">
      <div className="mx-auto max-w-6xl">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-sm text-[#3A281C]/65"><ArrowLeft className="h-4 w-4" />Back</button>
        <h1 className="mb-7 text-3xl font-serif text-[#173e30]">Secure checkout</h1>
        <form onSubmit={handleSubmit} className="grid gap-7 lg:grid-cols-[1fr_360px]">
          <section className="rounded-xl border border-[#C9A86A]/20 bg-white p-5 sm:p-7">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-[#3A281C]"><Truck className="h-5 w-5 text-[#C9A86A]" />Shipping information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map(([name, label]) => <label key={name} className={name === 'address' ? 'sm:col-span-2' : ''}><span className="mb-1 block text-xs text-[#3A281C]/70">{label} *</span><input className={fieldClass} name={name} value={form[name]} onChange={handleChange} required autoComplete={name === 'zip' ? 'postal-code' : name} /></label>)}
            </div>
            <div className="mt-6 rounded-lg border border-emerald-900/10 bg-[#f6f8f2] p-4">
              <h2 className="mb-3 flex items-center gap-2 font-semibold text-[#173e30]"><CreditCard className="h-5 w-5" />Choose a payment method</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${paymentMethod === 'upi' ? 'border-[#104c38] bg-white ring-1 ring-[#104c38]' : 'border-[#d9e3d8] bg-white/60'} ${!paymentConfig?.enabled ? 'opacity-60' : ''}`}>
                  <input type="radio" name="paymentMethod" value="upi" checked={paymentMethod === 'upi'} disabled={!paymentConfig?.enabled || busy} onChange={() => setPaymentMethod('upi')} className="mt-1 accent-[#104c38]" />
                  <QrCode className="mt-0.5 h-5 w-5 shrink-0 text-[#104c38]" />
                  <span><span className="block text-sm font-semibold text-[#173e30]">UPI / Scan QR</span><span className="mt-0.5 block text-xs leading-5 text-[#3A281C]/65">Pay securely with UPI apps. Desktop shows a scan-to-pay QR.</span>{!paymentConfig?.enabled && <span className="mt-1 block text-[11px] text-amber-800">Gateway keys are not configured yet.</span>}</span>
                </label>
                <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${paymentMethod === 'cod' ? 'border-[#104c38] bg-white ring-1 ring-[#104c38]' : 'border-[#d9e3d8] bg-white/60'}`}>
                  <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} disabled={busy} onChange={() => setPaymentMethod('cod')} className="mt-1 accent-[#104c38]" />
                  <Banknote className="mt-0.5 h-5 w-5 shrink-0 text-[#104c38]" />
                  <span><span className="block text-sm font-semibold text-[#173e30]">Cash on Delivery</span><span className="mt-0.5 block text-xs leading-5 text-[#3A281C]/65">Pay the delivery person when your tea arrives.</span></span>
                </label>
              </div>
            </div>
            {message && <div role="alert" className="mt-4 flex items-start gap-2 rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{message}</div>}
          </section>
          <aside className="h-fit rounded-xl border border-[#C9A86A]/20 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <h2 className="mb-5 text-lg font-semibold text-[#3A281C]">Order summary</h2>
            <div className="mb-5 space-y-3">{cartItems.map((item) => <div key={`${item.productId}-${item.weightGrams}`} className="flex justify-between gap-3 text-sm"><span className="text-[#3A281C]/70">{item.product.name} · {item.weight || item.product.weight} × {item.quantity}</span><span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span></div>)}</div>
            <div className="space-y-3 border-t border-[#C9A86A]/20 pt-4 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div><div className="flex justify-between"><span>Shipping</span><span>{shipping ? `₹${shipping}` : 'Free'}</span></div><div className="flex justify-between border-t border-[#C9A86A]/20 pt-3 text-base font-bold"><span>Total*</span><span>₹{(subtotal + shipping).toLocaleString('en-IN')}</span></div></div>
            <button type="submit" disabled={busy || (paymentMethod === 'upi' && paymentConfig === null)} className="mt-6 flex w-full items-center justify-center gap-2 rounded bg-[#104c38] py-4 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-[#0b3c2c] disabled:cursor-not-allowed disabled:opacity-60">{busy ? paymentMethod === 'cod' ? 'Placing order…' : 'Opening secure checkout…' : paymentMethod === 'cod' ? 'Place COD order' : paymentConfig === null ? 'Loading checkout…' : 'Continue with UPI'}</button>
            {paymentMethod === 'upi' && paymentConfig?.enabled ? <p className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-[#3A281C]/60"><ShieldCheck className="h-4 w-4" />UPI and QR payments are verified by Razorpay. Final total is calculated by the server.</p> : paymentMethod === 'cod' ? <p className="mt-3 text-center text-xs text-[#3A281C]/60">Your order is confirmed now; payment is due when it is delivered.</p> : <p className="mt-3 text-center text-xs text-[#3A281C]/60">UPI checkout will be enabled after Razorpay credentials are configured.</p>}
            <p className="mt-2 text-[11px] text-[#3A281C]/50">*Shipping/tax totals are confirmed by the server before payment.</p>
          </aside>
        </form>
      </div>
    </motion.main>
  );
}
