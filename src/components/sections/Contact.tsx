import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLanguage } from '@/lib/LanguageContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const { t } = useLanguage();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setErrorMsg(null);
    try {
      if (db) {
        await addDoc(collection(db, 'contacts'), {
          ...data,
          createdAt: serverTimestamp()
        });
      } else {
        throw new Error('Database connection failed.');
      }
      setIsSuccess(true);
      reset();
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 relative bg-background overflow-hidden">
      <div className="absolute inset-0 bg-aurora-1/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none opacity-50" />
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1.2 }}
        >
          <div className="glass-card rounded-[48px] p-8 md:p-16 lg:p-20 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 border border-white/10 shadow-2xl backdrop-blur-xl bg-card/30">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.1] font-heading font-extrabold mb-6">
                {t('contact.title').split(' ').map((word, i) => {
                  if (['amazing', 'अद्भुत'].includes(word) || word.toLowerCase() === 'amazing') {
                    return <span key={i} className="text-primary">{word} </span>;
                  }
                  return word + ' ';
                })}
              </h2>
              <p className="text-muted-foreground text-lg md:text-[1.1rem] font-sans">
                {t('contact.desc')}
              </p>
            </div>

            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-heading font-bold mb-4">Message Sent</h3>
                <p className="text-muted-foreground mb-8">
                  Thank you for reaching out. I'll get back to you as soon as possible.
                </p>
                <Button 
                  onClick={() => setIsSuccess(false)}
                  variant="outline" 
                  className="rounded-full border-foreground/10 hover:bg-foreground/5"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-3">
                  <label htmlFor="name" className="text-[0.9rem] font-semibold text-foreground tracking-wide uppercase font-mono text-xs">{t('contact.name')}</label>
                  <input 
                    type="text" 
                    id="name" 
                    {...register("name")}
                    disabled={isSubmitting}
                    className="w-full bg-transparent border-0 border-b border-white/20 px-0 py-4 focus:outline-none focus:ring-0 focus:border-primary transition-all text-[1.1rem] text-foreground placeholder:text-muted-foreground/50 disabled:opacity-50"
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
                </div>
                <div className="space-y-3">
                  <label htmlFor="email" className="text-[0.9rem] font-semibold text-foreground tracking-wide uppercase font-mono text-xs">{t('contact.email')}</label>
                  <input 
                    type="email" 
                    id="email" 
                    {...register("email")}
                    disabled={isSubmitting}
                    className="w-full bg-transparent border-0 border-b border-white/20 px-0 py-4 focus:outline-none focus:ring-0 focus:border-primary transition-all text-[1.1rem] text-foreground placeholder:text-muted-foreground/50 disabled:opacity-50"
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div className="space-y-3">
                  <label htmlFor="message" className="text-[0.9rem] font-semibold text-foreground tracking-wide uppercase font-mono text-xs">{t('contact.message')}</label>
                  <textarea 
                    id="message" 
                    {...register("message")}
                    disabled={isSubmitting}
                    rows={4}
                    className="w-full bg-transparent border-0 border-b border-white/20 px-0 py-4 focus:outline-none focus:ring-0 focus:border-primary transition-all text-[1.1rem] text-foreground placeholder:text-muted-foreground/50 resize-none disabled:opacity-50"
                    placeholder="Tell me about your project..."
                  />
                  {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>}
                </div>
                {errorMsg && (
                  <p className="text-red-400 text-sm font-medium p-3 bg-red-500/10 rounded-lg">{errorMsg}</p>
                )}
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full px-10 h-14 text-[1.1rem] font-semibold bg-primary hover:opacity-90 text-primary-foreground border-0 disabled:opacity-70 flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      {t('contact.send')} <span className="text-lg">→</span>
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
