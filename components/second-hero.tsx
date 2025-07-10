"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card";
import { lilita } from "@/lib/fonts";
import "@/styles/second-hero.css";
import Letter3DSwap from "./ui/letter-3d-swap";
import { AuroraText } from "./ui/aurora-text";

export default function SecondHero() {
  const [isVisible, setIsVisible] = useState(false);
  const [starsPosition, setStarsPosition] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "-50px 0px",
      },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Detect if it's desktop view
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Cycle through star positions (assuming 3 second GIF duration)
  useEffect(() => {
    const interval = setInterval(() => {
      setStarsPosition((prev) => (prev + 1) % 4);
    }, 3000); // Change position every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Define the four corner positions for stars
  const getStarsPosition = () => {
    const positions = [
      { top: '10px', right: '10px' },     // Top-right
      { top: '10px', left: '10px' },      // Top-left
      { top: '60px', right: '10px' },     // Second from top-right
      { top: '60px', left: '10px' }       // Second from top-left
    ];
    return positions[starsPosition];
  };

  return (
    <div
      ref={sectionRef}
      className={`w-full transition-colors second-hero relative`}
    >
      <div className="container relative mx-auto px-4 pt-8 pb-0">
        <Card className="overflow-hidden border-none shadow-none bg-transparent">
          <CardContent className="grid gap-8 p-6 md:grid-cols-2 md:p-12 shadow-none">
            <div className="space-y-6">
              <div>
                <h1
                  className={`text-4xl font-semibold sm:text-5xl flex righteous-regular ${lilita.className} slide-up-title ${isVisible ? "visible" : ""}`}
                >
                  <span className="title-what mr-2">What is</span>

                 <AuroraText>Astrapuffs?</AuroraText>
                </h1>
              </div>
              <p
                style={{ fontWeight: 100 }}
                className={`text-2xl text-[#4a5568] font-thin leading-10  slide-up-description ${isVisible ? "visible" : ""}`}
              >
                <Letter3DSwap
          mainClassName={`text-2xl text-[#4a5568] font-thin leading-10  slide-up-description ${isVisible ? "visible" : ""}`}
          
          rotateDirection="top"
          staggerDuration={0.03}
          staggerFrom="first"
          transition={{ type: "spring", damping: 25, stiffness:  160 }}
        >
                Astrapuffs is an agentic NPC multiplayer that is set to
                revolutionize the cozy gaming genre. Our advanced AI-driven NPCs
                create dynamic, responsive, and immersive stories that adapt to
                  the player interactions in real-time.
                  </Letter3DSwap>
              </p>
              
              {/* <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="font-medium">
                  Get Started
                </Button>
                <Button variant="outline" size="lg" className="font-medium">
                  Learn More
                </Button>
              </div> */}
            </div>
            <div className="relative rounded-lg h-full flex items-center justify-center">
              <Image
                src={isDesktop?"":"/astra_2.webp"}
                alt="Astrapuff Preview"
                width={500}
                height={500}
                className={`mt-0 sm:w-[550px] sm:-mt-[100px] mx-auto bouncy-image sm:opacity-0 ${isVisible ? "visible" : ""}`}
                priority
              />
              
              {/* Stars GIF - appears in top corners of right container */}
              <Image 
                src="/gifs/stars2.gif" 
                alt="Stars animation"
                width={48}
                height={48}
                className="absolute w-30 bg-transparent h-auto z-10 transition-all duration-500"
                style={getStarsPosition()}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  console.log('Stars GIF not found at /gifs/stars.gif');
                }}
              />
            </div>
          </CardContent>
        </Card>

      </div>
              
        {/* Arrow GIF - appears at bottom of container (desktop only) */}
        {isDesktop && (
          <div>
            <Image 
              src="/gifs/arrow.gif" 
              alt="Arrow animation"
              width={64}
              height={64}
              className="absolute bottom-10 left-10 w-50 h-auto bg-transparent"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                console.log('Arrow GIF not found at /gifs/arrow.gif');
              }}
            />
          </div>
        )}
    </div>
  );
}