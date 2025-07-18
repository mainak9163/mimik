"use client";

import { useState, useEffect, useCallback, useMemo, useRef, memo } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { lilita } from "@/lib/fonts";
import "@/styles/second-hero.css";
import { AuroraText } from "./ui/aurora-text";
import ScrambleHover from "./ui/scramble-hover";

// Lazy load heavy components
const AvatarFeaturer = dynamic(() => import("./avatar-component"), {
  loading: () => <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
});

const Dialog = dynamic(() => import("@/components/ui/dialog").then(mod => ({
  default: mod.Dialog
})));

const DialogContent = dynamic(() => import("@/components/ui/dialog").then(mod => ({
  default: mod.DialogContent
})));

const DialogHeader = dynamic(() => import("@/components/ui/dialog").then(mod => ({
  default: mod.DialogHeader
})));

const DialogTitle = dynamic(() => import("@/components/ui/dialog").then(mod => ({
  default: mod.DialogTitle
})));

// Types
interface AstrapuffData {
  name: string;
  imageUrl: string;
  bgColor: string;
  property: React.ReactNode;
}

interface ImageTransform {
  x: number;
  y: number;
  scale: number;
}

// Constants moved outside component to prevent recreation
const MOBILE_BREAKPOINT = 1024;
const MAX_STRETCH = 30;
// const TRANSFORM_TRANSITION_DURATION = 300;
const CHANGE_ANIMATION_DURATION = 150;

// Memoized static data
const astrapuffs: readonly AstrapuffData[] = [
  {
    name: "Cluepuff",
    imageUrl: "/examples/avatar1.webp",
    bgColor: "#fb923c",
    property: (
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">
            🧩 Puzzle Dimension Guide
          </h2>
          <p className="text-gray-700 leading-relaxed">
            From a mind-bending realm of M.C. Escher-like illusions where
            reality twists through endless loops and impossible geometries.
            Cluepuff is an enigmatic puzzle master with a razor-sharp wit,
            speaking in clever puns and cryptic riddles that both amuse and
            intrigue. Always thinking several steps ahead, they reveal solutions
            piece by piece, making every interaction a delightful mental
            challenge.
          </p>
        </div>
      </div>
    ),
  },
  {
    name: "Terrabloom",
    imageUrl: "/examples/avatar2.webp",
    bgColor: "#4ade80",
    property: (
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">
            🌸 Verdant Expanse Nurturer
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Hails from an enchanted realm where every step blooms flowers and
            nature dances in perpetual celebration. This gentle soul embodies
            the resilience and beauty of the natural world, offering nurturing
            care and fierce protection to all living things. With an empathetic
            heart and healing touch, Terrabloom brings growth and harmony
            wherever they go.
          </p>
        </div>
      </div>
    ),
  },
  {
    name: "Lucyfluff",
    imageUrl: "/examples/avatar3.webp",
    bgColor: "#f87171",
    property: (
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">
            ⚡ Techno Nexus Innovator
          </h2>
          <p className="text-gray-700 leading-relaxed">
            A brilliant digital native from a cyberpunk wonderland of flowing
            data streams and holographic cities. Quick-witted and endlessly
            curious, Lucyfluff navigates complex technology with playful
            mischief and infectious enthusiasm. Their impish humor and warm
            personality transform even the most intimidating tech concepts into
            delightful adventures of discovery.
          </p>
        </div>
      </div>
    ),
  },
  {
    name: "Glimmerstorm",
    imageUrl: "/examples/avatar4.webp",
    bgColor: "#facc15",
    property: (
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">
            ⛈️ Tempest Realm Conductor
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Master of the ever-changing Tempest Realm where weather performs a
            breathtaking symphony across dynamic skies. Gentle and kind-hearted,
            Glimmerstorm&apos;s mood flows like the weather they command—from
            serene morning calm to exhilarating stormy passion. They bring
            balance and wonder, adapting gracefully to the energy of those
            around them.
          </p>
        </div>
      </div>
    ),
  },
  {
    name: "Aurabloom",
    imageUrl: "/examples/avatar5.webp",
    bgColor: "#60a5fa",
    property: (
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">
            🍦 Ice Cream Dimension Sweetkeeper
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Guardian of a deliciously sweet frozen paradise where hills are made
            of velvety ice cream and rivers flow with liquid caramel. Despite
            their chilly domain, Aurabloom radiates warmth through their
            nurturing spirit and gentle care. Always ready with comforting words
            and sweet smiles, they bring joy and refreshment to weary souls
            seeking solace.
          </p>
        </div>
      </div>
    ),
  },
] as const;

// Memoized background style
const backgroundStyle = {
  background: "linear-gradient(135deg, #f8f9ff 0%, #fff5f8 50%, #f0fff4 100%)",
};

// Memoized navigation button component
const NavigationButton = memo(({ 
  onClick, 
  direction, 
  ariaLabel 
}: {
  onClick: () => void;
  direction: 'left' | 'right';
  ariaLabel: string;
}) => {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
  
  return (
    <button
      onClick={onClick}
      className="z-20 rounded-full active:opacity-50 hover:opacity-75 transition-opacity"
      aria-label={ariaLabel}
      type="button"
    >
      <Icon className="w-20 h-20 cursor-pointer" />
    </button>
  );
});

NavigationButton.displayName = 'NavigationButton';

// Memoized avatar image component
const AvatarImage = memo(({ 
  src, 
  alt, 
  className,
  transform,
  onMouseMove,
  onMouseLeave,
  priority = false
}: {
  src: string;
  alt: string;
  className?: string;
  transform?: ImageTransform;
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: () => void;
  priority?: boolean;
}) => {
  const imageStyle = transform ? {
    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
  } : undefined;

  return (
    <div
      className={className}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-all duration-300 ease-out"
        style={imageStyle}
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
});

AvatarImage.displayName = 'AvatarImage';

// Custom hook for responsive design
const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return isMobile;
};

// Custom hook for image transform
const useImageTransform = () => {
  const [imageTransform, setImageTransform] = useState<ImageTransform>({
    x: 0,
    y: 0,
    scale: 1,
  });
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const deltaX = (mouseX - centerX) / rect.width;
    const deltaY = (mouseY - centerY) / rect.height;

    const stretchX = Math.max(
      -MAX_STRETCH,
      Math.min(MAX_STRETCH, deltaX * MAX_STRETCH),
    );
    const stretchY = Math.max(
      -MAX_STRETCH,
      Math.min(MAX_STRETCH, deltaY * MAX_STRETCH),
    );

    setImageTransform({
      x: stretchX,
      y: stretchY,
      scale: 1.05,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setImageTransform({ x: 0, y: 0, scale: 1 });
  }, []);

  return { imageTransform, handleMouseMove, handleMouseLeave, imageRef };
};

// Main component
export default function AvatarShowcase() {
  const [selectedAvatar, setSelectedAvatar] = useState<AstrapuffData>(astrapuffs[0]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);

  const isMobile = useResponsive();
  const { imageTransform, handleMouseMove, handleMouseLeave } = useImageTransform();

  // Memoized handlers
  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + astrapuffs.length) % astrapuffs.length);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % astrapuffs.length);
  }, []);

  const handleAvatarClick = useCallback((avatar: AstrapuffData) => {
    if (isMobile) {
      setSelectedAvatar(avatar);
      setDialogOpen(true);
    } else {
      if (selectedAvatar.name !== avatar.name) {
        setIsChanging(true);
        setTimeout(() => {
          setSelectedAvatar(avatar);
          setTimeout(() => setIsChanging(false), 50);
        }, CHANGE_ANIMATION_DURATION);
      }
    }
  }, [isMobile, selectedAvatar.name]);

  // Memoized current avatar for mobile
  const currentAvatar = useMemo(() => astrapuffs[currentIndex], [currentIndex]);

  // Memoized title component
  const title = useMemo(() => (
    <h2 className={`text-4xl font-semibold sm:text-5xl righteous-regular text-center ${lilita.className}`}>
      <span className="title-what">Explore our</span>
      <AuroraText className="ml-3">Astrapuffs</AuroraText>
    </h2>
  ), []);

  // Mobile layout
  if (isMobile) {
    return (
      <div className="min-h-screen w-full transition-colors py-8" style={backgroundStyle}>
        {title}
        <div className="container relative mx-auto px-4 py-16">
          <Card className="overflow-hidden border-none bg-background/60 shadow-none">
            <CardContent className="grid gap-8 p-6 md:grid-cols-2 md:p-12">
              <div className="relative flex flex-col items-center">
                <div className="flex w-full justify-between pb-6">
                  <NavigationButton
                    onClick={handlePrevious}
                    direction="left"
                    ariaLabel="Previous avatar"
                  />
                  <div className="text-center">
                    <h3 className="mb-2 text-3xl sm:text-4xl font-semibold">
                      <ScrambleHover text={currentAvatar.name} />
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleAvatarClick(currentAvatar)}
                      aria-label={`Learn more about ${currentAvatar.name}`}
                    >
                      <Info className="h-4 w-4" />
                      Know More
                    </Button>
                  </div>
                  <NavigationButton
                    onClick={handleNext}
                    direction="right"
                    ariaLabel="Next avatar"
                  />
                </div>

                <div className="relative h-[400px] w-full overflow-hidden rounded-lg bg-gradient-to-b from-background/10 to-background/60 backdrop-blur-sm">
                  <div className="flex h-full items-center justify-center">
                    <div className="flex h-[400px] w-full flex-col items-center justify-center gap-4 rounded-lg bg-card p-6 shadow-md transition-all duration-300">
                      <div className="relative h-full w-full flex justify-center flex-shrink-0 overflow-hidden rounded-full">
                        <AvatarImage
                          src={currentAvatar.imageUrl}
                          alt={`${currentAvatar.name} avatar`}
                          className="relative w-auto h-full"
                          priority={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedAvatar && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {selectedAvatar.name}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4 md:grid-cols-[200px_1fr]">
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <AvatarImage
                    src={selectedAvatar.imageUrl}
                    alt={`${selectedAvatar.name} avatar`}
                    className="relative w-full h-full"
                  />
                </div>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="prose prose-sm dark:prose-invert">
                    {selectedAvatar.property}
                  </div>
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="w-full transition-colors py-16" style={backgroundStyle}>
      {title}
      <div className="container mx-auto py-16 pb-0">
        <div className="flex gap-x-2">
          {/* Avatar List */}
          <div className="flex w-[35%] flex-col gap-4 p-6 pr-0 rounded-lg">
            <div className="flex flex-wrap gap-4">
              {astrapuffs.map((avatar) => (
                <AvatarFeaturer
                  key={avatar.name}
                  imgSrc={avatar.imageUrl}
                  bgColor={avatar.bgColor}
                  onClick={() => handleAvatarClick(avatar)}
                  isSelected={selectedAvatar.name === avatar.name}
                />
              ))}
            </div>
          </div>

          {/* Avatar Image */}
          <div className="flex w-[35%] items-start justify-center p-6 pl-0 rounded-lg overflow-hidden">
            <AvatarImage
              src={selectedAvatar.imageUrl}
              alt={`${selectedAvatar.name} avatar`}
              className={`relative w-80 h-80 overflow-hidden rounded-full cursor-pointer transition-all duration-300 ease-out ${
                isChanging ? "transform translate-y-full" : "transform translate-y-0"
              }`}
              transform={imageTransform}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              priority={true}
            />
          </div>

          {/* Name and Description */}
          <div className="flex flex-col w-[30%] p-2 rounded-lg">
            <h1 className="text-4xl font-bold mb-6">
              <ScrambleHover text={selectedAvatar.name} />
            </h1>
            <ScrollArea className="flex-1">
              <div className="prose prose-sm dark:prose-invert">
                {selectedAvatar.property}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}