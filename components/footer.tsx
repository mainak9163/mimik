"use client"
import { useState, useRef } from 'react';
import ContactForm from './contact-form';


const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showContactForm, setShowContactForm] = useState(false);
  const contactFormRef = useRef<HTMLDivElement>(null);
  
  const handleContactClick = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setShowContactForm(!showContactForm);
    
    // Wait for state update and DOM to render before scrolling
    setTimeout(() => {
      if (contactFormRef.current) {
        contactFormRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };
  
  return (
    <footer className="w-full border-t border-border bg-background/80 py-4">
      <div className="container mx-auto flex flex-col justify-between px-4 md:flex-row md:items-center">
        <div className="mb-2 md:mb-0">
          <a 
            href="#contact"
            onClick={handleContactClick}
            className="text-sm text-muted-foreground hover:text-foreground hover:underline"
          >
            Contact Us
          </a>
        </div>
        <div className="text-sm text-muted-foreground">
          &copy; Copyright {currentYear} p3co inclusive
        </div>
      </div>
      
      {showContactForm && (
        <div 
          ref={contactFormRef} 
          className="container mx-auto mt-8 px-4"
        >
          <ContactForm />
        </div>
      )}
    </footer>
  );
};

export default Footer;