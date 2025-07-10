/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

// pumpkin shape from https://thenounproject.com/icon/pumpkin-5253388/

//@ts-expect-error sdsd
const pumpkin = confetti.shapeFromPath({
  path: 'M449.4 142c-5 0-10 .3-15 1a183 183 0 0 0-66.9-19.1V87.5a17.5 17.5 0 1 0-35 0v36.4a183 183 0 0 0-67 19c-4.9-.6-9.9-1-14.8-1C170.3 142 105 219.6 105 315s65.3 173 145.7 173c5 0 10-.3 14.8-1a184.7 184.7 0 0 0 169 0c4.9.7 9.9 1 14.9 1 80.3 0 145.6-77.6 145.6-173s-65.3-173-145.7-173zm-220 138 27.4-40.4a11.6 11.6 0 0 1 16.4-2.7l54.7 40.3a11.3 11.3 0 0 1-7 20.3H239a11.3 11.3 0 0 1-9.6-17.5zM444 383.8l-43.7 17.5a17.7 17.7 0 0 1-13 0l-37.3-15-37.2 15a17.8 17.8 0 0 1-13 0L256 383.8a17.5 17.5 0 0 1 13-32.6l37.3 15 37.2-15c4.2-1.6 8.8-1.6 13 0l37.3 15 37.2-15a17.5 17.5 0 0 1 13 32.6zm17-86.3h-82a11.3 11.3 0 0 1-6.9-20.4l54.7-40.3a11.6 11.6 0 0 1 16.4 2.8l27.4 40.4a11.3 11.3 0 0 1-9.6 17.5z',
  matrix: [0.020491803278688523, 0, 0, 0.020491803278688523, -7.172131147540983, -5.9016393442622945]
});
// tree shape from https://thenounproject.com/icon/pine-tree-1471679/
//@ts-expect-error sdsd
const tree = confetti.shapeFromPath({
  path: 'M120 240c-41,14 -91,18 -120,1 29,-10 57,-22 81,-40 -18,2 -37,3 -55,-3 25,-14 48,-30 66,-51 -11,5 -26,8 -45,7 20,-14 40,-30 57,-49 -13,1 -26,2 -38,-1 18,-11 35,-25 51,-43 -13,3 -24,5 -35,6 21,-19 40,-41 53,-67 14,26 32,48 54,67 -11,-1 -23,-3 -35,-6 15,18 32,32 51,43 -13,3 -26,2 -38,1 17,19 36,35 56,49 -19,1 -33,-2 -45,-7 19,21 42,37 67,51 -19,6 -37,5 -56,3 25,18 53,30 82,40 -30,17 -79,13 -120,-1l0 41 -31 0 0 -41z',
  matrix: [0.03597122302158273, 0, 0, 0.03597122302158273, -4.856115107913669, -5.071942446043165]
});
// heart shape from https://thenounproject.com/icon/heart-1545381/
//@ts-expect-error sdsd
const heart = confetti.shapeFromPath({
  path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z',
  matrix: [0.03333333333333333, 0, 0, 0.03333333333333333, -5.566666666666666, -5.533333333333333]
});

const defaults = {
  scalar: 2,
  spread: 180,
  particleCount: 30,
  origin: { y: -0.1 },
  startVelocity: -35,
};

// GSAP would be imported like this in a real project
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// Mock GSAP for demo purposes
const mockGsap = {
  context: (fn: () => void) => {
    fn();
    return { revert: () => {} };
  },
  registerPlugin: () => {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timeline: (config: { scrollTrigger: any }) => ({
    to: () => mockGsap.timeline(config),
    scrollTrigger: config.scrollTrigger,
  }),
  to: () => {},
};

// Add Vimeo Player type declaration to avoid TypeScript error
declare global {
  interface Window {
    Vimeo: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Player: new (iframe: HTMLIFrameElement) => any;
    };
  }
}

const SlidingComponent = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const iframeWrapperRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);

  // Parallax refs
  const parallaxRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const playButtonRef = useRef<HTMLDivElement | null>(null);
  const characterRef = useRef<HTMLDivElement | null>(null);
  const backgroundRef = useRef<HTMLDivElement | null>(null);

  // Check if mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Parallax effect setup (only on desktop)
  useEffect(() => {
    if (isMobile || showVideo) return;

    // In a real implementation, you would use actual GSAP
    // let ctx = gsap.context(() => {
    //   gsap.registerPlugin(ScrollTrigger);
    //
    //   const tl = gsap.timeline({
    //     scrollTrigger: {
    //       trigger: parallaxRef.current,
    //       start: "top top",
    //       end: "bottom top",
    //       scrub: 1,
    //       onUpdate: (self) => {
    //         const progress = self.progress;
    //
    //         // Background moves slower (parallax base)
    //         if (backgroundRef.current) {
    //           gsap.set(backgroundRef.current, {
    //             y: progress * 100
    //           });
    //         }
    //
    //         // Logo moves faster
    //         if (logoRef.current) {
    //           gsap.set(logoRef.current, {
    //             y: -progress * 200
    //           });
    //         }
    //
    //         // Play button moves faster
    //         if (playButtonRef.current) {
    //           gsap.set(playButtonRef.current, {
    //             y: -progress * 250
    //           });
    //         }
    //
    //         // Character moves fastest
    //         if (characterRef.current) {
    //           gsap.set(characterRef.current, {
    //             y: -progress * 300
    //           });
    //         }
    //       }
    //     }
    //   });
    // });

    // Mock scroll effect for demo
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.2;
      const fastRate = scrolled * -0.7;
      const fasterRate = scrolled * -2;
      // const fastestRate = scrolled * -2;

      // if (backgroundRef.current) {
      //   backgroundRef.current.style.transform = `translateY(${rate}px)`;
      // }
      if (logoRef.current) {
        logoRef.current.style.transform = `translateY(${fasterRate}px)`;
      }
      if (playButtonRef.current) {
        playButtonRef.current.style.transform = `translateY(${fastRate}px)`;
      }
      if (characterRef.current) {
        characterRef.current.style.transform = `translateY(${rate}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, showVideo]);

  // Adding event listener for 'Escape' key press
  useEffect(() => {
    const handleEsc = (event: { key: string }) => {
      if (event.key === "Escape") {
        handleCloseClick();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleGameplayClick = () => {
    confetti({
      ...defaults,
      shapes: [pumpkin],
      colors: ["#ff9a00", "#ff7400", "#ff4d00"],
    });
    confetti({
      ...defaults,
      shapes: [tree],
      colors: ["#8d960f", "#be0f10", "#445404"],
    });
    confetti({
      ...defaults,
      shapes: [heart],
      colors: ["#f93963", "#a10864", "#ee0b93"],
    });
    //trigger video after showing confetti
    setTimeout(() => {
      setShowVideo(true);
    }, 500);

    // Load Vimeo script if it doesn't exist yet
    if (
      !document.querySelector(
        'script[src="https://player.vimeo.com/api/player.js"]',
      )
    ) {
      const script = document.createElement("script");
      script.src = "https://player.vimeo.com/api/player.js";
      document.body.appendChild(script);
    }
  };

  function handleCloseClick() {
    setShowVideo(false);

    // Clear the iframe content to stop the video
    if (iframeWrapperRef.current) {
      iframeWrapperRef.current.innerHTML = "";
    }
    // Reset the player ref
    playerRef.current = null;
  }

  // Effect to load iframe content after transition and initialize the player
  useEffect(() => {
    if (showVideo && iframeWrapperRef.current) {
      // Wait for the transition to complete before loading the iframe
      setTimeout(() => {
        if (iframeWrapperRef.current) {
          iframeWrapperRef.current.innerHTML = `
            <div style="padding:56.25% 0 0 0;position:relative;">
              <iframe 
                src="https://player.vimeo.com/video/1073594430?h=c25806ace0&amp;badge=0&amp;autopause=0&amp;player_id=vimeo_player&amp;app_id=58479" 
                frameborder="0" 
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" 
                style="position:absolute;top:0;left:0;width:100%;height:100%;" 
                title="Astrapuff gameplay Alpha 6 - no logo"
                id="vimeo_player">
              </iframe>
            </div>
          `;

          // Give a little time for the iframe to load
          setTimeout(() => {
            // Check if Vimeo Player API is loaded
            if (window.Vimeo) {
              // Initialize the player
              const iframe = document.getElementById(
                "vimeo_player",
              ) as HTMLIFrameElement | null;
              if (iframe) {
                playerRef.current = new window.Vimeo.Player(iframe);

                // Enter fullscreen mode
                playerRef.current
                  ?.ready()
                  .then(() => {
                    // After player is ready, play and enter fullscreen
                    playerRef.current
                      ?.play()
                      .then(() => {
                        playerRef.current?.requestFullscreen();
                      })
                      .catch((error: any) => {
                        console.error("Error playing video:", error);
                      });
                  })
                  .catch((error: any) => {
                    console.error("Player not ready:", error);
                  });
              }
            } else {
              console.error("Vimeo Player API not loaded");
            }
          }, 1000);
        }
      }, 600);
    }
  }, [showVideo]);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Container for both panels */}
      <div
        className={cn(
          "flex transition-transform duration-500 ease-in-out w-[200vw]",
          showVideo ? "transform -translate-x-1/2" : "",
        )}
      >
        {/* Left panel - Logo with Parallax */}
        <div
          ref={parallaxRef}
          className="w-screen flex-shrink-0 relative"
          style={{ height: isMobile ? "100vh" : "100vh" }}
        >
          {/* Background Layer */}
          <div
            ref={backgroundRef}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('/astrapuff-bg2.webp')",
              backgroundAttachment: isMobile ? "scroll" : "fixed",
            }}
          />

          {/* Logo - Top Left */}
          <div
            ref={logoRef}
            className="absolute top-32 left-1/2 -translate-x-1/2 z-20 overflow-hidden"
          >
            <img
              src="/logo-small.png"
              alt="Logo"
              className="w-48 sm:w-80 h-auto"
            />
          </div>

          {/* Character - Bottom Center */}
          <div
            ref={characterRef}
            className="absolute -bottom-[20%] left-0 transform -translate-x-0 z-10 hidden sm:block"
          >
            <img
              src="/parallax_character.webp"
              alt="Character"
              className="h-auto max-w-[650px] w-full"
            />
          </div>

          {/* Play Button - Bottom Right */}
          <div
            ref={playButtonRef}
            className="absolute bottom-8  sm:left-[60%] left-1/2 -translate-x-1/2 sm:translate-x-0 z-20"
          >
            <button
              onClick={handleGameplayClick}
              className="cursor-pointer flex flex-col items-center justify-center gap-4 text-white hover:scale-110 active:scale-90 transition-transform duration-200"
            >
              <img
                src="./clappboard.webp"
                alt="play trailer"
                className="h-16 w-16 sm:h-90 sm:w-90"
              />
              <span className="font-black rounded-full text-lg sm:text-xl bg-amber-300 px-6 py-2 border-4 border-white text-slate-800 tracking-wider shadow-lg">
                Play Trailer
              </span>
            </button>
          </div>
        </div>

        {/* Right panel - Vimeo Video */}
        <div className="w-screen h-screen flex-shrink-0 relative">
          <div className="absolute p-8 w-full flex justify-end z-50">
            {/* Close button */}
            <Button
              onClick={handleCloseClick}
              variant="outline"
              size="icon"
              className="bg-black/50 cursor-pointer text-white border-white/20 hover:bg-black/70"
            >
              <X size={48} />
            </Button>
          </div>
          <div className="w-full h-full flex items-center justify-center">
            {/* This div will be populated with the iframe when showVideo is true */}
            <div ref={iframeWrapperRef} className="w-full max-w-4xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlidingComponent;
