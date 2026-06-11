import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { contactAPI } from '../../services/api';

const contactInfo = [
  { icon: Mail, title: 'Email', detail: 'concierge@kingstea.com', sub: 'We respond within 24 hours' },
  { icon: Phone, title: 'Phone', detail: '+1 (888) 546-7890', sub: 'Mon–Fri, 9am–6pm GMT' },
  { icon: MapPin, title: 'Flagship Store', detail: '12 Heritage Lane, Mayfair', sub: 'London W1K 3QP, United Kingdom' },
  { icon: Clock, title: 'Store Hours', detail: 'Mon–Sat: 10am–7pm', sub: 'Sun: 11am–5pm' },
];

const faqs = [
  { question: 'How should I store my tea?', answer: 'Store tea in an airtight container away from light, heat, and moisture. Our tins are designed for optimal storage.' },
  { question: 'What is your return policy?', answer: "We offer a 30-day satisfaction guarantee. If you're not completely satisfied, contact our concierge team for a full refund or exchange." },
  { question: 'Do you ship internationally?', answer: 'Yes, we ship to over 50 countries worldwide. Annual Connoisseur subscribers receive free express shipping.' },
  { question: 'How can I track my order?', answer: "Once your order ships, you'll receive an email with tracking information. You can also check order status in your account dashboard." },
  { question: 'Are your teas certified organic?', answer: "Yes, all KING'S TEA products are certified organic. Our certifications include USDA Organic, EU Organic, and JAS Organic." },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await contactAPI.sendMessage(form);
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      // Handle error silently - could add toast later
    }
    setSubmitting(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-imperial-gold text-xs font-semibold uppercase tracking-[0.2em] font-[family-name:var(--font-inter)]">Get In Touch</span>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-deep-walnut mt-3">Contact Us</h1>
          <p className="text-deep-walnut/60 font-[family-name:var(--font-inter)] text-sm mt-3 max-w-lg mx-auto">Our concierge team is here to assist with any inquiries about our teas, subscriptions, or orders.</p>
          <div className="section-divider mt-6" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {contactInfo.map((info, i) => (
            <motion.div key={info.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white p-5 rounded-sm border border-imperial-gold/10 text-center">
              <div className="w-10 h-10 rounded-full bg-tea-green/10 flex items-center justify-center mx-auto mb-3">
                <info.icon className="h-5 w-5 text-tea-green" />
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-sm mb-1">{info.title}</h3>
              <p className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)]">{info.detail}</p>
              <p className="text-deep-walnut/40 text-[10px] font-[family-name:var(--font-inter)] mt-0.5">{info.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-deep-walnut mb-6">Send Us a Message</h2>
            {submitted ? (
              <div className="bg-tea-green/10 p-8 text-center rounded-sm border border-tea-green/20">
                <p className="text-tea-green font-[family-name:var(--font-inter)] font-medium">Message sent successfully!</p>
                <p className="text-deep-walnut/60 text-xs font-[family-name:var(--font-inter)] mt-2">Our concierge team will respond within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required className="h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required className="h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold" placeholder="your@email.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} className="h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold" placeholder="+1 (555) 000-0000" />
                  </div>
                  <div>
                    <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">Subject *</label>
                    <input name="subject" value={form.subject} onChange={handleChange} required className="h-10 border border-imperial-gold/20 text-sm w-full px-3 focus:outline-none focus:border-imperial-gold" placeholder="How can we help?" />
                  </div>
                </div>
                <div>
                  <label className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] mb-1 block">Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={5} className="border border-imperial-gold/20 text-sm resize-none w-full px-3 py-2 focus:outline-none focus:border-imperial-gold" placeholder="Tell us more about your inquiry..." />
                </div>
                <button type="submit" disabled={submitting} className="btn-luxury bg-tea-green hover:bg-tea-green-light text-warm-ivory px-8 py-5 text-xs font-semibold uppercase tracking-widest rounded-none flex items-center gap-2 transition-colors">
                  <Send className="h-4 w-4" />
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          <div>
            <div className="bg-warm-ivory-dark rounded-sm h-48 flex items-center justify-center mb-8 border border-imperial-gold/10">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-imperial-gold mx-auto mb-2" />
                <p className="text-deep-walnut/50 text-sm font-[family-name:var(--font-inter)]">12 Heritage Lane, Mayfair, London</p>
                <p className="text-deep-walnut/30 text-xs font-[family-name:var(--font-inter)]">Interactive map coming soon</p>
              </div>
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-deep-walnut mb-4 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-imperial-gold" />
                Frequently Asked Questions
              </h2>
              <div className="space-y-2">
                {faqs.map((faq, i) => (
                  <div key={i} className="bg-white border border-imperial-gold/10 rounded-sm px-4">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full text-left font-[family-name:var(--font-inter)] text-xs font-medium text-deep-walnut hover:text-tea-green py-3 flex justify-between items-center"
                    >
                      {faq.question}
                      <span className={`transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>▾</span>
                    </button>
                    {openFaq === i && (
                      <p className="text-deep-walnut/60 text-xs font-[family-name:var(--font-inter)] leading-relaxed pb-3">{faq.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
