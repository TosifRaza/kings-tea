import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, editProduct } from '../store/productSlice';
import { getCategories } from '../services/api';
import { getAdminImageUrl, getTeaCategoryGallery } from '../utils/teaImages';
import { X, Upload, Image as ImageIcon, Link2, Search } from 'lucide-react';

const ProductFormModal = ({ product, products = [], onClose }) => {
  const dispatch = useDispatch();
  const isEdit = !!product;

  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [relatedSearch, setRelatedSearch] = useState('');
  const [relatedProducts, setRelatedProducts] = useState(
    (product?.relatedProducts || []).map((related) => String(related?._id || related))
  );
  const [imageItems, setImageItems] = useState(
    (product?.images || []).map((path) => ({ path, preview: path }))
  );
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    price: product?.price || '',
    comparePrice: product?.comparePrice || '',
    category: product?.category || '',
    categoryId: product?.categoryId || '',
    description: product?.description || '',
    shortDescription: product?.shortDescription || '',
    origin: product?.origin || '',
    fermentation: product?.fermentation || 'none',
    season: product?.season || 'spring',
    tastingNotes: product?.tastingNotes?.join(', ') || '',
    weight: product?.weight || '',
    caffeine: product?.caffeine || 'medium',
    stockQuantity: product?.stockQuantity || '',
    inStock: product?.inStock !== undefined ? product.inStock : true,
    featured: product?.featured || false,
    bestSeller: product?.bestSeller || false,
    isNew: product?.isNew || false,
    images: product?.images || [],
  });

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        const cats = response.data.data;
        if (Array.isArray(cats)) {
          setCategories(cats);
        } else if (cats && Array.isArray(cats.categories)) {
          setCategories(cats.categories);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Auto-generate slug from name
    if (name === 'name') {
      setFormData((prev) => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      }));
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = categories.find(c => c._id === e.target.value);
    setFormData((prev) => ({
      ...prev,
      categoryId: e.target.value,
      category: selectedCategory?.name || '',
    }));
  };

  // const handleImageUpload = (e) => {
  //   const files = Array.from(e.target.files);
  //   if (files.length === 0) return;

  //   setUploading(true);

  //   // Create preview URLs and store file objects
  //   const newPreviews = [];
  //   const newImagePaths = [...formData.images];

  //   files.forEach((file) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       newPreviews.push(reader.result);
  //       // Store a path reference (in production, upload to cloud storage)
  //       const imagePath = `/images/products/${file.name}`;
  //       newImagePaths.push(imagePath);

  //       if (newPreviews.length === files.length) {
  //         setImagePreviews((prev) => [...prev, ...newPreviews]);
  //         setFormData((prev) => ({
  //           ...prev,
  //           images: newImagePaths,
  //         }));
  //         setUploading(false);
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   });

  //   // If no files were processed
  //   if (files.length === 0) {
  //     setUploading(false);
  //   }
  // };
  

  // const removeImage = (index) => {
  //   setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  //   setFormData((prev) => ({
  //     ...prev,
  //     images: prev.images.filter((_, i) => i !== index),
  //   }));
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const productData = {
  //     ...formData,
  //     price: Number(formData.price),
  //     comparePrice: formData.comparePrice ? Number(formData.comparePrice) : undefined,
  //     stockQuantity: Number(formData.stockQuantity),
  //     tastingNotes: formData.tastingNotes
  //       ? formData.tastingNotes.split(',').map((t) => t.trim())
  //       : [],
  //     rating: product?.rating || 0,
  //     reviewCount: product?.reviewCount || 0,
  //   };

  //   if (isEdit) {
  //     await dispatch(editProduct({ id: product._id, data: productData }));
  //   } else {
  //     await dispatch(addProduct(productData));
  //   }
  //   onClose();
  // };
  // Replace handleImageUpload with this:


  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, Math.max(0, 4 - imageItems.length));
    e.target.value = '';
    if (files.length === 0) return;

    setUploading(true);
    setImageItems((prev) => [
      ...prev,
      ...files.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ]);
    setUploading(false);
  };

  const removeImage = (index) => {
    setImageItems((prev) => prev.filter((_, i) => i !== index));
  };

  const useCategoryGallery = () => {
    const gallery = getTeaCategoryGallery(formData.category);
    if (gallery.length === 0) return;
    setImageItems(gallery.map((path) => ({ path, preview: path })));
  };

  const toggleRelatedProduct = (id) => {
    setRelatedProducts((current) => current.includes(id)
      ? current.filter((relatedId) => relatedId !== id)
      : current.length < 10 ? [...current, id] : current);
  };

  const availableRelatedProducts = products
    .filter((candidate) => String(candidate._id) !== String(product?._id))
    .filter((candidate) => candidate.name?.toLowerCase().includes(relatedSearch.toLowerCase()));

  // Replace handleSubmit with this:
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSubmitError('');

    // Use FormData for file uploads
    const data = new FormData();
    data.append('name', formData.name);
    data.append('slug', formData.slug);
    data.append('price', Number(formData.price));
    if (formData.comparePrice) data.append('comparePrice', Number(formData.comparePrice));
    data.append('category', formData.categoryId);
    data.append('description', formData.description);
    if (formData.shortDescription) data.append('shortDescription', formData.shortDescription);
    if (formData.origin) data.append('origin', formData.origin);
    data.append('fermentation', formData.fermentation);
    data.append('season', formData.season);
    if (formData.tastingNotes) {
      formData.tastingNotes.split(',').map((t) => t.trim()).forEach((note) => {
        data.append('tastingNotes', note);
      });
    }
    if (formData.weight) data.append('weight', formData.weight);
    data.append('caffeine', formData.caffeine);
    data.append('stock', Number(formData.stockQuantity));
    data.append('inStock', formData.inStock);
    data.append('featured', formData.featured);
    data.append('bestSeller', formData.bestSeller);
    data.append('isNew', formData.isNew);
    data.append('relatedProducts', JSON.stringify(relatedProducts));

    data.append('galleryImages', JSON.stringify(
      imageItems.filter((item) => item.path).map((item) => item.path)
    ));

    // Append uploaded files alongside any selected existing image paths.
    imageItems.filter((item) => item.file).forEach((item) => {
      data.append('images', item.file);
    });

    try {
      if (isEdit) {
        await dispatch(editProduct({ id: product._id, data })).unwrap();
      } else {
        await dispatch(addProduct(data)).unwrap();
      }
      onClose();
    } catch (error) {
      setSubmitError(typeof error === 'string' ? error : 'The product could not be saved. Please try again.');
    } finally {
      setSaving(false);
    }
  };



  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-imperial-gold/10 sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-lg font-playfair font-semibold text-deep-walnut">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-warm-ivory transition-colors text-deep-walnut/40 hover:text-deep-walnut"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-deep-walnut/70 mb-1.5">
              Product Name <span className="text-royal-terracotta">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 text-sm border border-imperial-gold/20 rounded-lg bg-white text-deep-walnut focus:outline-none focus:ring-2 focus:ring-imperial-gold/30 focus:border-imperial-gold"
              placeholder="e.g., Imperial Dragon Well"
            />
          </div>

          {/* Price Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-deep-walnut/70 mb-1.5">
                Price ($) <span className="text-royal-terracotta">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 text-sm border border-imperial-gold/20 rounded-lg bg-white text-deep-walnut focus:outline-none focus:ring-2 focus:ring-imperial-gold/30 focus:border-imperial-gold"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-deep-walnut/70 mb-1.5">
                Compare Price ($)
              </label>
              <input
                type="number"
                name="comparePrice"
                value={formData.comparePrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 text-sm border border-imperial-gold/20 rounded-lg bg-white text-deep-walnut focus:outline-none focus:ring-2 focus:ring-imperial-gold/30 focus:border-imperial-gold"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-deep-walnut/70 mb-1.5">
              Category <span className="text-royal-terracotta">*</span>
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleCategoryChange}
              required
              className="w-full px-4 py-2.5 text-sm border border-imperial-gold/20 rounded-lg bg-white text-deep-walnut focus:outline-none focus:ring-2 focus:ring-imperial-gold/30 focus:border-imperial-gold"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <p className="text-xs text-royal-terracotta mt-1">
                No categories found. Please seed the database first.
              </p>
            )}
          </div>

          {/* Stock & Weight Row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-deep-walnut/70 mb-1.5">
                Stock <span className="text-royal-terracotta">*</span>
              </label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2.5 text-sm border border-imperial-gold/20 rounded-lg bg-white text-deep-walnut focus:outline-none focus:ring-2 focus:ring-imperial-gold/30 focus:border-imperial-gold"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-deep-walnut/70 mb-1.5">
                Weight
              </label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm border border-imperial-gold/20 rounded-lg bg-white text-deep-walnut focus:outline-none focus:ring-2 focus:ring-imperial-gold/30 focus:border-imperial-gold"
                placeholder="e.g., 100g"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-deep-walnut/70 mb-1.5">
                Origin
              </label>
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm border border-imperial-gold/20 rounded-lg bg-white text-deep-walnut focus:outline-none focus:ring-2 focus:ring-imperial-gold/30 focus:border-imperial-gold"
                placeholder="e.g., Darjeeling"
              />
            </div>
          </div>

          {/* Tea Details Row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-deep-walnut/70 mb-1.5">
                Fermentation
              </label>
              <select
                name="fermentation"
                value={formData.fermentation}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm border border-imperial-gold/20 rounded-lg bg-white text-deep-walnut focus:outline-none focus:ring-2 focus:ring-imperial-gold/30 focus:border-imperial-gold"
              >
                <option value="none">None</option>
                <option value="light">Light</option>
                <option value="medium">Medium</option>
                <option value="full">Full</option>
                <option value="post-fermented">Post-fermented</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-deep-walnut/70 mb-1.5">
                Season
              </label>
              <select
                name="season"
                value={formData.season}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm border border-imperial-gold/20 rounded-lg bg-white text-deep-walnut focus:outline-none focus:ring-2 focus:ring-imperial-gold/30 focus:border-imperial-gold"
              >
                <option value="spring">Spring</option>
                <option value="summer">Summer</option>
                <option value="autumn">Autumn</option>
                <option value="winter">Winter</option>
                <option value="year-round">Year-round</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-deep-walnut/70 mb-1.5">
                Caffeine
              </label>
              <select
                name="caffeine"
                value={formData.caffeine}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm border border-imperial-gold/20 rounded-lg bg-white text-deep-walnut focus:outline-none focus:ring-2 focus:ring-imperial-gold/30 focus:border-imperial-gold"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Tasting Notes */}
          <div>
            <label className="block text-sm font-medium text-deep-walnut/70 mb-1.5">
              Tasting Notes
            </label>
            <input
              type="text"
              name="tastingNotes"
              value={formData.tastingNotes}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm border border-imperial-gold/20 rounded-lg bg-white text-deep-walnut focus:outline-none focus:ring-2 focus:ring-imperial-gold/30 focus:border-imperial-gold"
              placeholder="e.g., Sweet chestnut, Orchid, Honey (comma separated)"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-deep-walnut/70 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 text-sm border border-imperial-gold/20 rounded-lg bg-white text-deep-walnut focus:outline-none focus:ring-2 focus:ring-imperial-gold/30 focus:border-imperial-gold resize-none"
              placeholder="Product description..."
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-deep-walnut/70 mb-1.5">
              Short Description
            </label>
            <textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2.5 text-sm border border-imperial-gold/20 rounded-lg bg-white text-deep-walnut focus:outline-none focus:ring-2 focus:ring-imperial-gold/30 focus:border-imperial-gold resize-none"
              placeholder="Brief product summary..."
            />
          </div>

          {/* Related Products */}
          <section className="rounded-xl border border-imperial-gold/15 bg-[#FBF9F4] p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-tea-green/10 text-tea-green"><Link2 className="h-4 w-4" /></div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-deep-walnut">Related products</h3>
                <p className="mt-1 text-xs leading-5 text-deep-walnut/50">Choose up to 10 teas to recommend on this product page. Leave empty to show category matches followed by other teas.</p>
              </div>
              <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-tea-green">{relatedProducts.length}/10</span>
            </div>
            <div className="relative mt-4">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-deep-walnut/30" />
              <input value={relatedSearch} onChange={(event) => setRelatedSearch(event.target.value)} className="w-full rounded-lg border border-imperial-gold/15 bg-white py-2.5 pl-9 pr-3 text-sm text-deep-walnut outline-none focus:border-tea-green/40" placeholder="Find a product..." />
            </div>
            <div className="mt-3 max-h-56 space-y-1 overflow-y-auto rounded-lg border border-imperial-gold/10 bg-white p-2">
              {availableRelatedProducts.length ? availableRelatedProducts.map((candidate) => {
                const id = String(candidate._id);
                const checked = relatedProducts.includes(id);
                const disabled = !checked && relatedProducts.length >= 10;
                return (
                  <label key={id} className={`flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 transition ${checked ? 'bg-tea-green/5' : 'hover:bg-warm-ivory'} ${disabled ? 'cursor-not-allowed opacity-45' : ''}`}>
                    <input type="checkbox" checked={checked} disabled={disabled} onChange={() => toggleRelatedProduct(id)} className="h-4 w-4 rounded border-imperial-gold/30 text-tea-green focus:ring-tea-green" />
                    {candidate.images?.[0] ? <img src={getAdminImageUrl(candidate.images[0])} alt="" className="h-10 w-10 rounded-md object-cover" /> : <div className="flex h-10 w-10 items-center justify-center rounded-md bg-warm-ivory text-xs font-semibold text-tea-green">{candidate.name?.charAt(0)}</div>}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-deep-walnut">{candidate.name}</span>
                      <span className="block truncate text-xs text-deep-walnut/45">{candidate.category || 'Tea'} · Rs. {Number(candidate.price || 0).toLocaleString('en-IN')}</span>
                    </span>
                  </label>
                );
              }) : <p className="px-3 py-5 text-center text-xs text-deep-walnut/45">No matching products found.</p>}
            </div>
          </section>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-deep-walnut/70 mb-1.5">
              Product Images
            </label>
            <div className="border-2 border-dashed border-imperial-gold/20 rounded-lg p-6 text-center hover:border-imperial-gold/40 transition-colors">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                disabled={imageItems.length >= 4}
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-8 h-8 text-imperial-gold/40 mb-2" />
                <span className="text-sm font-medium text-deep-walnut/60">
                  {uploading ? 'Uploading...' : imageItems.length >= 4 ? 'Four images selected' : 'Click to upload images'}
                </span>
                <span className="text-xs text-deep-walnut/40 mt-1">Choose up to {4 - imageItems.length} more · PNG, JPG, WebP up to 5MB</span>
              </label>
            </div>

            {getTeaCategoryGallery(formData.category).length === 4 && (
              <button
                type="button"
                onClick={useCategoryGallery}
                className="mt-3 text-xs font-medium text-tea-green hover:underline"
              >
                Use the downloaded {formData.category} photo set (4 images)
              </button>
            )}

            {/* Image Previews */}
            {imageItems.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {imageItems.map((item, index) => (
                  <div key={index} className="relative group rounded-lg overflow-hidden border border-imperial-gold/10">
                    <img
                      src={getAdminImageUrl(item.preview)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '';
                        e.target.parentElement.innerHTML = '<div class="w-full h-20 bg-warm-ivory flex items-center justify-center"><svg class="w-6 h-6 text-deep-walnut/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                className="w-4 h-4 text-tea-green border-imperial-gold/30 rounded focus:ring-tea-green"
              />
              <span className="text-sm text-deep-walnut/70">In Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 text-tea-green border-imperial-gold/30 rounded focus:ring-tea-green"
              />
              <span className="text-sm text-deep-walnut/70">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="bestSeller"
                checked={formData.bestSeller}
                onChange={handleChange}
                className="w-4 h-4 text-tea-green border-imperial-gold/30 rounded focus:ring-tea-green"
              />
              <span className="text-sm text-deep-walnut/70">Best Seller</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isNew"
                checked={formData.isNew}
                onChange={handleChange}
                className="w-4 h-4 text-tea-green border-imperial-gold/30 rounded focus:ring-tea-green"
              />
              <span className="text-sm text-deep-walnut/70">New Arrival</span>
            </label>
          </div>

          {/* Buttons */}
          {submitError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-imperial-gold/5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-deep-walnut/60 hover:text-deep-walnut border border-imperial-gold/20 rounded-lg hover:bg-warm-ivory transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 text-sm font-medium text-warm-ivory bg-tea-green rounded-lg hover:bg-tea-green/90 transition-colors"
            >
              {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
