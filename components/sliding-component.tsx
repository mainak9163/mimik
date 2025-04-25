/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type Player from "@vimeo/player";

// Add TypeScript declaration for the Vimeo Player
declare global {
  interface Window {
    Vimeo?: {
      Player: Player;
    };
  }
}

const SlidingComponent = () => {
  const [showVideo, setShowVideo] = useState(false);
  const iframeWrapperRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player>(null);

  // Adding event listener for 'Escape' key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseClick();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleGameplayClick = () => {
    setShowVideo(true);

    // Load Vimeo script if it doesn't exist yet
    if (
      !document.querySelector(
        'script[src="https://player.vimeo.com/api/player.js"]'
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
              const iframe = document.getElementById('vimeo_player');
              if (iframe) {
                //@ts-expect-error global type not getting caught
                playerRef.current = new window.Vimeo.Player(iframe);
                
                // Enter fullscreen mode
                playerRef.current?.ready().then(() => {
                  // After player is ready, play and enter fullscreen
                  playerRef.current?.play().then(() => {
                    playerRef.current?.requestFullscreen();
                  }).catch((error: unknown) => {
                    console.error("Error playing video:", error);
                  });
                }).catch((error: unknown) => {
                  console.error("Player not ready:", error);
                });
              }
            } else {
              console.error("Vimeo Player API not loaded");
            }
          }, 1000); // Wait for iframe and API to be ready
        }
      }, 600);
    }
  }, [showVideo]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Container for both panels */}
      <div
        className={cn(
          "flex transition-transform duration-500 ease-in-out w-[200vw] h-full",
          showVideo ? "transform -translate-x-1/2" : ""
        )}
      >
        {/* Left panel - Logo */}
        <div className="w-screen h-full flex-shrink-0 relative">
          <div
            className="w-full h-full bg-cover bg-center flex flex-col items-center justify-center"
            style={{ backgroundImage: "url('/astrapuff-bg.webp')" }}
          >
            <img src="/logo-small.png" alt="Logo" className="w-96 h-auto mb-8" />

            <button
              onClick={handleGameplayClick}
              className="cursor-pointer flex items-center justify-center gap-2 bg-linear-to-r text-white py-6 px-8 rounded-xl hover:scale-110 active:scale-90 transition-colors text-5xl"
            >
              <img src="./clappboard.webp" alt="play trailer" />
            </button>
          </div>
        </div>

        {/* Right panel - Vimeo Video */}
        <div className="w-screen h-full flex-shrink-0 relative">
          <div className="absolute p-8 w-full flex justify-end">
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