import { motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/lib/LanguageContext';
import selfImg from '@/assets/self.jpeg';

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 1.5 }}
          >
            <div className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-primary font-semibold mb-3">
              {t('about.label')}
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.1] font-heading font-extrabold mb-8">
              {t('about.title').split(' ').map((word, i) => {
                if (['precision', 'सटीकता', 'Precision'].includes(word)) {
                  return <span key={i} className="text-primary">{word} </span>;
                }
                return word + ' ';
              })}
            </h2>
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed font-sans">
              <p>{t('about.p1')}</p>
              <p>{t('about.p2')}</p>
            </div>
            
            <div className="flex gap-10 mt-12">
              <div>
                <h3 className="text-[2.5rem] font-heading font-extrabold text-foreground mb-1">Modern</h3>
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-primary font-semibold">{t('about.stat1')}</p>
              </div>
              <div>
                <h3 className="text-[2.5rem] font-heading font-extrabold text-foreground mb-1">Clean</h3>
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-primary font-semibold">{t('about.stat2')}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 1.5 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden glass-card p-2 relative z-10">
              <div className="w-full h-full bg-foreground/5 rounded-2xl flex items-center justify-center border border-foreground/10 relative overflow-hidden">
                <img 
                  src={selfImg} 
                  alt="Prashant Gupta" 
                  className="w-full h-full object-cover z-10 relative"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-aurora-1/10 to-aurora-3/10 hidden z-0 flex-col items-center justify-center text-center px-6">
                  <p className="text-muted-foreground font-mono">
                    Please upload your photo as <br/>
                    <strong className="text-foreground">self.jpeg</strong> <br/>
                    in the public folder
                  </p>
                </div>
              </div>
            </div>
            
            {/* Decorative elements behind image */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-aurora-1/30 to-aurora-2/30 blur-2xl -z-10 rounded-full opacity-50" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
