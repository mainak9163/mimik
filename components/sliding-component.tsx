/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SlidingComponent = () => {
  const [showVideo, setShowVideo] = useState(false);
  const iframeWrapperRef = useRef<HTMLDivElement>(null);

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
  }

  // Effect to load iframe content after transition
  useEffect(() => {
    if (showVideo && iframeWrapperRef.current) {
      // Wait for the transition to complete before loading the iframe
      setTimeout(() => {
        if (iframeWrapperRef.current) {
          iframeWrapperRef.current.innerHTML = `
            <div style="padding:56.25% 0 0 0;position:relative;">
              <iframe 
                src="https://player.vimeo.com/video/1073594430?h=c25806ace0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" 
                frameborder="0" 
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" 
                style="position:absolute;top:0;left:0;width:100%;height:100%;" 
                title="Atrapuff gameplay Alpha 6 - no logo">
              </iframe>
            </div>
          `;
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
              className="cursor-pointer flex items-center justify-center gap-2 bg-linear-to-r  text-white py-6 px-8 rounded-xl hover:scale-110 active:scale-90 transition-colors text-5xl"
            >
              <img src="./clappboard.webp" alt="play trailer" />
              {/* <Film size={48} /> */}
              {/* <span>Watch Trailer</span> */}
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
              className=" bg-black/50 cursor-pointer text-white border-white/20 hover:bg-black/70"
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
