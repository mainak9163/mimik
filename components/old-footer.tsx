"use client";
import { useState, useRef } from "react";
import ContactForm from "./contact-form";

const SocialLogo = ({ socialMedia }: { socialMedia: string }) => {
  return (
    <img
      src={`/${socialMedia}.svg`}
      alt={`${socialMedia} logo`}
      className="w-6 h-6 object-cover"
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
    <footer className="w-full border-t border-border bg-background/80">
      <div className="container mx-auto px-8 py-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Social Media Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Follow us!</h3>
            <div className="flex flex-col space-y-3">
              <a
                href="https://instagram.com/astrapuffs"
                className="flex items-center gap-3 hover:text-primary transition-colors group"
              >
                <div className="group-hover:scale-110 transition-transform">
                  <SocialLogo socialMedia="instagram" />
                </div>
                <span>Instagram</span>
              </a>
              <a
                href="https://www.tiktok.com/@astrapuffs"
                className="flex items-center gap-3 hover:text-primary transition-colors group"
              >
                <div className="group-hover:scale-110 transition-transform">
                  <SocialLogo socialMedia="tiktok" />
                </div>
                <span>TikTok</span>
              </a>
            </div>
          </div>

          {/* Links Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <div className="flex flex-col space-y-3">
              <a
                href="#terms-of-service"
                className="hover:text-primary transition-colors w-fit"
              >
                Terms of Service
              </a>
              <a
                href="#privacy-policy"
                className="hover:text-primary transition-colors w-fit"
              >
                Privacy Policy
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-4 md:text-right">
            <h3 className="text-lg font-semibold">Get in Touch</h3>
            <button
              onClick={handleContactClick}
              className="inline-flex items-center justify-center px-6 py-3 bg-[#faa0ab] hover:bg-[#f8909c] text-white rounded-lg transition-colors font-medium"
            >
              Contact Us
            </button>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground order-2 md:order-1">
              &copy; Copyright {currentYear} P3CO, Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground order-1 md:order-2">
              <span>Made with ❤️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      {showContactForm && (
        <div
          ref={contactFormRef}
          className="border-t border-border bg-muted/30"
        >
          <div className="container mx-auto px-4 py-8">
            <ContactForm />
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
