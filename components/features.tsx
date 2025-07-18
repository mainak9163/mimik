"use client"

// types
export interface FeatureData {
  id: string;
  title: string;
  description: string;
  image: string | string[];
  asset: string;
}

export interface FeatureProps extends FeatureData {
  index: number;
}

// useIntersectionObserver.ts
import { useEffect, useRef, useState } from 'react';

export const useIntersectionObserver = (options: IntersectionObserverInit = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, ...options }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [options]);

  return { ref, isVisible };
};

// asset-icon
import { memo } from 'react';
import FireIcon from '@/lib/fire';
import TreeIcon from '@/lib/tree';
import ShieldIcon from '@/lib/shield';
import IcecreamIcon from '@/lib/ice-cream';
import MagicIcon from '@/lib/magic';

interface AssetIconProps {
  type: string;
}

const iconConfig = {
  fire: { icon: FireIcon, className: 'text-orange-500' },
  tree: { icon: TreeIcon, className: 'text-green-600' },
  shield: { icon: ShieldIcon, className: 'text-blue-600' },
  icecream: { icon: IcecreamIcon, className: 'text-pink-500' },
  magic: { icon: MagicIcon, className: 'text-purple-600' },
} as const;

export const AssetIcon = memo<AssetIconProps>(({ type }) => {
  const config = iconConfig[type as keyof typeof iconConfig];
  
  if (!config) return null;

  const { icon: Icon, className } = config;
  
  return (
    <div className={`w-9 h-9 hidden lg:block mr-3 ${className}`}>
      <Icon />
    </div>
  );
});

AssetIcon.displayName = 'AssetIcon';

import Image from 'next/image';
import CustomCarousel from './custom-carousel';

interface FeatureImageProps {
  image: string | string[];
  title: string;
  isVisible: boolean;
  index: number;
}

export const FeatureImage = memo<FeatureImageProps>(({ 
  image, 
  title, 
  isVisible, 
  index 
}) => {
  return (
    <div
      className={`w-full transform transition-all duration-700 ease-out group ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 200 + 100}ms` }}
    >
      <div className="relative overflow-hidden rounded-3xl transition-all duration-300 hover:scale-105 hover:rotate-1 animate-bounce-subtle">
        {Array.isArray(image) ? (
          <div className="transform transition-transform duration-300">
            <CustomCarousel images={image} autoPlayInterval={5000} />
          </div>
        ) : (
          <Image
            src={image}
            alt={title}
            width={600}
            height={400}
            className="w-full object-cover rounded-3xl transform transition-transform duration-300"
            priority={index < 2}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
      </div>
    </div>
  );
});

FeatureImage.displayName = 'FeatureImage';

import { Card, CardContent } from '@/components/ui/card';
import { righteous, nunito } from '@/lib/fonts';

export const Feature = memo<FeatureProps>(({
  index,
  title,
  id,
  description,
  image,
  asset,
}) => {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section id={id} ref={ref}>
      <div className="w-full transition-colors py-3">
        <div className="container relative mx-auto px-4 pt-16">
          <Card className="overflow-hidden border-none bg-transparent shadow-none">
            <CardContent
              className={`flex gap-10 lg:gap-20 justify-between flex-col ${
                index % 2 ? 'lg:flex-row-reverse' : 'lg:flex-row'
              }`}
            >
              <div
                className={`my-auto space-y-6 w-full transform transition-all duration-700 ease-out ${
                  isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center">
                  <AssetIcon type={asset} />
                  <h2
                    className={`text-5xl font-semibold bg-gradient-to-r from-purple-600 via-pink-400 to-blue-600 bg-clip-text text-black/40 ${righteous.className}`}
                  >
                    {title}
                  </h2>
                </div>
                <p
                  className={`text-xl bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent leading-relaxed ${nunito.className}`}
                >
                  {description}
                </p>
              </div>
              <FeatureImage
                image={image}
                title={title}
                isVisible={isVisible}
                index={index}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
});

Feature.displayName = 'Feature';

export const FEATURES_DATA: FeatureData[] = [
  {
    id: 'two.one',
    title: 'Companionship',
    description: `AstraPuffs feature Agentic NPCs that act as your in-game companions, tell stories, help solve puzzles, spark quests, and engage in heartfelt conversations—making every interaction feel like an adventure with a trusted friend`,
    image: '/features/companion.webp',
    asset: 'fire',
  },
  {
    id: 'two.two',
    title: 'Calm',
    description: `Landscapes shift with your journey—from cozy meadows to glowing crystal caves—each designed to spark curiosity and invite peaceful exploration, blending comfort with a sense of magical discovery.`,
    image: '/features/dia.webp',
    asset: 'tree',
  },
  {
    id: 'two.three',
    title: 'Safety',
    description: `To foster kindness, players who use toxic language are gently "bubbled," causing their speech to appear as playful gibberish to other players. They can still play and interact with Astras, but group chat stays safe and respectful`,
    image: '/features/safety.webp',
    asset: 'shield',
  },
  {
    id: 'two.four',
    title: 'Delight',
    description: `AstraPuffs bring joy through playful mechanics like making bubbles and flying. Whether you're gliding across shimmering skies or popping bubbles with friends, moments of wonder are always just a tap away`,
    image: '/features/delight.webp',
    asset: 'icecream',
  },
  {
    id: 'two.five',
    title: 'Fun',
    description: `From whimsical rain dances to grass-growing minigames, AstraPuffs offers endless fun. Shake trees for candies, recycle with purpose, and craft across entire dimensions filled with color, magic, and whymsical experiences`,
    image: '/features/fun.webp',
    asset: 'magic',
  },
];



import { lilita } from '@/lib/fonts';
import { AuroraText } from './ui/aurora-text';

const Features = memo(() => {
  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, #f8f9ff 0%, #fff5f8 50%, #f0fff4 100%)',
      }}
    >
      <style>{
        `
          @keyframes bounce-subtle {
  0%, 100% { 
    transform: translateY(0); 
  }
  50% { 
    transform: translateY(-2px); 
  }
}

@keyframes sway {
  0%, 100% { 
    transform: rotate(-2deg); 
  }
  50% { 
    transform: rotate(2deg); 
  }
}

@keyframes spin-slow {
  from { 
    transform: rotate(0deg); 
  }
  to { 
    transform: rotate(360deg); 
  }
}

@keyframes subtleBounce {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-15px) rotate(2deg);
  }
  50% {
    transform: translateY(-25px) rotate(-1deg);
  }
  75% {
    transform: translateY(-10px) rotate(1deg);
  }
}

.animate-bounce-subtle {
  animation: bounce-subtle 6s ease-in-out infinite;
}

.animate-sway {
  animation: sway 3s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}

.subtle {
  animation: subtleBounce 1.8s ease-in-out infinite;
}

        `
      }</style>
      <div className="container relative mx-auto px-4 pt-16">
        <h1
          className={`text-4xl text-center tracking-tighter sm:text-5xl text-[#4a5568] ${lilita.className}`}
        >
          Key
          <AuroraText className="ml-2">Features</AuroraText>
        </h1>
      </div>
      
      {FEATURES_DATA.map((feature, index) => (
        <Feature
          key={feature.id}
          index={index}
          {...feature}
        />
      ))}
    </div>
  );
});

Features.displayName = 'Features';

export default Features;