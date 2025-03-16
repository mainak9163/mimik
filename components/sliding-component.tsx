/* eslint-disable @next/next/no-img-element */
"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, X, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SlidingComponent = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Adding event listener for 'Escape' key press
useEffect(() => {
  const handleEsc = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleCloseClick();
    }
  };

  window.addEventListener('keydown', handleEsc);

  return () => {
    window.removeEventListener('keydown', handleEsc);
  };
}, []);
  
  const handleGameplayClick = () => {
    setShowVideo(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }, 600); // Start playing after transition completes
  };
  
  function handleCloseClick(){
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    setShowVideo(false);
  };
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
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
            style={{ backgroundImage: "url('/background2.png')" }}
          >
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-64 h-auto mb-8"
            />
            
            <div className="relative px-8 py-4 mb-8 text-center">
              {/* Blurred background for text */}
              <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-lg"></div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-white relative z-10 mb-2">
                Manifest your own dimension!
              </h1>
            </div>
            
            <Button 
              onClick={handleGameplayClick}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-lg"
            >
              gameplay
            </Button>
          </div>
        </div>
        
        {/* Right panel - Video */}
        <div className="w-screen h-full flex-shrink-0 relative bg-black">
          <div className="w-full h-full flex items-center justify-center">
            <video 
              ref={videoRef}
              className="w-full h-full md:h-auto object-contain max-h-screen"
              src="/video.mov"
              playsInline
            />
            
            {/* Video controls */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
              <Button 
                onClick={togglePlay} 
                variant="outline" 
                size="icon" 
                className="bg-black/50 cursor-pointer text-white border-white/20 hover:bg-black/70"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </Button>
              
              <Button 
                onClick={toggleMute} 
                variant="outline" 
                size="icon" 
                className="bg-black/50 cursor-pointer text-white border-white/20 hover:bg-black/70"
              >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </Button>
                          {/* Close button */}
            <Button 
              onClick={handleCloseClick}
              variant="outline" 
              size="icon" 
              className="bg-black/50 cursor-pointer text-white border-white/20 hover:bg-black/70"
            >
              <X size={24} />
            </Button>
            </div>
            

          </div>
        </div>
      </div>
    </div>
  );
};

export default SlidingComponent;