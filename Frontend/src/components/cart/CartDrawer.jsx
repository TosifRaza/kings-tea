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

const gradientMap = {
  'from-amber-800 to-amber-600': 'bg-gradient-to-br from-amber-800 to-amber-600',
  'from-amber-900 to-amber-700': 'bg-gradient-to-br from-amber-900 to-amber-700',
  'from-emerald-700 to-emerald-500': 'bg-gradient-to-br from-emerald-700 to-emerald-500',
  'from-green-600 to-green-400': 'bg-gradient-to-br from-green-600 to-green-400',
  'from-green-700 to-green-500': 'bg-gradient-to-br from-green-700 to-green-500',
  'from-amber-700 to-yellow-600': 'bg-gradient-to-br from-amber-700 to-yellow-600',
  'from-amber-700 to-amber-500': 'bg-gradient-to-br from-amber-700 to-amber-500',
  'from-emerald-800 to-emerald-600': 'bg-gradient-to-br from-emerald-800 to-emerald-600',
  'from-red-900 to-red-700': 'bg-gradient-to-br from-red-900 to-red-700',
  'from-red-800 to-red-600': 'bg-gradient-to-br from-red-800 to-red-600',
  'from-orange-600 to-amber-400': 'bg-gradient-to-br from-orange-600 to-amber-400',
  'from-green-800 to-green-600': 'bg-gradient-to-br from-green-800 to-green-600',
  'from-green-500 to-green-300': 'bg-gradient-to-br from-green-500 to-green-300',
  'from-gray-300 to-gray-100': 'bg-gradient-to-br from-gray-300 to-gray-100',
  'from-pink-100 to-white': 'bg-gradient-to-br from-pink-100 to-white',
};

export default function CartDrawer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector(selectCartOpen);
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const { products } = useSelector((state) => state.products);

  const shipping = subtotal > 1000 ? 0 : 99;
  const total = subtotal + shipping;

  // Match cart items to products from Redux store (not empty static data)
  const cartItems = items
    .map((item) => {
      const product = (products || []).find(
        (p) => (p._id || p.id) === item.productId
      );
      return { ...item, product };
    })
    .filter((item) => item.product);

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleUpdateQuantity = (productId, qty) => {
    if (qty < 1) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateQuantity({ productId, quantity: qty }));
    }
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
          className="fixed inset-0 bg-[#3A281C]/40 z-50"
          onClick={() => dispatch(closeCart())}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#F8F3E9] z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#C9A86A]/10">
          <h2 className="font-bold text-[#3A281C] text-lg">
            Your Cart ({cartItems.length})
          </h2>
          <button
            onClick={() => dispatch(closeCart())}
            className="w-8 h-8 rounded-full hover:bg-[#3A281C]/5 flex items-center justify-center"
          >
            <X className="h-4 w-4 text-[#3A281C]/60" />
          </button>
        </div>

        {/* Cart Items */}
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <ShoppingBag className="h-12 w-12 text-[#3A281C]/20 mb-4" />
            <p className="font-semibold text-[#3A281C] mb-2">
              Your cart is empty
            </p>
            <p className="text-[#3A281C]/50 text-xs mb-6 text-center">
              Discover our exquisite tea collection and add your favorites.
            </p>
            <button
              onClick={() => {
                dispatch(closeCart());
                navigate('/shop');
              }}
              className="bg-[#1F4D3A] hover:bg-[#1F4D3A]/90 text-[#F8F3E9] text-xs uppercase tracking-wider px-6 py-3 transition-colors"
            >
              Browse Collection
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.map((item) => {
                const gradient = item.product.gradientColor
                  ? (gradientMap[item.product.gradientColor] || 'bg-gradient-to-br from-[#1F4D3A] to-[#1F4D3A]/70')
                  : 'bg-gradient-to-br from-[#1F4D3A] to-[#1F4D3A]/70';

                return (
                  <motion.div
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 bg-white p-3 rounded-sm border border-[#C9A86A]/10"
                  >
                    <div
                      className={`w-16 h-20 rounded-sm ${gradient} flex-shrink-0 cursor-pointer flex items-center justify-center`}
                      onClick={() => {
                        dispatch(closeCart());
                        navigate(`/product/${item.product.slug}`);
                      }}
                    >
                      {item.product.images && item.product.images.length > 0 ? (
                        <img
                          src={`http://localhost:5000${item.product.images[0]}`}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-sm"
                        />
                      ) : (
                        <span className="text-white/30 text-xl font-bold">
                          {item.product.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[#3A281C] text-sm truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[#3A281C]/40 text-[10px]">
                        {item.product.weight}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-[#C9A86A]/20 rounded-sm">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId,
                                item.quantity - 1
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center"
                          >
                            <Minus className="h-3 w-3 text-[#3A281C]/60" />
                          </button>
                          <span className="w-7 text-center text-xs font-medium">
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
                            <Plus className="h-3 w-3 text-[#3A281C]/60" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#3A281C] text-sm">
                            ₹{(item.product.price * item.quantity)?.toLocaleString()}
                          </span>
                          <button
                            onClick={() => handleRemove(item.productId)}
                            className="text-[#3A281C]/30 hover:text-[#A65A3A] transition-colors"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-[#C9A86A]/10 p-6 space-y-3 bg-[#F8F3E9]">
              <div className="flex justify-between text-xs">
                <span className="text-[#3A281C]/50">Subtotal</span>
                <span className="text-[#3A281C]">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#3A281C]/50">Shipping</span>
                <span className="text-[#3A281C]">
                  {shipping === 0 ? 'Free' : `₹${shipping}`}
                </span>
              </div>
              <div className="h-px bg-[#C9A86A]/10" />
              <div className="flex justify-between">
                <span className="font-bold text-[#3A281C]">Total</span>
                <span className="font-bold text-[#3A281C]">₹{total.toLocaleString()}</span>
              </div>
              {subtotal < 1000 && (
                <p className="text-[#C9A86A] text-[10px] text-center">
                  Add ₹{(1000 - subtotal).toLocaleString()} more for free shipping
                </p>
              )}
              <button
                onClick={handleCheckout}
                className="w-full bg-[#1F4D3A] hover:bg-[#1F4D3A]/90 text-[#F8F3E9] py-4 text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
              >
                Checkout <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  dispatch(closeCart());
                  navigate('/shop');
                }}
                className="w-full text-center text-[#3A281C]/50 text-xs hover:text-[#3A281C] transition-colors"
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