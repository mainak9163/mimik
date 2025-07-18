"use client";

import Image from "next/image";
import { useEffect, useRef, useState,  useMemo, memo } from "react";
import dynamic from "next/dynamic";

// import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card";
import { lilita } from "@/lib/fonts";
import "@/styles/second-hero.css";

// Lazy load heavy components
const Letter3DSwap = dynamic(() => import("./ui/letter-3d-swap"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-10 rounded" />
});

const AuroraText = dynamic(() => import("./ui/aurora-text").then(mod => ({ default: mod.AuroraText })), {
  ssr: false,
  loading: () => <span className="inline-block animate-pulse bg-gray-200 h-8 w-32 rounded" />
});

// Memoized components
const StarsGif = memo(({ position }: { position: { top: string; right?: string; left?: string } }) => (
  <Image 
    src="/gifs/stars2.gif" 
    alt="Stars animation"
    width={48}
    height={48}
    className="absolute w-30 bg-transparent h-auto z-10 transition-all duration-500"
    style={position}
    loading="lazy"
    onError={(e) => {
      (e.target as HTMLImageElement).style.display = 'none';
      console.log('Stars GIF not found at /gifs/stars.gif');
    }}
  />
));

StarsGif.displayName = "StarsGif";

const ArrowGif = memo(() => (
  <Image 
    src="/gifs/arrow.gif" 
    alt="Arrow animation"
    width={64}
    height={64}
    className="absolute bottom-10 left-10 w-50 h-auto bg-transparent"
    loading="lazy"
    onError={(e) => {
      (e.target as HTMLImageElement).style.display = 'none';
      console.log('Arrow GIF not found at /gifs/arrow.gif');
    }}
  />
));

ArrowGif.displayName = "ArrowGif";

const MainImage = memo(({ isDesktop, isVisible }: { isDesktop: boolean; isVisible: boolean }) => (
  <Image
    src={isDesktop ? "" : "/astra_2.webp"}
    alt="Astrapuff Preview"
    width={500}
    height={500}
    className={`mt-0 sm:w-[550px] sm:-mt-[100px] mx-auto bouncy-image sm:opacity-0 ${isVisible ? "visible" : ""}`}
    priority={!isDesktop}
    loading={isDesktop ? "lazy" : "eager"}
    sizes="(max-width: 768px) 100vw, 550px"
    quality={85}
  />
));

MainImage.displayName = "MainImage";

// Custom hook for intersection observer
const useIntersectionObserver = (threshold = 0.1, rootMargin = "-50px 0px") => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold, rootMargin }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin]);

  return [ref, isVisible] as const;
};

// Custom hook for responsive detection
const useResponsive = () => {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    // Check on mount
    checkDesktop();
    
    // Debounce resize handler
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkDesktop, 100);
    };
    
    window.addEventListener('resize', debouncedResize);
    
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return isDesktop;
};

// Custom hook for stars animation
const useStarsAnimation = () => {
  const [starsPosition, setStarsPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStarsPosition((prev) => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return starsPosition;
};

export default function SecondHero() {
  const [sectionRef, isVisible] = useIntersectionObserver();
  const isDesktop = useResponsive();
  const starsPosition = useStarsAnimation();

  // Memoize star positions array to prevent recreating on every render
  const starPositions = useMemo(() => [
    { top: '10px', right: '10px' },     // Top-right
    { top: '10px', left: '10px' },      // Top-left
    { top: '60px', right: '10px' },     // Second from top-right
    { top: '60px', left: '10px' }       // Second from top-left
  ], []);

  // Memoize current star position
  const currentStarPosition = useMemo(() => 
    starPositions[starsPosition], 
    [starPositions, starsPosition]
  );

  // Memoize Letter3DSwap props to prevent unnecessary re-renders
  const letter3DSwapProps = useMemo(() => ({
    mainClassName: `text-2xl text-[#4a5568] font-thin leading-10 slide-up-description ${isVisible ? "visible" : ""}`,
    rotateDirection: "top" as const,
    staggerDuration: 0.03,
    staggerFrom: "first" as const,
    transition: { type: "spring" as const, damping: 25, stiffness: 160 }
  }), [isVisible]);

  // Memoize the text content to prevent Letter3DSwap from re-processing
  const textContent = useMemo(() => 
    "Astrapuffs is an agentic NPC multiplayer that is set to revolutionize the cozy gaming genre. Our advanced AI-driven NPCs create dynamic, responsive, and immersive stories that adapt to the player interactions in real-time.",
    []
  );

  return (
    <div
      ref={sectionRef}
      className="w-full transition-colors second-hero relative"
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
              
              <div
                style={{ fontWeight: 100 }}
                className={`text-2xl text-[#4a5568] font-thin leading-10 slide-up-description ${isVisible ? "visible" : ""}`}
              >
                <Letter3DSwap {...letter3DSwapProps}>
                  {textContent}
                </Letter3DSwap>
              </div>
              
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
              <MainImage isDesktop={isDesktop} isVisible={isVisible} />
              
              {/* Stars GIF - appears in top corners of right container */}
              <StarsGif position={currentStarPosition} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Arrow GIF - appears at bottom of container (desktop only) */}
      {isDesktop && (
        <div>
          <ArrowGif />
        </div>
      )}
    </div>
  );
}