"use client";

import { memo, useCallback, useRef, useState } from "react";
import { LucideInstagram } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import MarqueeText from "react-marquee-text";
import GSAPButton from "@/components/animated-button";
import ContactForm from "@/components/contact-form";
import WaveText from "@/components/squash-animation";
import Image from "next/image";

// Types
interface NavigationItem {
  id: string;
  label: string;
}

interface SocialLink {
  href: string;
  icon: React.ReactNode;
  label: string;
}

// Constants
const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: "one", label: "Watch" },
  { id: "one.one", label: "Astrapuff" },
  { id: "two.one", label: "Features" },
  { id: "three", label: "Explore" },
  { id: "four", label: "Lets Play" },
  { id: "five", label: "Waitlist" },
];

const SOCIAL_LINKS: SocialLink[] = [
  {
    href: "https://instagram.com/astrapuffs",
    icon: <LucideInstagram className="text-white w-6 h-6" />,
    label: "Instagram",
  },
  {
    href: "https://www.tiktok.com/@astrapuffs",
    icon: (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 448 512" 
        className="w-6 h-6 text-white" 
        fill="currentColor"
        role="img"
        aria-label="TikTok"
      >
        <path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z" />
      </svg>
    ),
    label: "TikTok",
  },
];

const FOOTER_LINKS = [
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/privacy-policy", label: "Privacy Policy" },
];

// Utility function
const smoothScrollTo = (elementId: string): void => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

// Sub-components
const NavigationLinks = memo(() => {
  const router = useRouter();
  const pathname = usePathname();
  
  const handleNavClick = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    
    // Check if we're on the home page
    const isHomePage = pathname === '/';
    
    if (isHomePage) {
      // If on home page, scroll to section directly
      smoothScrollTo(id);
    } else {
      // If on different page, redirect to home page with hash
      router.push(`/#${id}`);
    }
  }, [router, pathname]);

  return (
    <nav className="flex flex-col gap-y-3 text-right sm:text-left" aria-label="Footer navigation">
      {NAVIGATION_ITEMS.map(({ id, label }) => (
        <a
          key={id}
          href={`/#${id}`}
          onClick={(e) => handleNavClick(e, id)}
          className="focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-purple-900 rounded"
        >
          <WaveText
            text={label}
            className="text-xl font-semibold text-white hover:text-purple-200 transition-colors"
          />
        </a>
      ))}
    </nav>
  );
});

NavigationLinks.displayName = "NavigationLinks";

const SocialLinks = memo(() => (
  <div className="flex flex-col">
    <div className="text-white text-sm mb-2 font-medium">FOLLOW US</div>
    <ul className="flex gap-x-4 list-none">
      {SOCIAL_LINKS.map(({ href, icon, label }) => (
        <li key={href}>
          <a
            href={href}
            className="flex items-center hover:text-purple-200 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-purple-900 rounded p-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            {icon}
            <span className="sr-only">Follow us on {label}</span>
          </a>
        </li>
      ))}
    </ul>
  </div>
));

SocialLinks.displayName = "SocialLinks";

const LegalLinks = memo(() => (
  <div className="flex gap-x-3 w-fit mx-auto">
    {FOOTER_LINKS.map(({ href, label }) => (
      <a
        key={href}
        href={href}
        className="hover:text-purple-200 transition-colors w-fit focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-purple-900 rounded"
      >
        <WaveText
          text={label}
          className="text-base font-semibold text-white"
        />
      </a>
    ))}
  </div>
));

LegalLinks.displayName = "LegalLinks";

// Main component
const Footer = memo(() => {
  const currentYear = new Date().getFullYear();
  const [showContactForm, setShowContactForm] = useState(false);
  const contactFormRef = useRef<HTMLDivElement>(null);

  const handleContactClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setShowContactForm(prev => !prev);

    // Scroll to contact form after state update
    if (!showContactForm) {
      setTimeout(() => {
        contactFormRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [showContactForm]);

  return (
    <footer className="bg-purple-900 p-2 sm:p-4">
      <style jsx>{`
        @keyframes marqueeScroll {
          to {
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>
      
      <MarqueeText
        direction="right"
        className="text-white/50 font-bold mb-2 sm:text-7xl text-3xl my-4"
      >
        Astrapuffs, Multiplayer Agentic NPC Simulator!
      </MarqueeText>
      
      <div className="container mx-auto flex flex-wrap justify-evenly gap-6 my-4 sm:my-[60px]">
        <div className="lg:w-[250px] md:w-[200px] w-[130px]">
           <Image
            src="/logo-small.png"
            alt="Astrapuffs Logo"
            width={250}
            height={250}
            className="w-full h-auto"
            priority={false}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjUwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iIzU5MTY4YiIvPjwvc3ZnPg=="
          />
        </div>

        <NavigationLinks />

        <GSAPButton
          onClick={handleContactClick}
          className="h-fit"
          backgroundColor="#59168b"
          textHoverColor="#59168b"
          aria-expanded={showContactForm}
          aria-controls="contact-form"
        >
          Contact Us
        </GSAPButton>

        <SocialLinks />
      </div>

      {/* Contact Form */}
      {showContactForm && (
        <div 
          ref={contactFormRef} 
          id="contact-form"
          className="animate-fadeIn"
        >
          <div className="container mx-auto px-4 py-8">
            <ContactForm />
          </div>
        </div>
      )}

      {/* Bottom section */}
      <div className="mt-[40px] sm:mt-[100px] text-white">
        <div className="flex flex-col w-fit mx-auto gap-4">
          <p className="text-sm text-center">
            &copy; Copyright {currentYear} P3CO, Inc. All rights reserved.
          </p>
          <LegalLinks />
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;