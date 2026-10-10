import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ShoppingBag, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCartNotification, openCart, selectCartNotification } from '../../store/cartSlice';

export default function CartNotification() {
  const dispatch = useDispatch();
  const notification = useSelector(selectCartNotification);

  useEffect(() => {
    if (!notification) return undefined;
    const timeout = window.setTimeout(() => {
      dispatch(clearCartNotification(notification.id));
    }, 3500);
    return () => window.clearTimeout(timeout);
  }, [dispatch, notification]);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          key={notification.id}
          role="alert"
          aria-live="assertive"
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.18 }}
          className="fixed left-3 right-3 top-20 z-[70] mx-auto flex max-w-sm items-center gap-3 rounded-2xl border border-emerald-100 bg-white p-3.5 shadow-[0_14px_40px_rgba(20,55,39,0.22)] sm:left-auto sm:right-5 sm:top-24 sm:w-96"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f4ec] text-[#0b6948]">
            <Check className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#173b2c]">Added to your cart</p>
            <p className="truncate text-xs text-[#61756d]">
              {notification.productName} · Qty {notification.quantity}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              dispatch(clearCartNotification(notification.id));
              dispatch(openCart());
            }}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#0b6948] px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-[#07543d]"
          >
            <ShoppingBag className="h-3.5 w-3.5" /> Cart
          </button>
          <button
            type="button"
            aria-label="Dismiss cart notification"
            onClick={() => dispatch(clearCartNotification(notification.id))}
            className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-[#e8e6dc] bg-white text-[#61756d] shadow-sm"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
