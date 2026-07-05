import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useLanguage } from '@/lib/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();
  const [resumeUrl, setResumeUrl] = useState('/resume.pdf');

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'resume'));
        if (docSnap.exists() && docSnap.data().url) {
          setResumeUrl(docSnap.data().url);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchResume();
  }, []);

  return (
    <section className="dark-section bg-background text-foreground relative min-h-screen flex items-center justify-center overflow-x-hidden overflow-y-visible pt-20">
      {/* Aurora Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-aurora-1/20 rounded-full blur-[128px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-aurora-2/20 rounded-full blur-[128px] mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-aurora-3/10 rounded-full blur-[128px] mix-blend-screen" />
        {/* Fade out to background at the bottom to blend with the next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
      </div>

      <div className="container relative z-10 mx-auto px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.2 }}
        >
          <span className="inline-block font-mono text-[0.7rem] uppercase tracking-[0.15em] text-primary font-semibold mb-4">
            {t('hero.role')}
          </span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-[6.5rem] font-heading font-extrabold tracking-tighter mb-6 leading-[0.95]"
        >
          {t('hero.title1')} <span className="text-gradient">{t('hero.titleHighlight')}</span><br />
          {t('hero.title2')}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="text-lg md:text-[1.25rem] text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-sans"
        >
          {t('hero.desc')}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button nativeButton={false} render={<a href="#projects" />} size="lg" className="rounded-full px-10 h-14 text-[1rem] bg-primary text-primary-foreground hover:opacity-90 font-semibold gap-2">
            {t('hero.view')} <ArrowRight className="w-4 h-4" />
          </Button>
          <Button nativeButton={false} render={<a href={resumeUrl} target="_blank" rel="noopener noreferrer" />} size="lg" variant="outline" className="rounded-full px-10 h-14 text-[1rem] bg-transparent border-white/20 hover:bg-foreground/5 text-foreground font-semibold gap-2">
            Download Resume <Download className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
