"use client"
import GSAPButton from "@/components/animated-button";
import ContactForm from "@/components/contact-form";
import WaveText from "@/components/squash-animation";
import { useRef, useState } from "react";
import MarqueeText from "react-marquee-text"

export default function Page() {

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
    <footer className="bg-purple-900 p-2 sm:p-4">
      <style>
        {
          `
            @keyframes marqueeScroll {
  to {
    transform: translate3d(0, 0, 0);
  }
}
          `
        }
      </style>
        <MarqueeText direction="right" className="text-purple-800 font-bold mb-2  sm:text-7xl text-3xl my-4">
          Astrapuffs, Multiplayer Agentic NPC Simulator! 
      </MarqueeText>
      <div className="container mx-auto flex flex-wrap justify-evenly gap-6 my-4 sm:my-[60px]">
        <div className="lg:w-[250px] md:w-[200px] w-[130px]">
           <img src="/logo-small.png" alt="Logo" className="w-full h-auto mb-8" />
</div>
        <div className="flex flex-col gap-y-3 text-right sm:text-left">
          <WaveText text="Games" className="text-xl font-semibold text-white" />
          <WaveText text="Careers" className="text-xl font-semibold text-white" />
          <WaveText text="About Us" className="text-xl font-semibold text-white" />
          <WaveText text="Sustainability" className="text-xl font-semibold text-white" />
          <WaveText text="Technology" className="text-xl font-semibold text-white"/>
        </div>
       
        <GSAPButton onClick={handleContactClick} className="h-fit" backgroundColor="#59168b" textHoverColor="#59168b">Contact Us</GSAPButton>
        <div className="flex flex-col">
          <div className="text-white text-sm mb-2">FOLLOW US</div>
          <div className="flex gap-x-2">
           <a
                href="https://instagram.com/astrapuffs"
                className="flex items-center gap-3 hover:text-primary transition-colors group"
              >
                <div className="rounded-full border-white border-[1px] p-[2px]">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook-icon lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </div>
              </a>
              <a
                href="https://www.tiktok.com/@astrapuffs"
                className="flex items-center gap-3 hover:text-primary transition-colors group"
              >
                <div className="rounded-full border-white border-[1px] p-1">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram-icon lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </div>
              </a>
          </div>
        </div>
      </div>
            {/* Contact Form */}
            {showContactForm && (
              <div ref={contactFormRef} className="">
                <div className="container mx-auto px-4 py-8">
                  <ContactForm />
                </div>
              </div>
      )}
      {/* Bottom section */}
        <div className="mt-8 text-white">
          <div className="flex flex-col w-fit mx-auto gap-4">
            <p className="text-sm ">
              &copy; Copyright {currentYear} P3CO, Inc. All rights reserved.
          </p>
          <div className="flex gap-x-3 w-fit mx-auto">
              <a
                href="#terms-of-service"
                className="hover:text-primary transition-colors w-fit"
              >
                <WaveText text="Terms of Service" className="text-base font-semibold text-white" />
              </a>
              <a
                href="#privacy-policy"
                className="hover:text-primary transition-colors w-fit"
              >
                <WaveText text="Privacy Policy" className="text-base font-semibold text-white" />
              </a>
            </div>
          </div>
        </div>
     </footer>
  );
}


