"use client"
import { useState } from "react";

 export default function WaveText({ text="", className = "" }) {
    const [waveActive, setWaveActive] = useState(false);

    const handleMouseEnter = () => {
      setWaveActive(true);
      setTimeout(() => setWaveActive(false), text.length * 50 + 400);
    };

    return (
      <div 
        className={`inline-flex cursor-pointer ${className}`}
        onMouseEnter={handleMouseEnter}
        >
             <style jsx>{`
        .character {
          display: inline-block;
          transform-origin: center bottom;
          transition: transform 0.1s ease-out;
        }
        
        .character.wave-animate {
          animation: stretchBounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
        
        @keyframes stretchBounce {
          0% {
            transform: scaleY(1) translateY(0);
          }
          25% {
            transform: scaleY(1.4) translateY(8px) scaleX(0.9);
          }
          45% {
            transform: scaleY(0.7) translateY(-5px) scaleX(1.1);
          }
          65% {
            transform: scaleY(1.15) translateY(2px) scaleX(0.95);
          }
          80% {
            transform: scaleY(0.95) translateY(-1px) scaleX(1.02);
          }
          100% {
            transform: scaleY(1) translateY(0) scaleX(1);
          }
        }
      `}</style>
        {text.split('').map((char, index) => (
          <span
            key={index}
            className={`character ${waveActive ? 'wave-animate' : ''}`}
            style={{
              animationDelay: `${index * 0.03}s`
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
    );
  };