"use client"
import Image from 'next/image';

interface AvatarFeaturerProps {
  bgColor: string;  // Background color for the button    
  imgSrc: string;   // Image source for the avatar
  onClick: () => void; // Click handler for the button
  isSelected?: boolean; // Optional prop to indicate if the avatar is selected
}
export default function AvatarFeaturer({ bgColor, imgSrc, onClick, isSelected }: AvatarFeaturerProps) {
  return (
    <button onClick={onClick}
      style={{ backgroundColor: isSelected ? bgColor : 'transparent' }}
      className={`relative w-[104px] h-[84px] hover:scale-105 transition-all duration-500 cursor-pointer [clip-path:polygon(20%_0,_100%_0,_100%_100%,_0_100%,_0_27.1%)] rounded-b-lg rounded-tr-lg border border-white/10 overflow-hidden group`}>
      <style>
        {
          `
            
.holographic-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    0deg, 
    transparent, 
    transparent 30%, 
    rgba(255, 255, 255, 0.7)
  );
  transform: rotate(-45deg);
  transition: all 0.5s ease;
  opacity: 0;
}

.holographic-card:hover {
  box-shadow: 0 0 20px rgba(255,255,255,0.7);
}

.holographic-card:hover::before {
  opacity: 1;
  transform: rotate(-45deg) translateY(100%);
}
          `
        }
      </style>
      <div className="holographic-card h-[95%] w-[95%] mx-auto rounded-b-lg rounded-tr-lg [clip-path:polygon(20%_0,_100%_0,_100%_100%,_0_100%,_0_27.1%)] relative z-10">
        <Image
          src={imgSrc}
          alt="Avatar"
          width={104}
          height={84}
          className="w-full h-full rounded-b-lg rounded-tr-lg object-cover"
        />
      </div>
    </button>
  );
}