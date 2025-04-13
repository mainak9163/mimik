"use client"
import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import * as THREE from 'three';

// Model component that handles the 3D model
const Model = ({ currentSection, isMobile }: { currentSection: 'one' | 'two.one' | 'one.one' | 'two.two' | 'two.three' | 'two.four' | 'two.five' | 'three' | 'four' | 'five', isMobile: boolean }) => {
  const modelRef = useRef<THREE.Object3D | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  
  // Use drei's useGLTF hook instead of manually using GLTFLoader
  const { scene, animations } = useGLTF('/models/astra3.glb');
  
  // Section positions configuration for desktop
  const desktopPositions = {
    'one': {
      position: [1.5, -1, 0],
      rotation: [0, 0, 0]
    },
    'one.one': {
      position: [-1.6, -1, 0],
      rotation: [0, 0, 0]
    },
    'two.one': {
      position: [-1.6, -1, 0],
      rotation: [-0.2, 0.5, 0]
    },
    'two.two': {
      position: [1.8, -1, -2],
      rotation: [-0.3, -0.5, 0]
    },
    'two.three': {
      position: [-1.6, -1, 0],
      rotation: [-0.2, 0.5, 0]
    },
    'two.four': {
      position: [1.8, -1, -2],
      rotation: [-0.3, -0.5, 0]
    },
    'two.five': {
      position: [-1.6, -1, 0],
      rotation: [-0.2, 0.5, 0]
    },
    'three': {
      position: [1.8, -1, -2],
      rotation: [-0.3, -0.5, 0]
    },
    'four': {
      position: [-2.5, 0.4, -5],
      rotation: [0.5, 0.5, 0]
    },
    'five': {
      position: [1.5, -0.5, 0],
      rotation: [0, -0.5, 0]
    }
  };

  // Section positions configuration for mobile
  // const mobilePositions = {
  //   'one': {
  //     position: [0, 0.5, 0],
  //     rotation: [0, 0, 0]
  //   },
  //   'one.one': {
  //     position: [2.5, -1, 0],
  //     rotation: [0, 0, 0]
  //   },
  //   'two.one': {
  //     position: [-0.3, -1, 0],
  //     rotation: [-0.2, 0.5, 0]
  //   },
  //   'two.two': {
  //     position: [.3, -1, -2],
  //     rotation: [-0.3, -0.5, 0]
  //   },
  //   'two.three': {
  //     position: [-.3, -1, 0],
  //     rotation: [-0.2, 0.5, 0]
  //   },
  //   'two.four': {
  //     position: [.3, -1, -2],
  //     rotation: [-0.3, -0.5, 0]
  //   },
  //   'two.five': {
  //     position: [-.3, -1, 0],
  //     rotation: [-0.2, 0.5, 0]
  //   },
  //   'three': {
  //     position: [.4, -1, -2],
  //     rotation: [-0.3, -0.5, 0]
  //   },
  //   'four': {
  //     position: [-.5, 0.4, -5],
  //     rotation: [0.5, 0.5, 0]
  //   },
  //   'five': {
  //     position: [.3, -1, -2],
  //     rotation: [-0.3, -0.5, 0]
  //   }
  // };

  // Initialize animation mixer
  useEffect(() => {
    if (animations && animations.length > 0) {
      const mixer = new THREE.AnimationMixer(scene);
      mixer.clipAction(animations[0]).play();
      mixerRef.current = mixer;
    }
  }, [scene, animations]);

  // Animation loop
  useFrame((_, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  // GSAP animations for model position and rotation based on device type
  useGSAP(() => {
    if (modelRef.current) {
      // Select the appropriate positions based on device type
      const positionsToUse = isMobile ? desktopPositions : desktopPositions;
      
      if (positionsToUse[currentSection]) {
        const { position, rotation } = positionsToUse[currentSection];

        gsap.to(modelRef.current.position, {
          x: position[0],
          y: position[1],
          z: position[2],
          duration: 2.5,
          ease: "power2.inOut"
        });

        gsap.to(modelRef.current.rotation, {
          x: rotation[0],
          y: rotation[1],
          z: rotation[2],
          duration: 2.5,
          ease: "power2.inOut"
        });
      }
    }
  }, [currentSection, isMobile]);

  // Calculate appropriate scale based on device
  const scale = 0.8;

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={scale}
      position={[-3, -1, 0]}
      // position={[0, -1, 0]}
      rotation={[0, 1.5, 0]}
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
      <directionalLight 
        position={[500, 500, 500]} 
        intensity={1} 
      />
    </>
  );
};

// Main component
const ThreeJSAnimation = () => {
  const [currentSection, setCurrentSection] = useState<'one' | 'one.one' | 'two.one' | 'two.two' | 'two.three' | 'two.four' | 'two.five' | 'three' | 'four' | 'five'>('one');
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      let active: 'one' | 'one.one' | 'two.one' | 'two.two' | 'two.three' | 'two.four' | 'two.five' | 'three' | 'four' | 'five' | '' = '';
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 3) {
          if (['one', 'one.one', 'two.one', 'two.two', 'two.three', 'two.four', 'two.five', 'three', 'four', 'five'].includes(section.id)) {
            active = section.id as 'one' | 'one.one' | 'two.one' | 'two.two' | 'two.three' | 'two.four' | 'two.five' | 'three' | 'four' | 'five';
          }
          console.log({active, sectionId: section.id})
        }
      });
      
      if (active && active !== currentSection) {
        setCurrentSection(active);
      }
    };

    // this is perfomantly poor, we need intersection observers
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSection]);

  return (
    <div 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        zIndex: 50, 
        pointerEvents: 'none'
      }}
    >
      <Canvas
        style={{pointerEvents: 'none'}}
        camera={{ position: [0, 0, 13], fov: 10 }}
      >
        <Lights />
        <Suspense fallback={<LoadingPlaceholder />}>
          <Model currentSection={currentSection} isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
};

// Preload the model
useGLTF.preload('/models/astra3.glb');

// Since Next.js uses server-side rendering by default, we need to use
// dynamic import with ssr: false for Three.js components
import dynamic from 'next/dynamic';

const ThreeJSAnimationWithNoSSR = dynamic(
  () => Promise.resolve(ThreeJSAnimation),
  { ssr: false }
);

export default ThreeJSAnimationWithNoSSR;