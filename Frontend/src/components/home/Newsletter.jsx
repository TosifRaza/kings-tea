import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { newsletterAPI } from '../../services/api';

export default function Newsletter({ content = {} }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [consent, setConsent] = useState(false);
  const [unsubscribeToken, setUnsubscribeToken] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const { data } = await newsletterAPI.subscribe({ email: email.trim(), consent });
      setSubmitted(true);
      setEmail('');
      setUnsubscribeToken(data?.data?.unsubscribeToken || '');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not subscribe right now. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const unsubscribe = async () => {
    try {
      await newsletterAPI.unsubscribe({ token: unsubscribeToken });
      setSubmitted(false); setUnsubscribeToken(''); setConsent(false);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to unsubscribe with this link.');
    }
  };

  return (
    <section ref={ref} className="py-10 lg:py-12 bg-warm-ivory-dark relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(31,77,58,0.5) 1px, transparent 0)`,
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Mail className="h-8 w-8 text-imperial-gold mx-auto mb-4" />
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold text-deep-walnut mb-3">
            {content.heading || 'Join the Royal Tea Circle'}
          </h2>
          <p className="text-deep-walnut/60 font-[family-name:var(--font-inter)] text-sm mb-6 max-w-md mx-auto">
            {content.description || 'Get occasional tea updates and product news from King’s Tea.'}
          </p>

          {submitted ? (
            <>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 text-tea-green"
            >
              <CheckCircle className="h-5 w-5" />
              <span className="font-[family-name:var(--font-inter)] text-sm font-medium">
                Subscription saved. Thank you for opting in.
              </span>
            </motion.div>
            {unsubscribeToken && <button type="button" onClick={unsubscribe} className="mt-3 text-xs text-tea-green underline">Unsubscribe from this browser</button>}
            </>
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto max-w-md">
              <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-white border-imperial-gold/20 text-deep-walnut placeholder:text-deep-walnut/40 text-sm flex-1 px-3 focus:outline-none focus:border-imperial-gold"
              />
              <button
                type="submit"
                disabled={busy || !consent}
                className="btn-luxury h-11 rounded-none bg-tea-green px-6 text-xs font-semibold uppercase tracking-wider text-warm-ivory transition-colors hover:bg-tea-green-light disabled:opacity-50"
              >
                {busy ? 'Saving…' : 'Subscribe'}
              </button>
              </div>
              <label className="mt-3 flex items-start gap-2 text-left text-xs text-deep-walnut/65"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required className="mt-0.5 accent-tea-green" /><span>I agree to receive marketing emails. I can unsubscribe at any time.</span></label>
            </form>
          )}

          {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
        </motion.div>
      </div>
    </section>
  );
}
