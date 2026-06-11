import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, removeProduct } from '../store/productSlice';
import ProductFormModal from '../components/ProductFormModal';
import { Plus, Search, Edit2, Trash2, Package, Star } from 'lucide-react';

const ProductManagementPage = () => {
  const dispatch = useDispatch();
  const { items: products, totalCount, loading } = useSelector((state) => state.products);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAdd = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await dispatch(removeProduct(id));
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-playfair font-bold text-deep-walnut">Products</h1>
          <p className="text-sm text-deep-walnut/50 mt-1">{totalCount} total products</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-tea-green text-warm-ivory text-sm font-medium rounded-lg hover:bg-tea-green/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-deep-walnut/30" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-imperial-gold/20 rounded-lg bg-white text-deep-walnut focus:outline-none focus:ring-2 focus:ring-imperial-gold/30"
        />
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-imperial-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-deep-walnut/40 text-sm">Loading products...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl border border-imperial-gold/10 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Product Image Placeholder */}
              <div className="h-40 bg-warm-ivory flex items-center justify-center">
                <Package className="w-12 h-12 text-imperial-gold/30" />
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-deep-walnut truncate">{product.name}</h3>
                    <p className="text-xs text-deep-walnut/40 mt-0.5">{product.category} · {product.origin}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Star className="w-3.5 h-3.5 text-imperial-gold fill-imperial-gold" />
                    <span className="text-xs font-medium text-deep-walnut">{product.rating || '—'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <span className="text-lg font-bold text-deep-walnut">${product.price}</span>
                  {product.comparePrice && (
                    <span className="text-sm text-deep-walnut/40 line-through">${product.comparePrice}</span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {product.featured && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-imperial-gold/10 text-imperial-gold font-medium">Featured</span>
                  )}
                  {product.bestSeller && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-tea-green/10 text-tea-green font-medium">Best Seller</span>
                  )}
                  {product.isNew && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-medium">New</span>
                  )}
                  {product.inStock ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">In Stock</span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 font-medium">Out of Stock</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-imperial-gold/5">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-deep-walnut/60 hover:text-tea-green border border-imperial-gold/10 rounded-lg hover:border-tea-green/20 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-deep-walnut/60 hover:text-royal-terracotta border border-imperial-gold/10 rounded-lg hover:border-royal-terracotta/20 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-imperial-gold/10">
          <Package className="w-16 h-16 text-imperial-gold/20 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-deep-walnut/40">No products found</h3>
          <p className="text-sm text-deep-walnut/30 mt-1">
            {searchTerm ? 'Try a different search term' : 'Add your first product or seed the database'}
          </p>
          {!searchTerm && (
            <button
              onClick={handleAdd}
              className="mt-4 px-4 py-2 bg-tea-green text-warm-ivory text-sm font-medium rounded-lg hover:bg-tea-green/90 transition-colors"
            >
              Add Product
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ProductFormModal
          product={editingProduct}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default ProductManagementPage;