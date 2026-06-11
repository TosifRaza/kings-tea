import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import DataTable from '../components/DataTable';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/api';

const CategoryManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', image: '' });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      const data = res.data;
      setCategories(Array.isArray(data) ? data : data.categories || []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', image: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      description: category.description || '',
      image: category.image || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, formData);
      } else {
        await createCategory(formData);
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      setDeleteConfirm(null);
      loadCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Category Name',
      render: (value) => (
        <span className="font-medium text-deep-walnut">{value}</span>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (value) => (
        <span className="text-deep-walnut/60 text-sm line-clamp-2 max-w-xs">
          {value || '—'}
        </span>
      ),
    },
    {
      key: 'productCount',
      label: 'Products',
      render: (value) => (
        <span className="text-deep-walnut font-medium">
          {value || 0}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-walnut font-playfair">
            Categories
          </h1>
          <p className="text-sm text-deep-walnut/50 mt-1">
            Manage product categories
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-tea-green text-warm-ivory text-sm font-semibold rounded-lg hover:bg-tea-green/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={categories}
        loading={loading}
        emptyMessage="No categories found. Add your first category!"
        searchPlaceholder="Search categories..."
        actions={(row) => (
          <>
            <button
              onClick={() => handleEdit(row)}
              className="p-2 rounded-lg hover:bg-imperial-gold/10 text-imperial-gold transition-colors"
              title="Edit"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeleteConfirm(row._id)}
              className="p-2 rounded-lg hover:bg-royal-terracotta/10 text-royal-terracotta transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      />

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-imperial-gold/10">
                <h2 className="text-lg font-semibold text-deep-walnut font-playfair">
                  {editingCategory ? 'Edit Category' : 'Add Category'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-warm-ivory transition-colors"
                >
                  <X className="w-5 h-5 text-deep-walnut/60" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-deep-walnut mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                    className="w-full px-3 py-2 text-sm border border-imperial-gold/20 rounded-lg bg-warm-ivory/50 text-deep-walnut focus:outline-none focus:ring-2 focus:ring-tea-green/30 focus:border-tea-green"
                    placeholder="e.g. Black Tea"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep-walnut mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-imperial-gold/20 rounded-lg bg-warm-ivory/50 text-deep-walnut focus:outline-none focus:ring-2 focus:ring-tea-green/30 focus:border-tea-green resize-none"
                    placeholder="Category description..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep-walnut mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, image: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-sm border border-imperial-gold/20 rounded-lg bg-warm-ivory/50 text-deep-walnut focus:outline-none focus:ring-2 focus:ring-tea-green/30 focus:border-tea-green"
                    placeholder="https://..."
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-imperial-gold/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-deep-walnut/60 border border-imperial-gold/20 rounded-lg hover:bg-warm-ivory transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-warm-ivory bg-tea-green rounded-lg hover:bg-tea-green/90 transition-colors"
                  >
                    {editingCategory ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-deep-walnut font-playfair">
                  Delete Category
                </h3>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="p-1 rounded-lg hover:bg-warm-ivory"
                >
                  <X className="w-5 h-5 text-deep-walnut/50" />
                </button>
              </div>
              <p className="text-sm text-deep-walnut/60 mb-6">
                Are you sure? This will remove the category and may affect
                associated products.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-sm font-medium text-deep-walnut/60 border border-imperial-gold/20 rounded-lg hover:bg-warm-ivory transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 text-sm font-medium text-warm-ivory bg-royal-terracotta rounded-lg hover:bg-royal-terracotta/90 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryManagementPage;
