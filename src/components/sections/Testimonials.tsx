import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import { Quote, X } from 'lucide-react';
import { Testimonial } from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/LanguageContext';

export default function Testimonials() {
  const { t } = useLanguage();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', text: '', stars: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const snap = await getDocs(collection(db, 'testimonials'));
      setTestimonials(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial)));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.text) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'testimonials'), form);
      alert('Thank you for your review!');
      setForm({ name: '', role: '', text: '', stars: 5 });
      setShowForm(false);
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      alert('Error submitting review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return null;
  // Let the section render even if no testimonials, so users can still leave a review.

  return (
    <section id="testimonials" className="dark-section text-foreground py-24 md:py-32 relative bg-background border-y border-foreground/10 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-96 bg-aurora-2/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-20">
          <div className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-primary font-semibold mb-3">
            {t('reviews.label')}
          </div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="text-4xl md:text-5xl font-heading font-extrabold mb-6 text-foreground"
          >
            {t('reviews.title')}
          </motion.h2>
          <button onClick={() => setShowForm(true)} className="inline-block text-primary border-b border-primary/30 hover:border-primary pb-1 transition-colors font-medium">Leave a Review</button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              className="max-w-xl mx-auto mb-16 overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="glass-card p-8 rounded-[32px] border border-foreground/10 relative">
                <button type="button" onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-2xl font-bold mb-6">Write a Review</h3>
                <div className="space-y-4">
                  <input required placeholder="Your Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-transparent border-b border-foreground/20 p-3 outline-none focus:border-primary" />
                  <input placeholder="Role / Company" value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full bg-transparent border-b border-foreground/20 p-3 outline-none focus:border-primary" />
                  <textarea required placeholder="Your Review..." value={form.text} onChange={e => setForm({...form, text: e.target.value})} className="w-full bg-transparent border-b border-foreground/20 p-3 outline-none focus:border-primary min-h-[100px]" />
                  <div className="flex items-center gap-4 py-2">
                    <label className="text-sm font-semibold">Rating:</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setForm({...form, stars: star})}
                          className={`w-8 h-8 transition-colors ${form.stars >= star ? 'text-primary' : 'text-muted-foreground/30'}`}
                        >
                          <svg className="w-full h-full fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-primary-foreground mt-4 h-12 rounded-xl font-semibold">
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 1.5, delay: index * 0.2 }}
              >
                <Card className="glass-card p-10 h-full bg-card border-foreground/10 relative shadow-md">
                  <Quote className="absolute top-8 right-8 w-12 h-12 text-foreground/5" />
                  
                  <div className="flex gap-1 mb-6 text-primary">
                    {[...Array(testimonial.stars || 5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 font-sans italic">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 p-0.5">
                      <div className="w-full h-full bg-background rounded-full border border-foreground/10" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No reviews yet.</p>
        )}
      </div>
    </section>
  );
}
