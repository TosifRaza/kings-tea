import { useCallback, useEffect, useState } from 'react';
import { Check, RefreshCw, Star, Trash2, X } from 'lucide-react';
import { reviewAPI } from '../services/api';

export default function ReviewModerationPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await reviewAPI.getReviews({ limit: 100 });
      setReviews(response.data?.data || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load reviews.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadReviews(); }, [loadReviews]);

  const moderate = async (review, approved) => {
    try {
      await reviewAPI.approveReview(review._id, approved);
      await loadReviews();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Review could not be updated.');
    }
  };

  const remove = async (review) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      await reviewAPI.deleteReview(review._id);
      await loadReviews();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Review could not be deleted.');
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-deep-walnut">Review moderation</h1>
          <p className="mt-1 text-sm text-deep-walnut/60">Only approved customer reviews appear on product pages.</p>
        </div>
        <button onClick={loadReviews} className="flex items-center gap-2 rounded-lg border border-imperial-gold/30 px-3 py-2 text-sm text-deep-walnut">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </header>

      {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      {loading ? <p className="text-sm text-deep-walnut/60">Loading reviews…</p> : reviews.length === 0 ? (
        <div className="rounded-xl border border-imperial-gold/20 bg-white p-8 text-center text-deep-walnut/60">No reviews are waiting for moderation.</div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <article key={review._id} className="rounded-xl border border-imperial-gold/20 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <strong className="text-deep-walnut">{review.userId?.name || review.reviewerName || 'Customer'}</strong>
                    <span className="flex items-center gap-1 text-sm text-amber-600"><Star className="h-4 w-4 fill-current" /> {review.rating}/5</span>
                    {review.verified && <span className="rounded-full bg-tea-green/10 px-2 py-1 text-xs text-tea-green">Verified purchase</span>}
                    {review.isSeeded && <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800">Sample data — cannot publish</span>}
                    <span className={`rounded-full px-2 py-1 text-xs ${review.approved ? 'bg-tea-green/10 text-tea-green' : 'bg-amber-100 text-amber-800'}`}>{review.approved ? 'Published' : 'Pending'}</span>
                  </div>
                  <p className="mt-1 text-xs text-deep-walnut/50">{review.productId?.name || 'Product'} · {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}</p>
                  {review.title && <h2 className="mt-3 font-semibold text-deep-walnut">{review.title}</h2>}
                  <p className="mt-2 whitespace-pre-wrap text-sm text-deep-walnut/75">{review.comment || 'No written comment.'}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {review.approved ? (
                    <button onClick={() => moderate(review, false)} className="flex items-center gap-1 rounded-lg border border-amber-300 px-3 py-2 text-sm text-amber-800"><X className="h-4 w-4" /> Hide</button>
                  ) : (
                    <button onClick={() => moderate(review, true)} disabled={review.isSeeded} className="flex items-center gap-1 rounded-lg bg-tea-green px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"><Check className="h-4 w-4" /> Approve</button>
                  )}
                  <button onClick={() => remove(review)} aria-label="Delete review" className="rounded-lg border border-rose-200 p-2 text-rose-700"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
