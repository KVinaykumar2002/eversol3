"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  ChevronDown,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";

const SocialIcon = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-white/10 rounded-full h-8 w-8 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
  >
    {children}
  </a>
);

interface FooterLink {
  name: string;
  href: string;
}

interface LinkGroup {
  title: string;
  links: FooterLink[];
}

const linkGroups: LinkGroup[] = [
  {
    title: "Company",
    links: [
      { name: "Store Locations", href: "#" },
      { name: "Our Blog", href: "#" },
      { name: "Lab Test Reports", href: "#" },
      { name: "About Us", href: "#" },
      { name: "Our Team", href: "#" },
      { name: "Our Recipes", href: "#" },
      { name: "Our Videos", href: "#" },
    ],
  },
  {
    title: "Account",
    links: [
      { name: "Sign In", href: "#" },
      { name: "Contact Us", href: "#" },
      { name: "Become a Co-Op Member", href: "#" },
    ],
  },
  {
    title: "Farming As A Service",
    links: [
      { name: "Harvest Festival", href: "#" },
      { name: "Patron Donation", href: "#" },
      { name: "Organic Farming Workshop", href: "#" },
      { name: "Be The Organic Farmer", href: "#" },
      { name: "Agriculture 360", href: "#" },
      { name: "Organic Trio", href: "#" },
    ],
  },
  {
    title: "Store Policy",
    links: [
      { name: "Privacy Policy", href: "#" },
      { name: "Return and Refund Policy", href: "#" },
      { name: "Shipping Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Sitemap", href: "#" },
    ],
  },
];


const FooterLinkColumn = ({ title, links }: { title: string; links: FooterLink[] }) => (
  <div>
    <h3 className="font-bold text-base text-zinc-900 mb-4">{title}</h3>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.name}>
          <Link href={link.href} className="text-sm text-zinc-600 hover:text-primary-green">
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const AccordionItem = ({ title, children, isOpen, onClick }: { title: string; children: React.ReactNode; isOpen: boolean; onClick: () => void; }) => (
  <div className="border-b border-zinc-200">
    <button
      className="flex justify-between items-center w-full py-4 text-left font-bold text-base text-zinc-900 cursor-pointer"
      onClick={onClick}
    >
      <span>{title}</span>
      <ChevronDown className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={20} />
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen py-4' : 'max-h-0'}`}
    >
      {children}
    </div>
  </div>
);

const Footer = () => {
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    const handleAccordionToggle = (title: string) => {
        setOpenAccordion(openAccordion === title ? null : title);
    };

  return (
    <>
      <footer className="bg-white text-zinc-800 font-body">
        <div className="container mx-auto px-5 py-16 lg:px-10">
          
          {/* Top section for large screens */}
          <div className="hidden lg:grid lg:grid-cols-6 gap-8">
            <div className="space-y-4">
              <Link href="/">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/56749ad2-75ec-41c1-917d-cfc50301e8cc-organicmandya-com/assets/images/OM_Logo_2-1.png"
                  alt="EverSol"
                  width={130}
                  height={88}
                  className="mb-4"
                />
              </Link>
              <p className="text-sm text-zinc-600">Address: Bengaluru, Karnataka</p>
              <p className="text-sm text-zinc-600">
                Call Us: <a href="tel:+919590922000" className="hover:text-primary-green">+91 9590922000</a>
              </p>
              <p className="text-sm text-zinc-600">
                Email: <a href="mailto:support@eversol.com" className="hover:text-primary-green">support@eversol.com</a>
              </p>
            </div>
            {linkGroups.map((group) => (
                <FooterLinkColumn key={group.title} title={group.title} links={group.links} />
            ))}
          </div>
          
          {/* Content for small screens */}
          <div className="lg:hidden">
              <div className="space-y-4 mb-8">
                <Link href="/">
                  <Image
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/56749ad2-75ec-41c1-917d-cfc50301e8cc-organicmandya-com/assets/images/OM_Logo_2-1.png"
                    alt="EverSol"
                    width={130}
                    height={88}
                    className="mb-4"
                  />
                </Link>
                <p className="text-sm text-zinc-600">Address: Bengaluru, Karnataka</p>
                <p className="text-sm text-zinc-600">Call Us: <a href="tel:+919590922000" className="hover:text-primary-green">+91 9590922000</a></p>
                <p className="text-sm text-zinc-600">Email: <a href="mailto:support@eversol.com" className="hover:text-primary-green">support@eversol.com</a></p>
              </div>

              {linkGroups.map(group => (
                  <AccordionItem 
                    key={group.title} 
                    title={group.title}
                    isOpen={openAccordion === group.title}
                    onClick={() => handleAccordionToggle(group.title)}
                  >
                      <ul className="space-y-3">
                          {group.links.map(link => (
                              <li key={link.name}><a href={link.href} className="text-sm text-zinc-600 hover:text-primary-green">{link.name}</a></li>
                          ))}
                      </ul>
                  </AccordionItem>
              ))}
          </div>

        </div>
      </footer>
      <div className="bg-primary-green text-primary-foreground">
        <div className="container mx-auto px-5 py-4 lg:px-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-sm">&copy; 2024, EverSol</p>
            <a href="tel:+919590922000" className="text-sm flex items-center gap-2">
              <Phone size={16} />
              +91 9590922000
            </a>
            <div className="flex items-center gap-4">
              <span className="text-sm">Follow Us</span>
              <div className="flex items-center gap-2">
                <SocialIcon href="https://www.facebook.com/eversol/">
                  <Facebook size={16} />
                </SocialIcon>
                <SocialIcon href="https://twitter.com/eversol/">
                  <Twitter size={16} />
                </SocialIcon>
                <SocialIcon href="https://instagram.com/eversol/">
                  <Instagram size={16} />
                </SocialIcon>
                <SocialIcon href="https://www.youtube.com/channel/UCx_Aiys8c1Vx3fLF1r6yc2Q">
                  <Youtube size={16} />
                </SocialIcon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;