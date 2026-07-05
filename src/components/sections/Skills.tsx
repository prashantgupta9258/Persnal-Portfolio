import { motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import { skills } from '@/lib/data';

export default function Skills() {
  return (
    <section id="skills" className="py-24 md:py-32 relative bg-secondary border-y border-foreground/10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="text-3xl md:text-5xl font-heading font-bold mb-6"
          >
            Technical Arsenal
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            A comprehensive toolkit for building modern, scalable, and high-performance digital products.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skillGroup, index) => (
            <motion.div
              key={skillGroup.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 1.5, delay: index * 0.1 }}
            >
              <Card className="glass-card p-8 h-full bg-card border-foreground/10 hover:border-foreground/20 transition-colors duration-500 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <h3 className="text-xl font-heading font-semibold mb-6 text-foreground">{skillGroup.category}</h3>
                
                <ul className="space-y-4">
                  {skillGroup.items.map((item) => (
                    <li key={item} className="flex items-center text-muted-foreground group-hover:text-primary transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-aurora-3 mr-3 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
