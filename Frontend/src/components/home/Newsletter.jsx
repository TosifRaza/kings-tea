import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';

export default function Newsletter() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <section ref={ref} className="py-16 lg:py-20 bg-warm-ivory-dark relative overflow-hidden">
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
            Join the Royal Tea Circle
          </h2>
          <p className="text-deep-walnut/60 font-[family-name:var(--font-inter)] text-sm mb-8 max-w-md mx-auto">
            Receive exclusive offers, early access to new teas, brewing tips, and
            invitations to virtual tasting events.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 text-tea-green"
            >
              <CheckCircle className="h-5 w-5" />
              <span className="font-[family-name:var(--font-inter)] text-sm font-medium">
                Welcome to the Royal Tea Circle!
              </span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
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
                className="btn-luxury bg-tea-green hover:bg-tea-green-light text-warm-ivory px-6 h-11 text-xs font-semibold uppercase tracking-wider rounded-none transition-colors"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-deep-walnut/30 text-[10px] font-[family-name:var(--font-inter)] mt-3">
            By subscribing, you agree to our Privacy Policy. Unsubscribe at any
            time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
