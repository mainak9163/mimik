"use client";
import { useState, useRef } from "react";
import ContactForm from "./contact-form";

const SocialLogo = ({ socialMedia }: { socialMedia: string }) => {
  return (
    <img
      src={`/${socialMedia}.svg`}
      alt={`${socialMedia} logo`}
      className="w-10 h-10 object-cover"
    />
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showContactForm, setShowContactForm] = useState(false);
  const contactFormRef = useRef<HTMLDivElement>(null);

  const handleContactClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setShowContactForm(!showContactForm);

    // Wait for state update and DOM to render before scrolling
    setTimeout(() => {
      if (contactFormRef.current) {
        contactFormRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  return (
    <footer className="w-full border-t border-border bg-background/80 py-4">
      <div className="container mx-auto flex justify-between px-4 md:flex-row md:items-center">
        <div className="mb-2 md:mb-0 flex flex-col">
          <span className="text-xl">Follow us!</span>
          <div className="flex flex-row gap-4">
            <a
              href="https://instagram.com/astrapuffs"
              className="flex flex-row items-center cursor-pointer"
            >
              <SocialLogo socialMedia="instagram" />
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@astrapuffs"
              className="flex flex-row items-center cursor-pointer"
            >
              <SocialLogo socialMedia="tiktok" />
              Tiktok
            </a>
          </div>
          <span className="h-2" />
          <a
            href="#terms-of-service"
            className="flex flex-row items-center cursor-pointer"
          >
            Terms Of Service
          </a>
        </div>
        <div className="text-sm text-muted-foreground flex flex-col items-end gap-2">
          <a
            href="#contact"
            onClick={handleContactClick}
            className="w-fit grow-0 text-sm hover:text-white/70 bg-[#faa0ab] px-4 py-2 text-white rounded-lg"
          >
            Contact Us
          </a>
          &copy; Copyright {currentYear} P2CO, Inc
        </div>
      </div>

      {showContactForm && (
        <div ref={contactFormRef} className="container mx-auto mt-8 px-4">
          <ContactForm />
        </div>
      )}
    </footer>
  );
};

export default Footer;
