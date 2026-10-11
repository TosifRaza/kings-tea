import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { contactAPI, siteContentAPI } from '../../services/api';

const icons = { Email: Mail, Phone, Location: MapPin };

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [settings, setSettings] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.allSettled([siteContentAPI.getContent('store-settings'), siteContentAPI.getContent('faq')]).then(([store, faq]) => {
      if (!active) return;
      if (store.status === 'fulfilled') setSettings(store.value.data?.data || null);
      if (faq.status === 'fulfilled') setFaqs((faq.value.data?.data?.items || []).filter((item) => item.enabled !== false).sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0)));
    });
    return () => { active = false; };
  }, []);

  const contactInfo = (settings?.contactMethods || [
    settings?.contactEmail && { title: 'Email', detail: settings.contactEmail },
    settings?.phone && { title: 'Phone', detail: settings.phone },
    settings?.address && { title: 'Location', detail: settings.address },
  ]).filter(Boolean).map((item) => ({ ...item, icon: icons[item.title] || Mail }));
  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const handleSubmit = async (event) => {
    event.preventDefault(); setSubmitting(true); setSubmitError('');
    try {
      await contactAPI.sendMessage(form);
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      window.setTimeout(() => setSubmitted(false), 4000);
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Could not send your message. Please try again.');
    } finally { setSubmitting(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="min-h-screen pb-12 pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center"><span className="font-[family-name:var(--font-inter)] text-xs font-semibold uppercase tracking-[0.2em] text-imperial-gold">Get in touch</span><h1 className="mt-3 font-[family-name:var(--font-playfair)] text-3xl font-bold text-deep-walnut sm:text-4xl">Contact Us</h1><p className="mx-auto mt-3 max-w-lg font-[family-name:var(--font-inter)] text-sm text-deep-walnut/60">Send us a message about products, orders, or other questions.</p><div className="section-divider mt-6" /></header>

        {contactInfo.length > 0 && <div className="mb-12 grid grid-cols-1 gap-3 sm:grid-cols-3">{contactInfo.map(({ icon: Icon, title, detail, sub }) => <article key={`${title}-${detail}`} className="rounded-sm border border-imperial-gold/10 bg-white p-5 text-center"><Icon className="mx-auto mb-3 h-5 w-5 text-tea-green" /><h2 className="mb-1 font-[family-name:var(--font-playfair)] text-sm font-semibold">{title}</h2><p className="text-xs text-deep-walnut/70">{detail}</p>{sub && <p className="mt-1 text-[10px] text-deep-walnut/45">{sub}</p>}</article>)}</div>}

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-2">
          <section><h2 className="mb-6 font-[family-name:var(--font-playfair)] text-xl font-bold text-deep-walnut">Send us a message</h2>{submitted ? <div role="status" className="rounded-sm border border-tea-green/20 bg-tea-green/10 p-8 text-center text-sm text-tea-green">Your message was received.</div> : <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2"><label className="text-xs text-deep-walnut/70">Full name *<input name="name" value={form.name} onChange={handleChange} required maxLength={100} className="mt-1 h-10 w-full border border-imperial-gold/20 px-3 text-sm focus:border-imperial-gold focus:outline-none" /></label><label className="text-xs text-deep-walnut/70">Email *<input name="email" type="email" value={form.email} onChange={handleChange} required maxLength={254} className="mt-1 h-10 w-full border border-imperial-gold/20 px-3 text-sm focus:border-imperial-gold focus:outline-none" /></label></div>
            <div className="grid gap-4 sm:grid-cols-2"><label className="text-xs text-deep-walnut/70">Phone<input name="phone" value={form.phone} onChange={handleChange} maxLength={32} className="mt-1 h-10 w-full border border-imperial-gold/20 px-3 text-sm focus:border-imperial-gold focus:outline-none" /></label><label className="text-xs text-deep-walnut/70">Subject *<input name="subject" value={form.subject} onChange={handleChange} required maxLength={150} className="mt-1 h-10 w-full border border-imperial-gold/20 px-3 text-sm focus:border-imperial-gold focus:outline-none" /></label></div>
            <label className="block text-xs text-deep-walnut/70">Message *<textarea name="message" value={form.message} onChange={handleChange} required maxLength={5000} rows={5} className="mt-1 w-full resize-y border border-imperial-gold/20 px-3 py-2 text-sm focus:border-imperial-gold focus:outline-none" /></label>
            {submitError && <p role="alert" className="text-sm text-red-700">{submitError}</p>}<button type="submit" disabled={submitting} className="inline-flex min-h-12 items-center gap-2 bg-tea-green px-8 text-xs font-semibold uppercase tracking-widest text-warm-ivory disabled:opacity-60"><Send className="h-4 w-4" />{submitting ? 'Sending…' : 'Send message'}</button>
          </form>}</section>

          <section><h2 className="mb-4 flex items-center gap-2 font-[family-name:var(--font-playfair)] text-xl font-bold text-deep-walnut"><MessageCircle className="h-5 w-5 text-imperial-gold" />Frequently Asked Questions</h2>{faqs.length ? <div className="space-y-2">{faqs.map((faq, index) => <details key={`${faq.question}-${index}`} className="rounded-sm border border-imperial-gold/10 bg-white px-4 py-3"><summary className="cursor-pointer text-sm font-medium text-deep-walnut">{faq.question}</summary><p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-deep-walnut/65">{faq.answer}</p></details>)}</div> : <p className="text-sm text-deep-walnut/60">No FAQs have been published yet.</p>}{settings?.address && <div className="mt-6 flex items-start gap-3 rounded-sm bg-warm-ivory-dark p-4"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-imperial-gold" /><p className="text-sm text-deep-walnut/70">{settings.address}</p></div>}</section>
        </div>
      </div>
    </motion.div>
  );
}
