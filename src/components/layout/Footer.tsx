import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="dark-section text-foreground bg-background py-16 border-t border-foreground/5">
      <div className="container mx-auto px-6 md:px-12 flex flex-col items-center justify-between md:flex-row text-center md:text-left gap-8">
        
        <div className="flex flex-col items-center md:items-start">
          <p className="text-xl font-heading font-extrabold tracking-tight mb-2">
            PORTFOLIO<span className="text-primary">.</span>
          </p>
          <p className="text-sm text-muted-foreground font-sans">
            &copy; {new Date().getFullYear()} Prashant Gupta. All Rights Reserved.
          </p>
        </div>

        <div className="flex gap-3">
          {[
            { icon: Twitter, href: "#" },
            { icon: Github, href: "#" },
            { icon: Linkedin, href: "#" },
            { icon: Mail, href: "mailto:prashantgupta9258@gmail.com" },
          ].map((social, index) => (
            <a 
              key={index}
              href={social.href} 
              className="w-12 h-12 rounded-full border border-foreground/10 flex items-center justify-center text-muted-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300 group"
            >
              <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
