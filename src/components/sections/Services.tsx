import { motion } from 'motion/react';
import { services } from '@/lib/data';
import { useLanguage } from '@/lib/LanguageContext';

export default function Services() {
  const { t } = useLanguage();
  return (
    <section id="services" className="py-24 md:py-32 relative bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="text-4xl md:text-5xl lg:text-[3.5rem] font-heading font-extrabold mb-6"
          >
            {t('services.title').split(' ').map((word, i) => {
              if (['Services', 'सेवाएं'].includes(word)) {
                return <span key={i} className="text-primary">{word} </span>;
              }
              return word + ' ';
            })}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 1.5, delay: index * 0.1 }}
              className="group h-full p-10 rounded-[32px] bg-card border border-foreground/10 hover:-translate-y-2 transition-transform duration-500 relative overflow-hidden"
            >
              <div className="absolute top-5 right-5 text-[4rem] font-heading font-black text-foreground opacity-5 pointer-events-none select-none">
                0{index + 1}
              </div>
              
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                ✦
              </div>

              <h3 className="text-[1.5rem] font-heading font-bold mb-3">{service.title}</h3>
              <p className="text-muted-foreground text-[0.95rem] leading-relaxed relative z-10 font-sans">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
