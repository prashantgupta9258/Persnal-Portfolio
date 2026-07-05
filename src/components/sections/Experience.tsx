import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Experience as ExperienceType } from '@/pages/Admin';
import { useLanguage } from '@/lib/LanguageContext';

export default function ExperienceSection() {
  const { t } = useLanguage();
  const [experience, setExperience] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExp = async () => {
      try {
        const snap = await getDocs(collection(db, 'experience'));
        setExperience(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExperienceType)));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchExp();
  }, []);

  if (loading) return null; // or a loader

  return (
    <section id="experience" className="dark-section bg-background text-foreground py-24 md:py-32 relative">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <div className="mb-20">
          <div className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-primary font-semibold mb-3">
            {t('exp.label')}
          </div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="text-4xl md:text-5xl font-heading font-extrabold"
          >
            {t('exp.title')}
          </motion.h2>
        </div>

        <div className="flex flex-col">
          {experience.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 1.2, delay: index * 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-t border-foreground/10 last:border-b"
            >
              <div className="font-mono text-primary font-semibold uppercase tracking-wider">
                {item.period}
              </div>
              <div>
                <h3 className="text-2xl font-heading font-extrabold mb-1">{item.role}</h3>
                <div className="text-muted-foreground font-medium">{item.company}</div>
              </div>
              <div>
                <p className="text-muted-foreground leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
