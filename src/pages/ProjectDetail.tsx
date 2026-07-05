import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SmoothScroll from '@/components/layout/SmoothScroll';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Project } from './Admin';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!id) return;
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() } as Project);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-background text-foreground flex items-center justify-center">Loading...</div>;
  }

  if (!project) {
    return <div className="min-h-screen bg-background text-foreground flex items-center justify-center">Project not found</div>;
  }

  const technologies = project.technologies ? project.technologies.split(',').map(t => t.trim()) : [];
  const features = project.features ? project.features.split(',').map(f => f.trim()) : [];

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-background text-foreground relative">
        <Navbar />
        
        <main className="pt-32 pb-24">
          <div className="container mx-auto px-6 md:px-12">
            <Link to="/#projects" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-12 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Link>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-20">
              <div className="lg:col-span-2">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight"
                >
                  {project.title}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-xl text-muted-foreground leading-relaxed max-w-3xl"
                >
                  {project.description}
                </motion.p>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                <div>
                  <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-3 font-mono">Role / Category</h4>
                  <p className="text-lg font-medium">{project.category}</p>
                </div>
                {technologies.length > 0 && (
                  <div>
                    <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-3 font-mono">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {technologies.map(tech => (
                        <Badge key={tech} variant="outline" className="bg-foreground/5 border-foreground/10 rounded-full font-mono text-xs">{tech}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-4 pt-4">
                  {project.liveUrl && (
                    <Button nativeButton={false} render={<a href={project.liveUrl} target="_blank" rel="noopener noreferrer" />} className="rounded-full bg-primary text-primary-foreground hover:opacity-90">
                      Live Demo <ExternalLink className="ml-2 w-4 h-4" />
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button nativeButton={false} render={<a href={project.githubUrl} target="_blank" rel="noopener noreferrer" />} variant="outline" size="icon" className="rounded-full border-foreground/10 hover:bg-foreground/5">
                      <Github className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>
            
            {/* Main Hero Image */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full aspect-video rounded-3xl overflow-hidden glass-card mb-32 relative flex items-center justify-center bg-foreground/5 border-foreground/10"
            >
              {project.imageUrl ? (
                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="text-center p-6">
                  <p className="text-muted-foreground font-mono text-lg">
                    [ Main Hero Image Placeholder ]
                  </p>
                </div>
              )}
            </motion.div>
            
            {/* Content Sections */}
            {(project.challenge || project.solution) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-20 max-w-5xl mx-auto mb-32">
                {project.challenge && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                  >
                    <h3 className="text-2xl font-heading font-bold mb-6 text-gradient">The Challenge</h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{project.challenge}</p>
                  </motion.div>
                )}
                {project.solution && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.1 }}
                  >
                    <h3 className="text-2xl font-heading font-bold mb-6 text-gradient">The Solution</h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{project.solution}</p>
                  </motion.div>
                )}
              </div>
            )}
            
            {/* Features List */}
            {features.length > 0 && (
              <div className="max-w-3xl mx-auto text-center mb-32">
                <h3 className="text-3xl font-heading font-bold mb-12">Key Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                  {features.map((feature, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false }}
                      transition={{ delay: i * 0.1 }}
                      className="p-6 rounded-2xl bg-foreground/5 border border-foreground/10 flex items-center"
                    >
                      <span className="w-2 h-2 rounded-full bg-aurora-3 mr-4 shrink-0" />
                      {feature}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </main>
        
        <Footer />
      </div>
    </SmoothScroll>
  );
}
