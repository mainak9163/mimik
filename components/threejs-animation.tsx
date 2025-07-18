"use client";

// Extend Window interface for __lastMousePosition
declare global {
  interface Window {
    __lastMousePosition?: { x: number; y: number };
  }
}

import React, { 
  useRef, 
  useState, 
  useEffect, 
  useCallback, 
  useMemo,
  Suspense 
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import * as THREE from "three";
import dynamic from "next/dynamic";

// Types
type SectionType = 
  | "one"
  | "two.one"
  | "one.one"
  | "two.two"
  | "two.three"
  | "two.four"
  | "two.five"
  | "three"
  | "four"
  | "five";

interface MousePosition {
  x: number;
  y: number;
}

interface ModelProps {
  currentSection: SectionType;
  isMobile: boolean;
  mousePosition: MousePosition;
}

// Constants
const AVATAR_CONFIG = {
  MIN_DISTANCE_FROM_EDGE: 100,
  DESKTOP_SCALE: 1,
  MOBILE_SCALE: 0.1,
  DESKTOP_FOLLOW_SCALE: 0.2,
  MODEL_PATH: "/models/astra3.glb",
  COMPRESSED_MODEL_PATH: "/models/scene-compressed.glb",
} as const;

const SECTION_POSITIONS = {
  one: {
    position: [-5, -1, 0] as const,
    rotation: [0, 0, 0] as const,
    scale: AVATAR_CONFIG.DESKTOP_SCALE,
  },
  "one.one": {
    position: [1.2, -0.8, 0] as const,
    rotation: [0, 0, 0] as const,
    scale: AVATAR_CONFIG.DESKTOP_SCALE,
  },
} as const;

const VALID_SECTIONS: SectionType[] = [
  "one",
  "one.one",
  "two.one",
  "two.two",
  "two.three",
  "two.four",
  "two.five",
  "three",
  "four",
  "five",
];

// Custom hooks
const useMousePosition = (shouldTrack: boolean) => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
  });

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const newPosition = {
      x: event.clientX + 200,
      y: event.clientY,
    };
    setMousePosition(newPosition);
    if (typeof window !== 'undefined') {
      window.__lastMousePosition = newPosition;
    }
  }, []);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      const newPosition = {
        x: touch.clientX,
        y: touch.clientY,
      };
      setMousePosition(newPosition);
      if (typeof window !== 'undefined') {
        window.__lastMousePosition = newPosition;
      }
    }
  }, []);

  useEffect(() => {
    if (!shouldTrack) return;

    const options = { passive: true } as const;
    
    window.addEventListener("mousemove", handleMouseMove, options);
    window.addEventListener("touchmove", handleTouchMove, options);
    window.addEventListener("touchstart", handleTouchMove, options);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchMove);
    };
  }, [shouldTrack, handleMouseMove, handleTouchMove]);

  return mousePosition;
};

const useScrollSection = () => {
  const [currentSection, setCurrentSection] = useState<SectionType>("one");

  const handleScroll = useCallback(() => {
    const sections = document.querySelectorAll("section");
    let active: SectionType | null = null;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight / 3) {
        if (VALID_SECTIONS.includes(section.id as SectionType)) {
          active = section.id as SectionType;
        }
      }
    });

    if (active && active !== currentSection) {
      setCurrentSection(active);
    }
  }, [currentSection]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return currentSection;
};

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

// Loading Screen Component
const LoadingScreen: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center z-50">
      <div className="text-center space-y-8">
        {/* Loading Animation */}
        <div className="relative">
          <div className="w-24 h-24 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-purple-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-white">
            Loading Experience
          </h2>
          <p className="text-purple-200 text-lg">
            Preparing your interactive journey...
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="w-80 mx-auto">
          <div className="flex justify-between text-sm text-purple-200 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
        
        {/* Loading Tips */}
        <div className="text-purple-300 text-sm max-w-md mx-auto">
          <p>✨ Interactive 3D model loading</p>
          <p>🎭 Preparing animations</p>
          <p>🎨 Optimizing visual effects</p>
        </div>
      </div>
    </div>
  );
};

// Model Component
const Model: React.FC<ModelProps> = ({ currentSection, isMobile, mousePosition }) => {
  const modelRef = useRef<THREE.Object3D | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const danceTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const danceTimeRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const prevSectionRef = useRef<SectionType>(currentSection);
  
  const { viewport } = useThree();
  const { scene, animations } = useGLTF(AVATAR_CONFIG.MODEL_PATH);

  // Initialize animation mixer
  useEffect(() => {
    if (!animations?.length) return;
    
    const mixer = new THREE.AnimationMixer(scene);
    mixer.clipAction(animations[0]).play();
    mixerRef.current = mixer;
    
    return () => {
      mixer.stopAllAction();
      mixerRef.current = null;
    };
  }, [scene, animations]);

  // Dance animation function
  const applyDanceAnimation = useCallback((time: number) => {
    if (!modelRef.current || isTransitioningRef.current) return;

    const basePosition = SECTION_POSITIONS["one.one"].position;
    
    // Create rhythmic dance movements
    const bounceY = Math.sin(time * 4) * 0.3;
    const swayX = Math.sin(time * 2) * 0.2;
    const bobZ = Math.sin(time * 3) * 0.1;
    
    modelRef.current.position.set(
      basePosition[0] + swayX,
      basePosition[1] + bounceY,
      basePosition[2] + bobZ
    );
    
    // Add rotational dance movements
    const rotationY = Math.sin(time * 1.5) * 0.3;
    const rotationX = Math.sin(time * 2.5) * 0.1;
    const rotationZ = Math.sin(time * 1.8) * 0.15;
    
    modelRef.current.rotation.set(rotationX, rotationY, rotationZ);
    
    // Add scale pulsing
    const pulsScale = 1 + Math.sin(time * 6) * 0.05;
    modelRef.current.scale.set(pulsScale, pulsScale, pulsScale);
  }, []);

  // Animation loop
  useFrame(useCallback((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    if (currentSection === "one.one" && !isTransitioningRef.current) {
      danceTimeRef.current += delta;
      applyDanceAnimation(danceTimeRef.current);
    }
  }, [currentSection, applyDanceAnimation]));

  // Transition to dance animation
  const transitionToDance = useCallback((isFirstTime: boolean = false) => {
    if (!modelRef.current) return;

    isTransitioningRef.current = true;
    
    if (danceTimelineRef.current) {
      danceTimelineRef.current.kill();
    }

    const { position, rotation, scale } = SECTION_POSITIONS["one.one"];
    
    const tl = gsap.timeline({
      onComplete: () => {
        isTransitioningRef.current = false;
        danceTimeRef.current = 0;
      }
    });

    if (isFirstTime) {
      tl.to(modelRef.current.rotation, {
        y: Math.PI * 2,
        duration: 2,
        ease: "power2.out",
      })
      .to(modelRef.current.position, {
        x: position[0],
        y: position[1],
        z: position[2],
        duration: 2,
        ease: "power2.inOut",
      }, "<")
      .to(modelRef.current.scale, {
        x: scale,
        y: scale,
        z: scale,
        duration: 1.5,
        ease: "power2.inOut",
      }, "<0.5")
      .to(modelRef.current.rotation, {
        x: rotation[0],
        y: rotation[1],
        z: rotation[2],
        duration: 1,
        ease: "power2.inOut",
      });
    } else {
      tl.to(modelRef.current.scale, {
        x: scale,
        y: scale,
        z: scale,
        duration: 1.5,
        ease: "power2.inOut",
      })
      .to(modelRef.current.position, {
        x: position[0],
        y: position[1],
        z: position[2],
        duration: 1.5,
        ease: "power2.inOut",
      }, "<")
      .to(modelRef.current.rotation, {
        x: rotation[0],
        y: rotation[1],
        z: rotation[2],
        duration: 1.5,
        ease: "power2.inOut",
      }, "<");
    }
  }, []);

  // Section transition animations
  useGSAP(() => {
    if (!modelRef.current) return;

    const prevSection = prevSectionRef.current;
    
    if (currentSection === "one") {
      const { position, rotation, scale } = SECTION_POSITIONS.one;
      
      isTransitioningRef.current = true;

      const tl = gsap.timeline({
        onComplete: () => {
          isTransitioningRef.current = false;
        }
      });

      tl.to(modelRef.current.position, {
        x: position[0],
        y: position[1],
        z: position[2],
        duration: 2.5,
        ease: "power2.inOut",
      })
      .to(modelRef.current.rotation, {
        x: rotation[0],
        y: rotation[1],
        z: rotation[2],
        duration: 2.5,
        ease: "power2.inOut",
      }, "<")
      .to(modelRef.current.scale, {
        x: scale,
        y: scale,
        z: scale,
        duration: 2.5,
        ease: "power2.inOut",
      }, "<");

      if (danceTimelineRef.current) {
        danceTimelineRef.current.kill();
      }
    } else if (currentSection === "one.one") {
      const isFirstTime = prevSection === "one";
      transitionToDance(isFirstTime);
    } else {
      // Mouse following sections
      const shrunkScale = isMobile
        ? AVATAR_CONFIG.MOBILE_SCALE
        : AVATAR_CONFIG.DESKTOP_FOLLOW_SCALE;

      isTransitioningRef.current = true;

      if (danceTimelineRef.current) {
        danceTimelineRef.current.kill();
      }

      // Apply constraints
      const minDistance = AVATAR_CONFIG.MIN_DISTANCE_FROM_EDGE;
      const constrainedMouseX = Math.max(
        minDistance,
        Math.min(window.innerWidth - minDistance, mousePosition.x),
      );
      const constrainedMouseY = Math.max(
        minDistance,
        Math.min(window.innerHeight - minDistance, mousePosition.y),
      );

      // Convert to 3D coordinates
      const x = (constrainedMouseX / window.innerWidth) * 2 - 1;
      const y = -(constrainedMouseY / window.innerHeight) * 2 + 1;

      const targetX = x * viewport.width * 0.5;
      const targetY = y * viewport.height * 0.5;

      const tl = gsap.timeline({
        onComplete: () => {
          isTransitioningRef.current = false;
        }
      });

      tl.to(modelRef.current.position, {
        x: targetX,
        y: targetY,
        z: 2,
        duration: 1.2,
        ease: "power2.out",
      })
      .to(modelRef.current.scale, {
        x: shrunkScale,
        y: shrunkScale,
        z: shrunkScale,
        duration: 1.5,
        ease: "power2.inOut",
      }, "<");

      // Face cursor
      const lookAtPosition = new THREE.Vector3(targetX, targetY, 2);
      const currentPosition = modelRef.current.position.clone();
      const direction = lookAtPosition.clone().sub(currentPosition).normalize();

      const targetRotationY = Math.atan2(direction.x, direction.z);
      const targetRotationX = Math.asin(-direction.y);

      tl.to(modelRef.current.rotation, {
        x: targetRotationX,
        y: targetRotationY,
        z: 0,
        duration: 1.2,
        ease: "power2.out",
      }, "<");
    }
    
    prevSectionRef.current = currentSection;
  }, [currentSection, isMobile, mousePosition.x, mousePosition.y, viewport, transitionToDance]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (danceTimelineRef.current) {
        danceTimelineRef.current.kill();
      }
    };
  }, []);

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={AVATAR_CONFIG.DESKTOP_SCALE}
      position={[-5, -1, 0]}
      rotation={[0, 0, 0]}
    />
  );
};

// Lighting Component
const Lights: React.FC = () => (
  <>
    <ambientLight intensity={1.5} />
    <directionalLight position={[500, 500, 500]} intensity={1} />
  </>
);

// Main Component
const ThreeJSAnimation: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const currentSection = useScrollSection();
  const isMobile = useMobileDetection();
  const shouldTrackMouse = useMemo(() => 
    currentSection.startsWith("two") || ["three", "four", "five"].includes(currentSection),
    [currentSection]
  );
  const mousePosition = useMousePosition(shouldTrackMouse);

  // Handle loading progress
  useEffect(() => {
    const handleProgress = (progress: number) => {
      setLoadingProgress(progress);
    };

    const handleLoaded = () => {
      setLoadingProgress(1);
      // Add a small delay to show 100% before hiding
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };

    // Preload model and track progress
    useGLTF.preload(AVATAR_CONFIG.MODEL_PATH);
    
    // Simulate loading progress (you can replace this with actual loading events)
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.1;
      handleProgress(Math.min(progress, 0.9));
      
      if (progress >= 0.9) {
        clearInterval(interval);
        // Trigger loaded after a delay
        setTimeout(handleLoaded, 1000);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <LoadingScreen progress={loadingProgress} />;
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <Canvas
        className="pointer-events-none"
        style={{ filter: "saturate(1.4)" }}
        camera={{ position: [0, 0, 13], fov: 10 }}
      >
        <Lights />
        <Suspense fallback={null}>
          <Model
            currentSection={currentSection}
            isMobile={isMobile}
            mousePosition={mousePosition}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

// Export with SSR disabled
const ThreeJSAnimationWithNoSSR = dynamic(
  () => Promise.resolve(ThreeJSAnimation),
  { ssr: false }
);

export default ThreeJSAnimationWithNoSSR;