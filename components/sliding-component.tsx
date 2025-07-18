/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
// import dynamic from "next/dynamic";

// Dynamically import confetti to reduce bundle size
// const confetti = dynamic(() => import('canvas-confetti'), {
//   ssr: false,
//   loading: () => null,
// });

// Type definitions
interface VimeoPlayer {
  ready: () => Promise<void>;
  play: () => Promise<void>;
  requestFullscreen: () => Promise<void>;
}

declare global {
  interface Window {
    Vimeo: {
      Player: new (iframe: HTMLIFrameElement) => VimeoPlayer;
    };
  }
}

// Constants
const VIMEO_VIDEO_ID = "1073594430";
const VIMEO_HASH = "c25806ace0";
const MOBILE_BREAKPOINT = 768;
const PARALLAX_RATES = {
  CHARACTER: -0.2,
  PLAY_BUTTON: -0.7,
  LOGO: -2,
} as const;

// Custom hook for mobile detection
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

// Custom hook for parallax effect
const useParallax = (isMobile: boolean, showVideo: boolean) => {
  const logoRef = useRef<HTMLDivElement | null>(null);
  const playButtonRef = useRef<HTMLDivElement | null>(null);
  const characterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isMobile || showVideo) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      
      requestAnimationFrame(() => {
        if (logoRef.current) {
          logoRef.current.style.transform = `translateY(${scrolled * PARALLAX_RATES.LOGO}px)`;
        }
        if (playButtonRef.current) {
          playButtonRef.current.style.transform = `translateY(${scrolled * PARALLAX_RATES.PLAY_BUTTON}px)`;
        }
        if (characterRef.current) {
          characterRef.current.style.transform = `translateY(${scrolled * PARALLAX_RATES.CHARACTER}px)`;
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, showVideo]);

  return { logoRef, playButtonRef, characterRef };
};

// Custom hook for Vimeo player
const useVimeoPlayer = (showVideo: boolean) => {
  const iframeWrapperRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<VimeoPlayer | null>(null);

  const loadVimeoScript = useCallback(() => {
    if (!document.querySelector('script[src="https://player.vimeo.com/api/player.js"]')) {
      const script = document.createElement("script");
      script.src = "https://player.vimeo.com/api/player.js";
      script.async = true;
      script.onload = () => {
        console.log("Vimeo script loaded");
      };
      document.head.appendChild(script);
    }
  }, []);

  const initializePlayer = useCallback(() => {
    if (!iframeWrapperRef.current) return;

    const iframeHTML = `
      <div style="padding:56.25% 0 0 0;position:relative;">
        <iframe 
          src="https://player.vimeo.com/video/${VIMEO_VIDEO_ID}?h=${VIMEO_HASH}&badge=0&autopause=0&player_id=vimeo_player&app_id=58479" 
          frameborder="0" 
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" 
          style="position:absolute;top:0;left:0;width:100%;height:100%;" 
          title="Astrapuff gameplay Alpha 6 - no logo"
          id="vimeo_player">
        </iframe>
      </div>
    `;

    iframeWrapperRef.current.innerHTML = iframeHTML;

    setTimeout(() => {
      if (window.Vimeo) {
        const iframe = document.getElementById("vimeo_player") as HTMLIFrameElement | null;
        if (iframe) {
          playerRef.current = new window.Vimeo.Player(iframe);

          playerRef.current
            ?.ready()
            .then(() => {
              return playerRef.current?.play();
            })
            .then(() => {
              return playerRef.current?.requestFullscreen();
            })
            .catch((error: any) => {
              console.error("Error with video player:", error);
            });
        }
      }
    }, 1000);
  }, []);

  const cleanupPlayer = useCallback(() => {
    if (iframeWrapperRef.current) {
      iframeWrapperRef.current.innerHTML = "";
    }
    playerRef.current = null;
  }, []);

  useEffect(() => {
    if (showVideo && iframeWrapperRef.current) {
      setTimeout(initializePlayer, 600);
    }
  }, [showVideo, initializePlayer]);

  return { iframeWrapperRef, loadVimeoScript, cleanupPlayer };
};

const SlidingComponent = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const parallaxRef = useRef<HTMLDivElement | null>(null);
  
  const isMobile = useIsMobile();
  const { logoRef, playButtonRef, characterRef } = useParallax(isMobile, showVideo);
  const { iframeWrapperRef, loadVimeoScript, cleanupPlayer } = useVimeoPlayer(showVideo);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showVideo) {
        event.preventDefault();
        handleCloseClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showVideo]);

  const handleGameplayClick = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Load confetti and trigger it
      const confettiModule = await import('canvas-confetti');
      if (confettiModule.default) {
        confettiModule.default();
      }

      // Load Vimeo script
      loadVimeoScript();

      // Show video after confetti
      setTimeout(() => {
        setShowVideo(true);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error loading resources:", error);
      setIsLoading(false);
    }
  }, [isLoading, loadVimeoScript]);

  const handleCloseClick = useCallback(() => {
    setShowVideo(false);
    cleanupPlayer();
  }, [cleanupPlayer]);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-[100]"
      >
        Skip to main content
      </a>

      {/* Container for both panels */}
      <div
        className={cn(
          "flex transition-transform duration-500 ease-in-out w-[200vw]",
          showVideo ? "transform -translate-x-1/2" : "",
        )}
        role="main"
        id="main-content"
      >
        {/* Left panel - Logo with Parallax */}
        <section
          ref={parallaxRef}
          className="w-screen flex-shrink-0 relative"
          style={{ height: "100vh" }}
          aria-label="Game introduction"
        >
          {/* Background Layer */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('/astrapuff-bg2.webp')",
              backgroundAttachment: isMobile ? "scroll" : "fixed",
            }}
            role="img"
            aria-label="Game background"
          />

          {/* Logo - Top Left */}
          <div
            ref={logoRef}
            className="absolute top-32 left-1/2 -translate-x-1/2 z-20 overflow-hidden"
          >
            <Image
              src="/logo-small.png"
              alt="Astrapuff Game Logo"
              width={320}
              height={160}
              className="w-48 sm:w-80 h-auto"
              priority
              sizes="(max-width: 640px) 192px, 320px"
            />
          </div>

          {/* Character - Bottom Center */}
          <div
            ref={characterRef}
            className="absolute -bottom-[20%] left-0 transform -translate-x-0 z-10 hidden sm:block"
            aria-hidden="true"
          >
<Image
  src="/cropped-parallax_character.webp"
  alt="Game character"
  width={650}
  height={800}
  className="h-auto max-w-[650px] w-full aspect-[650/800] hidden sm:block"
  loading="lazy"
  sizes="650px"
/>
          </div>

          {/* Play Button - Bottom Right */}
          <div
            ref={playButtonRef}
            className="absolute bottom-8 sm:left-[60%] left-1/2 -translate-x-1/2 sm:translate-x-0 z-20"
          >
            <button
              onClick={handleGameplayClick}
              disabled={isLoading}
              className={cn(
                "cursor-pointer flex flex-col items-center justify-center gap-4 text-white transition-transform duration-200",
                "hover:scale-110 active:scale-90 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
              aria-label="Play game trailer"
              type="button"
            >
              <Image
                src="/clappboard.webp"
                alt=""
                width={90}
                height={90}
                className="h-16 w-16 sm:h-90 sm:w-90"
                loading="lazy"
                aria-hidden="true"
              />
              <span className="font-black rounded-full text-lg sm:text-xl bg-amber-300 px-6 py-2 border-4 border-white text-slate-800 tracking-wider shadow-lg">
                {isLoading ? "Loading..." : "Play Trailer"}
              </span>
            </button>
          </div>
        </section>

        {/* Right panel - Vimeo Video */}
        <section 
          className="w-screen h-screen flex-shrink-0 relative"
          aria-label="Video player"
        >
          <div className="absolute p-8 w-full flex justify-end z-50">
            {/* Close button */}
            <Button
              onClick={handleCloseClick}
              variant="outline"
              size="icon"
              className="bg-black/50 cursor-pointer text-white border-white/20 hover:bg-black/70 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="Close video and return to main screen"
              type="button"
            >
              <X size={48} aria-hidden="true" />
            </Button>
          </div>
          <div className="w-full h-full flex items-center justify-center">
            <div 
              ref={iframeWrapperRef} 
              className="w-full max-w-4xl"
              role="region"
              aria-label="Video player content"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default SlidingComponent;