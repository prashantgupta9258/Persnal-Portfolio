import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Project } from '../../pages/Admin';
import { useLanguage } from '@/lib/LanguageContext';

export default function Projects() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'projects'));
        const projs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
        setProjects(projs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const categories = useMemo(() => {
    const defaultCats = ['Desktop', 'Tablet', 'Mobile'];
    const allCats = projects.flatMap(p => p.category ? p.category.split(', ') : []);
    const cats = new Set([...defaultCats, ...allCats.filter(Boolean)]);
    return ['All', ...Array.from(cats)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects;
    return projects.filter(p => p.category && p.category.split(', ').includes(activeCategory));
  }, [projects, activeCategory]);

  return (
    <section id="projects" className="dark-section text-foreground py-24 md:py-32 relative bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-primary font-semibold mb-3">
              {t('projects.label')}
            </div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              className="text-4xl md:text-5xl font-heading font-extrabold"
            >
              {t('projects.title')}
            </motion.h2>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2"
          >
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? 'default' : 'outline'}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full ${activeCategory === category ? 'bg-primary text-primary-foreground' : 'border-foreground/10 hover:bg-foreground/5'} font-semibold transition-all`}
              >
                {category === 'All' ? 'All' : category === 'Testimonials' ? 'Reviews' : category}
              </Button>
            ))}
          </motion.div>
        </div>

        <motion.div 
          layout 
          className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[400px]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
        >
          {loading ? (
             <div className="md:col-span-12 text-center text-muted-foreground">Loading projects...</div>
          ) : filteredProjects.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  layout
                  key={project.id}
                  variants={{
                    hidden: { opacity: 0, y: 50, scale: 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 20 } }
                  }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className={`${project.colSpan === 12 ? "md:col-span-12" : project.colSpan === 8 ? "md:col-span-8" : project.colSpan === 4 ? "md:col-span-4" : "md:col-span-6"} rounded-[32px] bg-card border border-foreground/10 overflow-hidden relative p-10 hover:-translate-y-2 transition-transform duration-500 group cursor-pointer block`}
                >
                  <Link to={`/project/${project.id}`} className="absolute inset-0 z-20" />
                  <div className="relative z-30 pointer-events-none"><h3 className="text-3xl font-heading font-extrabold mb-3">{project.title}</h3>
                  <p className="text-muted-foreground font-sans">{project.category}</p></div>

                  <div className={`absolute bottom-0 right-0 ${project.colSpan === 12 || project.colSpan === 8 ? 'w-[80%] h-[60%]' : 'w-full h-[50%]'} bg-background rounded-tl-[20px] border border-foreground/5 shadow-2xl flex items-center justify-center text-muted-foreground font-mono text-sm overflow-hidden group-hover:scale-[1.02] transition-transform duration-500 origin-bottom-right`}>
                     {project.imageUrl ? (
                       <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                     ) : (
                       <span>[ IMAGE PLACEHOLDER ]</span>
                     )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="md:col-span-12 text-center text-muted-foreground">No projects match this category.</div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
