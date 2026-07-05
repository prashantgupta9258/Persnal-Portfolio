import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();

  const navItems = [
    { label: t('nav.about'), href: '/#about' },
    { label: t('nav.projects'), href: '/#projects' },
    { label: t('nav.services'), href: '/#services' },
    { label: t('nav.experience'), href: '/#experience' },
    { label: t('nav.reviews'), href: '/#testimonials' }
  ];

  const toggleLang = () => {
    setLang(lang === 'EN' ? 'HI' : lang === 'HI' ? 'HINGLISH' : 'EN');
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed dark-section text-foreground top-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-6xl z-50 flex items-center justify-between px-6 py-3 glass rounded-full"
    >
      <Link to="/" className="text-xl font-heading font-extrabold tracking-tight text-foreground hover:text-gray-300 transition-colors flex items-center gap-2">
        <img src="/favicon.svg?v=2" alt="Logo" className="w-6 h-6 rounded" />
        PRASHANT<span className="text-primary">.</span>
      </Link>

      <nav className="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleLang}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
        >
          <Globe className="w-4 h-4" />
          {lang}
        </button>
        <Button nativeButton={false} render={<a href="/#contact" />} className="rounded-full bg-foreground text-background hover:bg-foreground/90 hidden md:inline-flex font-semibold px-6">
          {t('nav.talk')}
        </Button>
      </div>
    </motion.header>
  );
}
