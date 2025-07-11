"use client";
import GSAPButton from "@/components/animated-button";
import ContactForm from "@/components/contact-form";
import WaveText from "@/components/squash-animation";
import { LucideInstagram } from "lucide-react";
import { useRef, useState } from "react";
import MarqueeText from "react-marquee-text";

const handleSmoothScroll = (
  e: React.MouseEvent<HTMLAnchorElement>,
  id: string,
) => {
  e.preventDefault();
  const scrollEleme = document.getElementById(id) as HTMLElement;
  scrollEleme.scrollIntoView({ behavior: "smooth" });
};

export default function Footer() {
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
        {`
            @keyframes marqueeScroll {
  to {
    transform: translate3d(0, 0, 0);
  }
}
          `}
      </style>
      <MarqueeText
        direction="right"
        className="text-purple-800 font-bold mb-2  sm:text-7xl text-3xl my-4"
      >
        Astrapuffs, Multiplayer Agentic NPC Simulator!
      </MarqueeText>
      <div className="container mx-auto flex flex-wrap justify-evenly gap-6 my-4 sm:my-[60px]">
        <div className="lg:w-[250px] md:w-[200px] w-[130px]">
          <img
            src="/logo-small.png"
            alt="Logo"
            className="w-full h-auto mb-8"
          />
        </div>

        <div className="flex flex-col gap-y-3 text-right sm:text-left">
          <a href="#one" onClick={(e) => handleSmoothScroll(e, "one")}>
            <WaveText
              text="Watch"
              className="text-xl font-semibold text-white"
            />
          </a>
          <a href="#one.one" onClick={(e) => handleSmoothScroll(e, "one.one")}>
            <WaveText
              text="Astrapuff"
              className="text-xl font-semibold text-white"
            />
          </a>
          <a href="#two.one" onClick={(e) => handleSmoothScroll(e, "two.one")}>
            <WaveText
              text="Features"
              className="text-xl font-semibold text-white"
            />
          </a>
          <a href="#three" onClick={(e) => handleSmoothScroll(e, "three")}>
            <WaveText
              text="Explore"
              className="text-xl font-semibold text-white"
            />
          </a>
          <a href="#four" onClick={(e) => handleSmoothScroll(e, "four")}>
            <WaveText
              text="Lets Play"
              className="text-xl font-semibold text-white"
            />
          </a>
          <a href="#five" onClick={(e) => handleSmoothScroll(e, "five")}>
            <WaveText
              text="Waitlist"
              className="text-xl font-semibold text-white"
            />
          </a>
        </div>

        <GSAPButton
          onClick={handleContactClick}
          className="h-fit"
          backgroundColor="#59168b"
          textHoverColor="#59168b"
        >
          Contact Us
        </GSAPButton>
        <div className="flex flex-col">
          <div className="text-white text-sm mb-2">FOLLOW US</div>
          <div className="flex gap-x-2">
            <a
              href="https://instagram.com/astrapuffs"
              className="flex items-center gap-3 hover:text-primary transition-colors group"
            >
          
                <LucideInstagram className="text-white"/>
             
            </a>
            <a
              href="https://www.tiktok.com/@astrapuffs"
              className="flex items-center gap-3 hover:text-primary transition-colors group ml-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-full w-auto text-white" stroke="white" fill="white">
                <path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z" /></svg>
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
      <div className="mt-[40px] sm:mt-[100px] text-white">
        <div className="flex flex-col w-fit mx-auto gap-4">
          <p className="text-sm ">
            &copy; Copyright {currentYear} P3CO, Inc. All rights reserved.
          </p>
          <div className="flex gap-x-3 w-fit mx-auto">
            <a
              href="/terms-of-service"
              className="hover:text-primary transition-colors w-fit"
            >
              <WaveText
                text="Terms of Service"
                className="text-base font-semibold text-white"
              />
            </a>
            <a
              href="/privacy-policy"
              className="hover:text-primary transition-colors w-fit"
            >
              <WaveText
                text="Privacy Policy"
                className="text-base font-semibold text-white"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
