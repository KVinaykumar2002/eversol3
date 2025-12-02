import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Phone } from 'lucide-react';

const socialLinks = [
  {
    name: 'Facebook',
    href: '//www.facebook.com/eversol/',
    icon: <Facebook />,
  },
  {
    name: 'Twitter',
    href: '//twitter.com/eversol/',
    icon: <Twitter />,
  },
  {
    name: 'Instagram',
    href: '//instagram.com/eversol/',
    icon: <Instagram />,
  },
  {
    name: 'YouTube',
    href: '//www.youtube.com/channel/UCx_Aiys8c1Vx3fLF1r6yc2Q',
    icon: <Youtube />,
  },
];

const ContactFooterBar = () => {
  return (
    <div className="bg-background py-5 shadow-[0_-2px_8px_rgba(0,0,0,0.08)]">
      <div className="container mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 items-center">
          
          <div className="hidden md:block" aria-hidden="true"></div>

          <div className="order-first md:order-none text-center">
            <a 
              href="tel:+919590922000" 
              className="inline-flex items-center text-foreground font-semibold text-xl lg:text-2xl hover:text-primary transition-colors"
            >
              <Phone className="h-5 w-5 lg:h-6 lg:w-6 mr-3" />
              <span>+91 9590922000</span>
            </a>
          </div>
          
          <div className="flex items-center justify-center md:justify-end">
            <span className="text-sm font-semibold text-muted-foreground mr-3">Follow Us</span>
            <div className="flex items-center space-x-2">
              {socialLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href}
                  aria-label={link.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-primary hover:bg-[#1a7a63] transition-all duration-300 ease-in-out rounded-full w-8 h-8 md:w-9 md:h-9 transform hover:scale-110"
                >
                  {React.cloneElement(link.icon, { 
                    className: 'h-4 w-4 md:h-5 md:w-5 text-primary-foreground' 
                  })}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactFooterBar;