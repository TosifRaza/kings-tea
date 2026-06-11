import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Globe, FileText } from 'lucide-react';
import DataTable from '../components/DataTable';
import {
  getBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from '../services/api';

const BlogManagementPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    published: false,
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await getBlogPosts();
      const data = res.data;
      setPosts(Array.isArray(data) ? data : data.posts || data.items || []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: '',
      published: false,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      category: post.category || '',
      published: post.published || false,
    });
    setIsModalOpen(true);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title) => {
    setFormData((prev) => ({ ...prev, title, slug: generateSlug(title) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPost) {
        await updateBlogPost(editingPost._id, formData);
      } else {
        await createBlogPost(formData);
      }
      setIsModalOpen(false);
      loadPosts();
    } catch (error) {
      console.error('Failed to save blog post:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBlogPost(id);
      setDeleteConfirm(null);
      loadPosts();
    } catch (error) {
      console.error('Failed to delete blog post:', error);
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (value, row) => (
        <div>
          <p className="font-medium text-deep-walnut">{value}</p>
          <p className="text-xs text-deep-walnut/40 flex items-center gap-1 mt-0.5">
            <Globe className="w-3 h-3" />
            /{row.slug || '—'}
          </p>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (value) => (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-tea-green/10 text-tea-green">
          {typeof value === 'object' ? value?.name : value || '—'}
        </span>
      ),
    },
    {
      key: 'published',
      label: 'Status',
      render: (value) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            value
              ? 'bg-tea-green/10 text-tea-green'
              : 'bg-imperial-gold/10 text-imperial-gold'
          }`}
        >
          {value ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value) => (
        <span className="text-deep-walnut/60">
          {value
            ? new Date(value).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : '—'}
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
            Blog Posts
          </h1>
          <p className="text-sm text-deep-walnut/50 mt-1">
            Create and manage blog content
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-tea-green text-warm-ivory text-sm font-semibold rounded-lg hover:bg-tea-green/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-imperial-gold/10 p-4 flex items-center gap-3">
          <FileText className="w-5 h-5 text-tea-green" />
          <div>
            <p className="text-xs text-deep-walnut/50">Total Posts</p>
            <p className="font-bold text-deep-walnut">{posts.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-imperial-gold/10 p-4 flex items-center gap-3">
          <Globe className="w-5 h-5 text-tea-green" />
          <div>
            <p className="text-xs text-deep-walnut/50">Published</p>
            <p className="font-bold text-tea-green">
              {posts.filter((p) => p.published).length}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-imperial-gold/10 p-4 flex items-center gap-3">
          <FileText className="w-5 h-5 text-imperial-gold" />
          <div>
            <p className="text-xs text-deep-walnut/50">Drafts</p>
            <p className="font-bold text-imperial-gold">
              {posts.filter((p) => !p.published).length}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={posts}
        loading={loading}
        emptyMessage="No blog posts found. Write your first post!"
        searchPlaceholder="Search posts..."
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-imperial-gold/10">
                <h2 className="text-lg font-semibold text-deep-walnut font-playfair">
                  {editingPost ? 'Edit Post' : 'New Blog Post'}
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
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm border border-imperial-gold/20 rounded-lg bg-warm-ivory/50 text-deep-walnut focus:outline-none focus:ring-2 focus:ring-tea-green/30 focus:border-tea-green"
                    placeholder="Post title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-deep-walnut mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-sm border border-imperial-gold/20 rounded-lg bg-warm-ivory/50 text-deep-walnut focus:outline-none focus:ring-2 focus:ring-tea-green/30 focus:border-tea-green"
                    placeholder="post-url-slug"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-deep-walnut mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm border border-imperial-gold/20 rounded-lg bg-warm-ivory/50 text-deep-walnut focus:outline-none focus:ring-2 focus:ring-tea-green/30 focus:border-tea-green"
                      placeholder="e.g. Tea Knowledge"
                    />
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={formData.published}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              published: e.target.checked,
                            }))
                          }
                          className="sr-only"
                        />
                        <div
                          className={`w-10 h-6 rounded-full transition-colors ${
                            formData.published ? 'bg-tea-green' : 'bg-imperial-gold/30'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform mt-1 ${
                              formData.published ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-deep-walnut">
                        Published
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-deep-walnut mb-1">
                    Excerpt
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        excerpt: e.target.value,
                      }))
                    }
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-imperial-gold/20 rounded-lg bg-warm-ivory/50 text-deep-walnut focus:outline-none focus:ring-2 focus:ring-tea-green/30 focus:border-tea-green resize-none"
                    placeholder="Brief description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-deep-walnut mb-1">
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    rows={8}
                    className="w-full px-3 py-2 text-sm border border-imperial-gold/20 rounded-lg bg-warm-ivory/50 text-deep-walnut focus:outline-none focus:ring-2 focus:ring-tea-green/30 focus:border-tea-green resize-none"
                    placeholder="Write your blog post content..."
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
                    {editingPost ? 'Update Post' : 'Create Post'}
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
                  Delete Post
                </h3>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="p-1 rounded-lg hover:bg-warm-ivory"
                >
                  <X className="w-5 h-5 text-deep-walnut/50" />
                </button>
              </div>
              <p className="text-sm text-deep-walnut/60 mb-6">
                Are you sure you want to delete this blog post? This action
                cannot be undone.
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

export default BlogManagementPage;
