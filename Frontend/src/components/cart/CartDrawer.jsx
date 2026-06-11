import { motion } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  selectCartOpen,
  closeCart,
  selectCartItems,
  removeFromCart,
  updateQuantity,
  selectCartTotal,
} from '../../store/cartSlice';
import { products } from '../../assets/data';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector(selectCartOpen);
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const shipping = subtotal > 100 ? 0 : 12;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const cartItems = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return { ...item, product };
    })
    .filter((item) => item.product);

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleUpdateQuantity = (productId, qty) => {
    dispatch(updateQuantity({ productId, quantity: qty }));
  };

  const handleCheckout = () => {
    dispatch(closeCart());
    navigate('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-deep-walnut/40 z-50"
          onClick={() => dispatch(closeCart())}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-warm-ivory z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-imperial-gold/10">
          <h2 className="font-[family-name:var(--font-playfair)] font-bold text-deep-walnut text-lg">
            Your Cart ({cartItems.length})
          </h2>
          <button
            onClick={() => dispatch(closeCart())}
            className="w-8 h-8 rounded-full hover:bg-deep-walnut/5 flex items-center justify-center"
          >
            <X className="h-4 w-4 text-deep-walnut/60" />
          </button>
        </div>

        {/* Cart Items */}
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <ShoppingBag className="h-12 w-12 text-deep-walnut/20 mb-4" />
            <p className="font-[family-name:var(--font-playfair)] text-deep-walnut font-semibold mb-2">
              Your cart is empty
            </p>
            <p className="text-deep-walnut/50 text-xs font-[family-name:var(--font-inter)] mb-6 text-center">
              Discover our exquisite tea collection and add your favorites.
            </p>
            <button
              onClick={() => {
                dispatch(closeCart());
                navigate('/shop');
              }}
              className="bg-tea-green hover:bg-tea-green-light text-warm-ivory text-xs uppercase tracking-wider px-6 py-3 transition-colors"
            >
              Browse Collection
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.map((item) => (
                <motion.div
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex gap-4 bg-white p-3 rounded-sm border border-imperial-gold/10"
                >
                  <div
                    className={`w-16 h-20 rounded-sm bg-gradient-to-br ${item.product.gradient} flex-shrink-0 cursor-pointer`}
                    onClick={() => {
                      dispatch(closeCart());
                      navigate(`/product/${item.product.slug}`);
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-sm truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-deep-walnut/40 text-[10px] font-[family-name:var(--font-inter)]">
                      {item.product.weight}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-imperial-gold/20 rounded-sm">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.productId,
                              item.quantity - 1
                            )
                          }
                          className="w-7 h-7 flex items-center justify-center"
                        >
                          <Minus className="h-3 w-3 text-deep-walnut/60" />
                        </button>
                        <span className="w-7 text-center text-xs font-medium font-[family-name:var(--font-inter)]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.productId,
                              item.quantity + 1
                            )
                          }
                          className="w-7 h-7 flex items-center justify-center"
                        >
                          <Plus className="h-3 w-3 text-deep-walnut/60" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-deep-walnut text-sm">
                          ${item.product.price * item.quantity}
                        </span>
                        <button
                          onClick={() => handleRemove(item.productId)}
                          className="text-deep-walnut/30 hover:text-royal-terracotta transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-imperial-gold/10 p-6 space-y-3 bg-warm-ivory">
              <div className="flex justify-between text-xs font-[family-name:var(--font-inter)]">
                <span className="text-deep-walnut/50">Subtotal</span>
                <span className="text-deep-walnut">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs font-[family-name:var(--font-inter)]">
                <span className="text-deep-walnut/50">Shipping</span>
                <span className="text-deep-walnut">
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-xs font-[family-name:var(--font-inter)]">
                <span className="text-deep-walnut/50">Tax</span>
                <span className="text-deep-walnut">${tax.toFixed(2)}</span>
              </div>
              <div className="h-px bg-imperial-gold/10" />
              <div className="flex justify-between">
                <span className="font-[family-name:var(--font-playfair)] font-bold text-deep-walnut">
                  Total
                </span>
                <span className="font-[family-name:var(--font-playfair)] font-bold text-deep-walnut">
                  ${total.toFixed(2)}
                </span>
              </div>
              {subtotal < 100 && (
                <p className="text-imperial-gold text-[10px] font-[family-name:var(--font-inter)] text-center">
                  Add ${(100 - subtotal).toFixed(2)} more for free shipping
                </p>
              )}
              <button
                onClick={handleCheckout}
                className="w-full bg-tea-green hover:bg-tea-green-light text-warm-ivory py-4 text-xs font-semibold uppercase tracking-widest rounded-none flex items-center justify-center gap-2 transition-colors"
              >
                Checkout <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  dispatch(closeCart());
                  navigate('/shop');
                }}
                className="w-full text-center text-deep-walnut/50 text-xs font-[family-name:var(--font-inter)] hover:text-deep-walnut transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
