import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'EN' | 'HI' | 'HINGLISH';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  EN: {
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.services': 'Services',
    'nav.experience': 'Experience',
    'nav.reviews': 'Reviews',
    'nav.talk': "Let's Talk",
    'hero.role': 'Creative Developer & Designer',
    'hero.title1': "Hi, I'm",
    'hero.titleHighlight': "Prashant Gupta",
    'hero.title2': "Building digital experiences.",
    'hero.desc': 'Building premium digital experiences with modern web technologies.',
    'hero.view': 'View Projects',
    'hero.contact': 'Contact Me',
    'about.label': 'ABOUT ME',
    'about.title': 'Crafting code with precision and purpose.',
    'about.p1': "Hi, I'm a passionate Full Stack Web Developer who enjoys building modern, responsive, and user-friendly websites. I love turning ideas into clean, high-quality digital experiences that not only look great but also perform smoothly across all devices.",
    'about.p2': "I'm always learning new technologies, improving my skills, and paying attention to every detail to create websites that are fast, visually appealing, and easy to use. My goal is to deliver work that helps businesses and individuals make a strong online presence.",
    'about.stat1': 'WEB TECH',
    'about.stat2': 'HIGH-QUALITY CODE',
    'projects.label': 'WORKS',
    'projects.title': 'Selected Projects',
    'projects.all': 'View All Projects',
    'exp.label': 'JOURNEY',
    'exp.title': 'Experience',
    'services.label': 'SERVICES',
    'services.title': 'Capabilities & Services',
    'reviews.label': 'REVIEWS',
    'reviews.title': 'What People Say',
    'contact.label': 'CONTACT',
    'contact.title': "Let's build something amazing together.",
    'contact.desc': 'Have a project in mind or want to explore possibilities? Reach out.',
    'contact.name': 'Full Name',
    'contact.email': 'Email Address',
    'contact.message': 'Message',
    'contact.send': 'Send Message'
  },
  HI: {
    'nav.about': 'मेरे बारे में',
    'nav.projects': 'परियोजनाएं',
    'nav.services': 'सेवाएं',
    'nav.experience': 'अनुभव',
    'nav.reviews': 'समीक्षाएं',
    'nav.talk': 'बात करें',
    'hero.role': 'क्रिएटिव डेवलपर और डिजाइनर',
    'hero.title1': "नमस्ते, मैं",
    'hero.titleHighlight': "प्रशांत गुप्ता",
    'hero.title2': "डिजिटल अनुभव बना रहा हूँ।",
    'hero.desc': 'आधुनिक वेब तकनीकों के साथ बेहतरीन डिजिटल अनुभव का निर्माण।',
    'hero.view': 'प्रोजेक्ट्स देखें',
    'hero.contact': 'मुझसे संपर्क करें',
    'about.label': 'मेरे बारे में',
    'about.title': 'सटीकता और उद्देश्य के साथ कोड तैयार करना।',
    'about.p1': 'नमस्ते, मैं एक जुनूनी फुल स्टैक वेब डेवलपर हूं, जिसे आधुनिक और उपयोगकर्ता के अनुकूल वेबसाइट बनाना पसंद है। मुझे विचारों को शानदार डिजिटल अनुभवों में बदलना पसंद है।',
    'about.p2': 'मैं हमेशा नई तकनीकें सीखता हूं, अपने कौशल में सुधार करता हूं, और तेज व आकर्षक वेबसाइट बनाने के लिए हर विवरण पर ध्यान देता हूं।',
    'about.stat1': 'वेब तकनीक',
    'about.stat2': 'उच्च गुणवत्ता वाला कोड',
    'projects.label': 'कार्य',
    'projects.title': 'चुनिंदा प्रोजेक्ट्स',
    'projects.all': 'सभी प्रोजेक्ट्स देखें',
    'exp.label': 'यात्रा',
    'exp.title': 'अनुभव',
    'services.label': 'सेवाएं',
    'services.title': 'क्षमताएं और सेवाएं',
    'reviews.label': 'समीक्षाएं',
    'reviews.title': 'लोग क्या कहते हैं',
    'contact.label': 'संपर्क करें',
    'contact.title': 'आइए मिलकर कुछ अद्भुत बनाएं।',
    'contact.desc': 'क्या आपके दिमाग में कोई प्रोजेक्ट है? बेझिझक संपर्क करें।',
    'contact.name': 'पूरा नाम',
    'contact.email': 'ईमेल पता',
    'contact.message': 'संदेश',
    'contact.send': 'संदेश भेजें'
  },
  HINGLISH: {
    'nav.about': 'Mere Baare Mein',
    'nav.projects': 'Projects',
    'nav.services': 'Services',
    'nav.experience': 'Experience',
    'nav.reviews': 'Reviews',
    'nav.talk': 'Baat Karein',
    'hero.role': 'Creative Developer aur Designer',
    'hero.title1': "Namaste, main",
    'hero.titleHighlight': "Prashant Gupta",
    'hero.title2': "Digital experiences bana raha hoon.",
    'hero.desc': 'Modern web technologies ke saath premium digital experiences banana.',
    'hero.view': 'Projects Dekhein',
    'hero.contact': 'Mujhse Sampark Karein',
    'about.label': 'MERE BAARE MEIN',
    'about.title': 'Precision aur purpose ke saath code likhna.',
    'about.p1': 'Namaste, main ek passionate Full Stack Web Developer hoon jise modern aur user-friendly websites banana pasand hai. Mujhe ideas ko behtareen digital experiences mein badalna achha lagta hai.',
    'about.p2': 'Main hamesha nayi technologies seekhta hoon, skills improve karta hoon, taaki fast aur attractive websites bana sakun.',
    'about.stat1': 'WEB TECH',
    'about.stat2': 'HIGH-QUALITY CODE',
    'projects.label': 'WORKS',
    'projects.title': 'Selected Projects',
    'projects.all': 'Sabhi Projects Dekhein',
    'exp.label': 'JOURNEY',
    'exp.title': 'Experience',
    'services.label': 'SERVICES',
    'services.title': 'Kshamtaein aur Services',
    'reviews.label': 'REVIEWS',
    'reviews.title': 'Log Kya Kehte Hain',
    'contact.label': 'CONTACT',
    'contact.title': 'Chaliye milkar kuch amazing banate hain.',
    'contact.desc': 'Koi project mind mein hai? Zaroor reach out karein.',
    'contact.name': 'Pura Naam',
    'contact.email': 'Email Address',
    'contact.message': 'Message',
    'contact.send': 'Message Bhejein'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>('EN');

  const t = (key: string) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
