"use client";
import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import * as THREE from "three";

// Global configuration constants
const AVATAR_CONFIG = {
  MIN_DISTANCE_FROM_EDGE: 100, // Minimum distance from screen edges in pixels
  DESKTOP_SCALE: 1,
  MOBILE_SCALE: 0.1,
  DESKTOP_FOLLOW_SCALE: 0.2,
};

declare global {
  interface Window {
    __lastMousePosition?: { x: number; y: number };
  }
}

// Model component that handles the 3D model
const Model = ({
  currentSection,
  isMobile,
  mousePosition,
}: {
  currentSection:
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
  isMobile: boolean;
  mousePosition: { x: number; y: number };
}) => {
  const modelRef = useRef<THREE.Object3D | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const danceTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const danceTimeRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const { viewport } = useThree();

  // Use drei's useGLTF hook instead of manually using GLTFLoader
  const { scene, animations } = useGLTF("/models/astra3.glb");

  // Section positions configuration
  const sectionPositions = {
    one: {
      position: [-5, -1, 0], // Off-screen left
      rotation: [0, 0, 0],
      scale: AVATAR_CONFIG.DESKTOP_SCALE,
    },
    "one.one": {
      position: [1.2, -0.8, 0], // Final dance position
      rotation: [0, 0, 0],
      scale: AVATAR_CONFIG.DESKTOP_SCALE,
    },
  };

  // Initialize animation mixer
  useEffect(() => {
    if (animations && animations.length > 0) {
      const mixer = new THREE.AnimationMixer(scene);
      mixer.clipAction(animations[0]).play();
      mixerRef.current = mixer;
    }
  }, [scene, animations]);

  // Dance animation function (from original code)
  const applyDanceAnimation = (time: number) => {
    if (!modelRef.current || isTransitioningRef.current) return;

    // Get the base position for one.one
    const basePosition = sectionPositions["one.one"].position;
    
    // Create rhythmic dance movements
    const bounceY = Math.sin(time * 4) * 0.3; // Vertical bounce
    const swayX = Math.sin(time * 2) * 0.2; // Side-to-side sway
    const bobZ = Math.sin(time * 3) * 0.1; // Front-to-back bob
    
    // Apply dance position
    modelRef.current.position.set(
      basePosition[0] + swayX,
      basePosition[1] + bounceY,
      basePosition[2] + bobZ
    );
    
    // Add rotational dance movements
    const rotationY = Math.sin(time * 1.5) * 0.3; // Twist
    const rotationX = Math.sin(time * 2.5) * 0.1; // Nod
    const rotationZ = Math.sin(time * 1.8) * 0.15; // Tilt
    
    modelRef.current.rotation.set(
      rotationX,
      rotationY,
      rotationZ
    );
    
    // Add scale pulsing for extra dance effect
    const pulsScale = 1 + Math.sin(time * 6) * 0.05;
    modelRef.current.scale.set(pulsScale, pulsScale, pulsScale);
  };

  // Animation loop
  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    // Apply dance animation only in section one.one and when not transitioning
    if (currentSection === "one.one" && !isTransitioningRef.current) {
      danceTimeRef.current += delta;
      applyDanceAnimation(danceTimeRef.current);
    }
  });

  // Function to handle smooth transition into dancing position
  const transitionToDance = (isFirstTime: boolean = false) => {
    if (!modelRef.current) return;

    isTransitioningRef.current = true;
    
    // Stop any existing dance timeline
    if (danceTimelineRef.current) {
      danceTimelineRef.current.kill();
    }

    const { position, rotation, scale } = sectionPositions["one.one"];
    
    // Create entrance animation timeline
    const tl = gsap.timeline({
      onComplete: () => {
        isTransitioningRef.current = false;
        danceTimeRef.current = 0; // Reset dance time
      }
    });

    if (isFirstTime) {
      // First time entrance: rotate while moving into position
      tl.to(modelRef.current.rotation, {
        y: Math.PI * 2, // Full rotation
        duration: 2,
        ease: "power2.out",
      })
      .to(modelRef.current.position, {
        x: position[0],
        y: position[1],
        z: position[2],
        duration: 2,
        ease: "power2.inOut",
      }, "<") // Start at the same time as rotation
      .to(modelRef.current.scale, {
        x: scale,
        y: scale,
        z: scale,
        duration: 1.5,
        ease: "power2.inOut",
      }, "<0.5") // Start 0.5 seconds after rotation begins
      .to(modelRef.current.rotation, {
        x: rotation[0],
        y: rotation[1],
        z: rotation[2],
        duration: 1,
        ease: "power2.inOut",
      }); // End with proper rotation
    } else {
      // Returning from other sections: smooth scale and position transition
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
      }, "<") // Start at the same time as scale
      .to(modelRef.current.rotation, {
        x: rotation[0],
        y: rotation[1],
        z: rotation[2],
        duration: 1.5,
        ease: "power2.inOut",
      }, "<"); // Start at the same time as scale
    }
  };

  // Track previous section to determine transition type
  const prevSectionRef = useRef<string>(currentSection);

  // GSAP animations for model position, rotation, and scale
  useGSAP(() => {
    if (modelRef.current) {
      const prevSection = prevSectionRef.current;
      
      if (currentSection === "one") {
        // Hide model off-screen in section one
        const { position, rotation, scale } = sectionPositions.one;
        
        isTransitioningRef.current = true;

        gsap.to(modelRef.current.position, {
          x: position[0],
          y: position[1],
          z: position[2],
          duration: 2.5,
          ease: "power2.inOut",
        });

        gsap.to(modelRef.current.rotation, {
          x: rotation[0],
          y: rotation[1],
          z: rotation[2],
          duration: 2.5,
          ease: "power2.inOut",
        });

        gsap.to(modelRef.current.scale, {
          x: scale,
          y: scale,
          z: scale,
          duration: 2.5,
          ease: "power2.inOut",
          onComplete: () => {
            isTransitioningRef.current = false;
          }
        });

        // Stop dance animation
        if (danceTimelineRef.current) {
          danceTimelineRef.current.kill();
        }
      } else if (currentSection === "one.one") {
        // Determine if this is first time or returning from other sections
        const isFirstTime = prevSection === "one";
        transitionToDance(isFirstTime);
      } else {
        // For sections two and beyond, shrink and follow mouse
        const shrunkScale = isMobile
          ? AVATAR_CONFIG.MOBILE_SCALE
          : AVATAR_CONFIG.DESKTOP_FOLLOW_SCALE;

        isTransitioningRef.current = true;

        // Stop dance animation
        if (danceTimelineRef.current) {
          danceTimelineRef.current.kill();
        }

        // Apply minimum distance constraint from edges
        const minDistance = AVATAR_CONFIG.MIN_DISTANCE_FROM_EDGE;
        const constrainedMouseX = Math.max(
          minDistance,
          Math.min(window.innerWidth - minDistance, mousePosition.x),
        );
        const constrainedMouseY = Math.max(
          minDistance,
          Math.min(window.innerHeight - minDistance, mousePosition.y),
        );

        // Convert constrained mouse position to 3D world coordinates
        const x = (constrainedMouseX / window.innerWidth) * 2 - 1;
        const y = -(constrainedMouseY / window.innerHeight) * 2 + 1;

        // Scale coordinates to viewport
        const targetX = x * viewport.width * 0.5;
        const targetY = y * viewport.height * 0.5;

        // Smooth position following
        gsap.to(modelRef.current.position, {
          x: targetX,
          y: targetY,
          z: 2, // Bring it closer to camera
          duration: 1.2,
          ease: "power2.out",
        });

        // Shrink the model
        gsap.to(modelRef.current.scale, {
          x: shrunkScale,
          y: shrunkScale,
          z: shrunkScale,
          duration: 1.5,
          ease: "power2.inOut",
          onComplete: () => {
            isTransitioningRef.current = false;
          }
        });

        // Make model face the cursor
        const lookAtPosition = new THREE.Vector3(targetX, targetY, 2);
        const currentPosition = modelRef.current.position.clone();
        const direction = lookAtPosition
          .clone()
          .sub(currentPosition)
          .normalize();

        // Calculate rotation to face the cursor
        const targetRotationY = Math.atan2(direction.x, direction.z);
        const targetRotationX = Math.asin(-direction.y);

        gsap.to(modelRef.current.rotation, {
          x: targetRotationX,
          y: targetRotationY,
          z: 0,
          duration: 1.2,
          ease: "power2.out",
        });
      }
      
      // Update previous section
      prevSectionRef.current = currentSection;
    }
  }, [currentSection, isMobile, mousePosition.x, mousePosition.y, viewport]);

  // Reset dance time when leaving one.one section
  useEffect(() => {
    if (currentSection !== "one.one") {
      danceTimeRef.current = 0;
    }
  }, [currentSection]);

  // Cleanup dance animation on unmount
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
      position={[-5, -1, 0]} // Start off-screen
      rotation={[0, 0, 0]} // Start facing the user
    />
  );
};

// Loading placeholder
const LoadingPlaceholder = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
};

// Lighting setup
const Lights = () => {
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[500, 500, 500]} intensity={1} />
    </>
  );
};

// Function to get current mouse position
const getCurrentMousePosition = (): { x: number; y: number } => {
  // Try to get mouse position from recent mouse events
  let mouseX = window.innerWidth / 2; // Default to center
  let mouseY = window.innerHeight / 2;

  // Create a temporary event listener to capture mouse position
  const captureMousePosition = (event: MouseEvent) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  };

  // Add listener briefly to capture current position
  document.addEventListener("mousemove", captureMousePosition, {
    once: true,
    passive: true,
  });

  // If we have a recent mouse position stored, use it
  const storedPosition = window?.__lastMousePosition;
  if (storedPosition) {
    mouseX = storedPosition?.x;
    mouseY = storedPosition?.y;
  }

  return { x: mouseX, y: mouseY };
};

// Main component
const ThreeJSAnimation = () => {
  const [currentSection, setCurrentSection] = useState<
    | "one"
    | "one.one"
    | "two.one"
    | "two.two"
    | "two.three"
    | "two.four"
    | "two.five"
    | "three"
    | "four"
    | "five"
  >("one");
  const [isMobile, setIsMobile] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Initialize mouse position on mount
  useEffect(() => {
    // Set initial mouse position to center of screen
    setMousePosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    // Store mouse position globally for reference
    const storeMousePosition = (event: MouseEvent) => {
      window.__lastMousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    // Always track mouse position globally
    window.addEventListener("mousemove", storeMousePosition, { passive: true });

    return () => {
      window.removeEventListener("mousemove", storeMousePosition);
    };
  }, []);

  // Mouse tracking for avatar following
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX + 200,
        y: event.clientY,
      });
    };

    // Track mouse when in sections two and beyond
    if (currentSection.startsWith("two") || ["three", "four", "five"].includes(currentSection)) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [currentSection]);

  // Handle section changes - get current mouse position immediately
  useEffect(() => {
    if (currentSection.startsWith("two") || ["three", "four", "five"].includes(currentSection)) {
      // Get current mouse position when transitioning to cursor-following sections
      const currentPos = getCurrentMousePosition();
      setMousePosition(currentPos);
    }
  }, [currentSection]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      let active:
        | "one"
        | "one.one"
        | "two.one"
        | "two.two"
        | "two.three"
        | "two.four"
        | "two.five"
        | "three"
        | "four"
        | "five"
        | "" = "";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 3) {
          if (
            [
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
            ].includes(section.id)
          ) {
            active = section.id as
              | "one"
              | "one.one"
              | "two.one"
              | "two.two"
              | "two.three"
              | "two.four"
              | "two.five"
              | "three"
              | "four"
              | "five";
          }
        }
      });

      if (active && active !== currentSection) {
        setCurrentSection(active);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentSection]);

  // Handle touch events for mobile
  useEffect(() => {
    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        const newPosition = {
          x: touch.clientX,
          y: touch.clientY,
        };
        setMousePosition(newPosition);
        // Also store globally
        window.__lastMousePosition = newPosition;
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        const newPosition = {
          x: touch.clientX,
          y: touch.clientY,
        };
        setMousePosition(newPosition);
        // Also store globally
        window.__lastMousePosition = newPosition;
      }
    };

    // Track touch when in cursor-following sections and on mobile
    if ((currentSection.startsWith("two") || ["three", "four", "five"].includes(currentSection)) && isMobile) {
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      window.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
    }

    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [currentSection, isMobile]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      <Canvas
        style={{ pointerEvents: "none",filter: "saturate(1.4)" }}
        camera={{ position: [0, 0, 13], fov: 10 }}
      >
        <Lights />
        <Suspense fallback={<LoadingPlaceholder />}>
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

// Preload the model
useGLTF.preload("/models/scene-compressed.glb");//compressed version of astra3.glb

// Since Next.js uses server-side rendering by default, we need to use
// dynamic import with ssr: false for Three.js components
import dynamic from "next/dynamic";

const ThreeJSAnimationWithNoSSR = dynamic(
  () => Promise.resolve(ThreeJSAnimation),
  { ssr: false },
);

export default ThreeJSAnimationWithNoSSR;