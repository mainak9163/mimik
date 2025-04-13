// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useState, useCallback, useRef } from 'react';
import { FaceLandmarker,  FilesetResolver } from "@mediapipe/tasks-vision";
import { Color, Euler, Matrix4 } from 'three';
import { Canvas, useFrame, useGraph } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls } from '@react-three/drei';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Default avatar URL - pre-defined to avoid user input
const DEFAULT_AVATAR_URL = "./models/astra1.2.glb";

// MediaPipe configuration
let video;
let faceLandmarker;
let lastVideoTime = -1;
let blendshapes = [];
let rotation;
// eslint-disable-next-line @typescript-eslint/no-unused-vars, prefer-const
let headMesh = [];

const options = {
  baseOptions: {
    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
    delegate: "GPU"
  },
  numFaces: 1,
  runningMode: "VIDEO",
  outputFaceBlendshapes: true,
  outputFacialTransformationMatrixes: true,
};

function Avatar({ url,scale=1.9 }:{url:string,scale:number}) {
  const { scene } = useGLTF(url);
  const { nodes } = useGraph(scene);
  const previousRotationRef = useRef(new Euler());
  const frameCountRef = useRef(0);
  const headMeshRef = useRef([]);
  
  // Store the original position/rotation of nodes
  const initialStateRef = useRef(null);
  // Root node reference for whole-body movement
  const rootRef = useRef(null);
  // Add smoothing factors for rotation transitions
  const rotationLerpRef = useRef({ x: 0, y: 0, z: 0 });
  // Track last received rotation for interpolation
  const lastRotationRef = useRef(null);
  // Track timing for smooth interpolation
  const timeRef = useRef({ last: Date.now(), delta: 0 });

  const eyeStateRef = useRef({
    leftOpen: 1, // 1 = fully open, 0 = fully closed
    rightOpen: 1,
    blinkInProgress: false,
    winkInProgress: false,
    lastBlinkTime: 0,
    blinkDuration: 150, // milliseconds
    randomBlinkInterval: 2000 // random blink every ~2-7 seconds
  });

// Update the head mesh references to match your model
useEffect(() => {
  // Clear the head mesh array before adding new meshes
  headMeshRef.current = [];
  
  // Log the available nodes for debugging
  // console.log("Available nodes:", Object.keys(nodes));
  
  // Store initial state of all relevant nodes
  initialStateRef.current = {};
  
  // Save initial positions and rotations of all nodes
  Object.keys(nodes).forEach(nodeName => {
    if (nodes[nodeName] && nodes[nodeName].position && nodes[nodeName].rotation) {
      initialStateRef.current[nodeName] = {
        position: nodes[nodeName].position.clone(),
        rotation: nodes[nodeName].rotation.clone(),
        quaternion: nodes[nodeName].quaternion ? nodes[nodeName].quaternion.clone() : null,
        scale: nodes[nodeName].scale ? nodes[nodeName].scale.clone() : null
      };
    }
  });
  
  // Store the root node for whole-body movement
  if (nodes.Scene) {
    rootRef.current = nodes.Scene;
  } else if (nodes.Astra2) {
    rootRef.current = nodes.Astra2;
  }

  // Add eye nodes for winking
  if (nodes.LeftEye) headMeshRef.current.push(nodes.LeftEye);
  if (nodes.RightEye) headMeshRef.current.push(nodes.RightEye);

  // Add head for facial expressions and movement
  if (nodes.Head) headMeshRef.current.push(nodes.Head);
  
  // Initialize rotation if not already set
  if (!rotation) {
    rotation = new Euler(0, 0, 0);
  }
  
  // Initialize last rotation for smooth interpolation
  lastRotationRef.current = new Euler(0, 0, 0);
  
  // Complete reset of the model to initial state
  resetModelToInitialState();

  eyeStateRef.current = {
    leftOpen: 1,
    rightOpen: 1,
    blinkInProgress: false,
    winkInProgress: false,
    lastBlinkTime: 0,
    blinkDuration: 200,
  };
  
  return () => {
    // Clean up resources when Avatar changes
  };
}, [nodes, url]);

  // Function to reset the model to its initial state
  const resetModelToInitialState = () => {
    Object.entries(initialStateRef.current || {}).forEach(([nodeName, initialState]) => {
      if (nodes[nodeName]) {
        // Only reset if we have the initial values
        if (initialState.position) nodes[nodeName].position.copy(initialState.position);
        if (initialState.rotation) nodes[nodeName].rotation.copy(initialState.rotation);
        if (initialState.quaternion && nodes[nodeName].quaternion) {
          nodes[nodeName].quaternion.copy(initialState.quaternion);
        }
        if (initialState.scale && nodes[nodeName].scale) {
          nodes[nodeName].scale.copy(initialState.scale);
        }
      }
    });
  };

  // Smoothly interpolate between rotation values for fluid movement
  const smoothRotation = (current, target, smoothFactor) => {
    return current + (target - current) * smoothFactor;
  };

  // Function to handle eye blinking and winking - add this before the useFrame function
// Handle eye winking with your model's LeftEye and RightEye nodes
// Replace the handleEyeMovement function with this improved version
 // Replace the handleEyeMovement function with this revised version
// Replace the handleEyeMovement function with this improved version
// Replace the handleEyeMovement function with this improved version
const handleEyeMovement = () => {
  const now = Date.now();
  const { blinkInProgress, winkInProgress, lastBlinkTime, blinkDuration } = eyeStateRef.current;
  
  // Simplified eye state tracking for winking
  let leftEyeClosed = false;
  let rightEyeClosed = false;
  
  if (blendshapes && blendshapes.length > 0) {
    // Check blink-related blendshapes
    blendshapes.forEach(element => {
      if (element.categoryName === "eyeBlinkLeft" || element.categoryName === "eyeSquintLeft") {
        leftEyeClosed = element.score > 0.45;
      }
      if (element.categoryName === "eyeBlinkRight" || element.categoryName === "eyeSquintRight") {
        rightEyeClosed = element.score > 0.45;
      }
    });
  }
  
  // Handle wink/blink states with mirroring
  // IMPORTANT: Mirror the eyes - user's left eye maps to avatar's right eye and vice versa
  if (leftEyeClosed && rightEyeClosed) {
    // Both eyes closed - blink
    if (!blinkInProgress) {
      eyeStateRef.current.blinkInProgress = true;
      eyeStateRef.current.winkInProgress = false;
      eyeStateRef.current.leftOpen = 0;
      eyeStateRef.current.rightOpen = 0;
      eyeStateRef.current.lastBlinkTime = now;
    }
  } else if (leftEyeClosed && !rightEyeClosed) {
    // User's left eye closed = avatar's RIGHT eye should close (mirroring)
    if (!winkInProgress && !blinkInProgress) {
      eyeStateRef.current.winkInProgress = true;
      eyeStateRef.current.blinkInProgress = false;
      eyeStateRef.current.leftOpen = 1; // Keep LEFT eye open
      eyeStateRef.current.rightOpen = 0; // Close RIGHT eye
      eyeStateRef.current.lastBlinkTime = now;
    }
  } else if (rightEyeClosed && !leftEyeClosed) {
    // User's right eye closed = avatar's LEFT eye should close (mirroring)
    if (!winkInProgress && !blinkInProgress) {
      eyeStateRef.current.winkInProgress = true;
      eyeStateRef.current.blinkInProgress = false;
      eyeStateRef.current.leftOpen = 0; // Close LEFT eye
      eyeStateRef.current.rightOpen = 1; // Keep RIGHT eye open
      eyeStateRef.current.lastBlinkTime = now;
    }
  } else if (!leftEyeClosed && !rightEyeClosed && (blinkInProgress || winkInProgress)) {
    // Eyes returning to open state
    const elapsedTime = now - lastBlinkTime;
    
    if (elapsedTime > blinkDuration) {
      // End the blink/wink with smooth transition
      eyeStateRef.current.blinkInProgress = false;
      eyeStateRef.current.winkInProgress = false;
      eyeStateRef.current.leftOpen = 1;
      eyeStateRef.current.rightOpen = 1;
    }
  }
  
  // Apply eye states to the model with symmetric closure from top and bottom
  // For LEFT eye (corresponds to user's RIGHT eye)
  if (nodes.LeftEye && initialStateRef.current?.LeftEye) {
    // Calculate how closed the eye should be (0 = closed, 1 = open)
    const openFactor = eyeStateRef.current.leftOpen;
    
    // Apply symmetrical scaling from both top and bottom
    // This maintains center point by equally scaling from both sides
    const targetScaleY = initialStateRef.current.LeftEye.scale.y * openFactor;
    
    // Get current values for smooth transition
    const currentScaleY = nodes.LeftEye.scale.y;
    const smoothFactor = 0.3;
    
    // Apply smooth transition to scale
    nodes.LeftEye.scale.y = currentScaleY + (targetScaleY - currentScaleY) * smoothFactor;
    
    // CRITICAL: Keep the eye's center position fixed
    // This ensures it scales from both top and bottom equally
    nodes.LeftEye.position.y = initialStateRef.current.LeftEye.position.y;
    
    // Optional: Add slight horizontal scaling for natural squint
    // Less is more here - very subtle effect
    if (openFactor < 1) {
      const squintFactor = 1 + ((1 - openFactor) * 0.05);
      nodes.LeftEye.scale.x = initialStateRef.current.LeftEye.scale.x * squintFactor;
    } else {
      nodes.LeftEye.scale.x = initialStateRef.current.LeftEye.scale.x;
    }
  }
  
  // For RIGHT eye (corresponds to user's LEFT eye)
  if (nodes.RightEye && initialStateRef.current?.RightEye) {
    // Calculate how closed the eye should be (0 = closed, 1 = open)
    const openFactor = eyeStateRef.current.rightOpen;
    
    // Apply symmetrical scaling from both top and bottom
    const targetScaleY = initialStateRef.current.RightEye.scale.y * openFactor;
    
    // Get current values for smooth transition
    const currentScaleY = nodes.RightEye.scale.y;
    const smoothFactor = 0.3;
    
    // Apply smooth transition to scale
    nodes.RightEye.scale.y = currentScaleY + (targetScaleY - currentScaleY) * smoothFactor;
    
    // CRITICAL: Keep the eye's center position fixed
    nodes.RightEye.position.y = initialStateRef.current.RightEye.position.y;
    
    // Optional: Add slight horizontal scaling for natural squint
    if (openFactor < 1) {
      const squintFactor = 1 + ((1 - openFactor) * 0.05);
      nodes.RightEye.scale.x = initialStateRef.current.RightEye.scale.x * squintFactor;
    } else {
      nodes.RightEye.scale.x = initialStateRef.current.RightEye.scale.x;
    }
  }
};
  
  // Coordinate the movement of the entire body
  useFrame(() => {
    // Calculate time delta for consistent animation speed
    const now = Date.now();
    timeRef.current.delta = (now - timeRef.current.last) / 1000;
    timeRef.current.last = now;
    
    // Use time-based smoothing factor
    const smoothFactor = Math.min(1, timeRef.current.delta * 8);
    
    frameCountRef.current += 1;
    
    // Reset model periodically to prevent distortions
    if (frameCountRef.current % 600 === 0) {
      resetModelToInitialState();
    }
    
    // Movement parameters
    const MAX_X_ROTATION = 0.6;
    const MAX_Y_ROTATION = 0.7;
    const MAX_Z_ROTATION = 0.4;
  
    // Handle eye movement
    handleEyeMovement();
    
    if (blendshapes && blendshapes.length > 0) {
      // Clamp rotation values
// Fix 1: Invert the vertical rotation to match user's head movement
const clampedRotation = {
  // Invert the X rotation (vertical movement)
  x: Math.max(-MAX_X_ROTATION, Math.min(MAX_X_ROTATION, -rotation.x)),
  y: Math.max(-MAX_Y_ROTATION, Math.min(MAX_Y_ROTATION, rotation.y)),
  z: Math.max(-MAX_Z_ROTATION, Math.min(MAX_Z_ROTATION, rotation.z))
};
      
      // Smoothly interpolate rotation
      rotationLerpRef.current.x = smoothRotation(rotationLerpRef.current.x, clampedRotation.x, smoothFactor);
      rotationLerpRef.current.y = smoothRotation(rotationLerpRef.current.y, clampedRotation.y, smoothFactor);
      rotationLerpRef.current.z = smoothRotation(rotationLerpRef.current.z, clampedRotation.z, smoothFactor);
      
      // Store last valid rotation values
      lastRotationRef.current = new Euler(
        rotationLerpRef.current.x,
        rotationLerpRef.current.y,
        rotationLerpRef.current.z
      );
      
      // Apply movement to the body based on your model's structure
      const nodeHierarchy = [
        // Head - primary movement
        { node: 'Head', factors: { x: 0.8, y: 0.8, z: 0.5 }, delay: 0.05 },
        { node: 'HeadTop_End', factors: { x: 0.8, y: 0.8, z: 0.5 }, delay: 0.05 },
        { node: 'LeftEye', factors: { x: 0.8, y: 0.8, z: 0.5 }, delay: 0.05 },
        { node: 'RightEye', factors: { x: 0.8, y: 0.8, z: 0.5 }, delay: 0.05 },
        
        // Arms - natural movement
        { node: 'LeftArm', factors: { x: 0.3, y: 0.3, z: 0.2 }, delay: 0.2 },
        { node: 'RightArm', factors: { x: 0.3, y: 0.3, z: 0.2 }, delay: 0.2 },
        
        // Hips - counter movement for balance
        { node: 'Hips', factors: { x: 0.2, y: 0.2, z: 0.1 }, delay: 0.3 },
        
        // Feet - ground the character
        { node: 'footL', factors: { x: 0.1, y: 0.1, z: 0.05 }, delay: 0.4 },
        { node: 'footR', factors: { x: 0.1, y: 0.1, z: 0.05 }, delay: 0.4 },
      ];
      
      // Apply movement to all nodes in the hierarchy
      nodeHierarchy.forEach(({ node, factors, delay }) => {
        if (nodes[node] && initialStateRef.current?.[node]) {
          // Calculate delayed rotation values
          const delayedX = rotationLerpRef.current.x * (1 - delay) + previousRotationRef.current.x * delay;
          const delayedY = rotationLerpRef.current.y * (1 - delay) + previousRotationRef.current.y * delay;
          const delayedZ = rotationLerpRef.current.z * (1 - delay) + previousRotationRef.current.z * delay;
          
          nodes[node].rotation.set(
            initialStateRef.current[node].rotation.x + (delayedX * factors.x),
            initialStateRef.current[node].rotation.y + (delayedY * factors.y),
            initialStateRef.current[node].rotation.z + (delayedZ * factors.z)
          );
        }
      });
      
      // Store current rotation for next frame
      previousRotationRef.current = new Euler(
        rotationLerpRef.current.x,
        rotationLerpRef.current.y,
        rotationLerpRef.current.z
      );
    } else {
      // Idle animation when no face tracking data
      const idleTime = Date.now() / 1000;
      
      // Use multiple sine waves for natural idle movement
      const breathe = Math.sin(idleTime * 0.5) * 0.02;
      const sway = Math.sin(idleTime * 0.3) * 0.02;
      const microMove1 = Math.sin(idleTime * 1.7) * 0.005;
      const microMove2 = Math.sin(idleTime * 2.3) * 0.003;
      
      const combinedBreathing = breathe + microMove1;
      const combinedSwaying = sway + microMove2;
      
      // Transition from active tracking to idle
      if (lastRotationRef.current) {
        rotationLerpRef.current.x = smoothRotation(rotationLerpRef.current.x, 0, smoothFactor * 0.5);
        rotationLerpRef.current.y = smoothRotation(rotationLerpRef.current.y, 0, smoothFactor * 0.5);
        rotationLerpRef.current.z = smoothRotation(rotationLerpRef.current.z, 0, smoothFactor * 0.5);
      }
      
      // Simple idle animation for your model's nodes
      const nodeIdles = {
        'Head': { x: combinedBreathing * 0.3, y: combinedSwaying * 0.7, z: microMove1 * 0.5 },
        'Hips': { x: combinedBreathing * 0.2, y: combinedSwaying * 0.3, z: microMove2 * 0.2 },
        'LeftArm': { x: combinedBreathing * 0.3, y: combinedSwaying * 0.2, z: microMove1 * 0.1 },
        'RightArm': { x: combinedBreathing * 0.3, y: -combinedSwaying * 0.2, z: microMove2 * 0.1 },
      };
      
      Object.entries(nodeIdles).forEach(([nodeName, values]) => {
        if (nodes[nodeName] && initialStateRef.current?.[nodeName]) {
          nodes[nodeName].rotation.x = initialStateRef.current[nodeName].rotation.x + values.x;
          nodes[nodeName].rotation.y = initialStateRef.current[nodeName].rotation.y + values.y;
          nodes[nodeName].rotation.z = initialStateRef.current[nodeName].rotation.z + values.z;
        }
      });
      
      // Add subtle random movements occasionally
      if (frameCountRef.current % 90 === 0) {
        const microNodes = ['Head', 'LeftEye', 'RightEye'];
        microNodes.forEach(nodeName => {
          if (nodes[nodeName] && initialStateRef.current?.[nodeName]) {
            const microX = (Math.random() - 0.5) * 0.01;
            const microY = (Math.random() - 0.5) * 0.01;
            const microZ = (Math.random() - 0.5) * 0.01;
            
            nodes[nodeName].rotation.x += microX;
            nodes[nodeName].rotation.y += microY;
            nodes[nodeName].rotation.z += microZ;
          }
        });
      }
    }
  });

  // Adjust position and scale for better camera framing
  return <primitive object={scene} position={[0, -2, -5]} scale={scale} />;
}

export default function AavatarFaceTracking() {
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR_URL);
  const [scale, setScale] = useState(1.9);
  const modelChoiceArray = [{ modelUrl: "./models/astra1.2.glb", modelImage: "/astra1.webp",scale:1.9,modelName:"Glimmerpuff" },
    { modelUrl: "./models/astra2.glb", modelImage: "/astra2.webp",scale:4,modelName:"Cosmodrip" },
  ]
  const [cameraActive, setCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionActive, setPredictionActive] = useState(false);
  
  // Ref to store the animation frame ID for proper cleanup
  const animationFrameRef = useRef(null);

  const predict = useCallback(async () => {
    if (!video || !faceLandmarker) return;
    
    const nowInMs = Date.now();
    if (lastVideoTime !== video.currentTime) {
      lastVideoTime = video.currentTime;
      try {
        const faceLandmarkerResult = faceLandmarker.detectForVideo(video, nowInMs);

        if (faceLandmarkerResult.faceBlendshapes && 
            faceLandmarkerResult.faceBlendshapes.length > 0 && 
            faceLandmarkerResult.faceBlendshapes[0].categories &&
            faceLandmarkerResult.facialTransformationMatrixes &&
            faceLandmarkerResult.facialTransformationMatrixes.length > 0) {
          
          blendshapes = faceLandmarkerResult.faceBlendshapes[0].categories;
          // console.log(blendshapes)
          const matrix = new Matrix4().fromArray(faceLandmarkerResult.facialTransformationMatrixes[0].data);
          rotation = new Euler().setFromRotationMatrix(matrix);
        }
      } catch (error) {
        console.error("Error in face detection:", error);
      }
    }

    // Store the animation frame ID for cleanup
    animationFrameRef.current = window.requestAnimationFrame(predict);
  }, []);

  const setup = async () => {
    setIsLoading(true);
    try {
      const filesetResolver = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");
      faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, options);

      video = document.getElementById("video");
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false,
      });
      
      video.srcObject = stream;
      video.addEventListener("loadeddata", () => {
        // Start the prediction loop
        setPredictionActive(true);
        animationFrameRef.current = window.requestAnimationFrame(predict);
      });
      
      setCameraActive(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error accessing camera:", error);
      setIsLoading(false);
    }
  };

  // Effect to handle the prediction loop
  useEffect(() => {
    if (predictionActive && !animationFrameRef.current) {
      animationFrameRef.current = window.requestAnimationFrame(predict);
    }
    
    return () => {
      // Cleanup animation frame on unmount or when prediction is stopped
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [predict, predictionActive]);

  // Effect to initialize camera when component loads
  // useEffect(() => {
  //   // Start with camera on automatically
  //   setup();
    
  //   return () => {
  //     // Cleanup on component unmount
  //     if (video && video.srcObject) {
  //       const stream = video.srcObject;
  //       const tracks = stream.getTracks();
        
  //       tracks.forEach(track => {
  //         track.stop();
  //       });
  //     }
      
  //     // Cancel any animation frames
  //     if (animationFrameRef.current) {
  //       window.cancelAnimationFrame(animationFrameRef.current);
  //     }
      
  //     // Reset global variables
  //     lastVideoTime = -1;
  //     blendshapes = [];
  //     headMesh = [];
  //   };
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);


  return (
    <div className="bg-background text-foreground px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none mb-12 text-center"><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f58895] to-[#0edcdc]">Lets Play</span></h1>
  <div className="mx-auto max-w-screen sm:max-w-6xl">
    <div className="flex flex-wrap">
      {/* Avatar Display - Left Side */}
      <div className="w-full sm:w-1/2">
        <Card className="overflow-hidden shadow-md h-full">
          <CardContent className="p-0 h-full">
            <div className="relative w-full aspect-video h-full bg-muted">
              <Canvas className="w-full h-full bg-background" camera={{ fov: 25 }} shadows>
                <ambientLight intensity={1.2} />
                <directionalLight 
                  position={[2, 5, 5]} 
                  intensity={1.5} 
                  castShadow 
                  shadow-mapSize-width={1024} 
                  shadow-mapSize-height={1024}
                />
                <pointLight position={[-5, 2, -10]} color={new Color(0.7, 0.7, 1)} intensity={0.6} />
                <pointLight position={[5, 0, -5]} color={new Color(1, 0.9, 0.8)} intensity={0.8} />
                <pointLight position={[0, 3, 5]} color={new Color(1, 1, 1)} intensity={0.5} />
                
                <Environment preset="apartment" />
                
                <Avatar url={avatarUrl} scale={scale} />
                <OrbitControls enableZoom={false} enablePan={false} />
              </Canvas>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Controls - Right Side */}
      <div className="w-full sm:w-1/2 mt-8 sm:mt-0">
        <Card className="h-full shadow-md">
          <CardContent className="pt-6 h-full flex flex-col">
            <h2 className="text-3xl font-semibold mb-6 text-center text-muted-foreground">Move your head side to side</h2>
            <p className="text-xl font-semibold mb-6 text-center text-muted-foreground">Eyes and mouth control coming soon!</p>
            
            {/* Hidden video element */}
            <video 
              id="video" 
              className="w-0 h-0 overflow-hidden"
              autoPlay
              playsInline
              muted
            ></video>
            
            {/* Camera Controls */}
            <div className="mb-8">
              {!cameraActive ? (
                <Button 
                  variant="default" 
                  className="w-full py-6 text-2xl bg-[#faa0ab]"
                  onClick={setup}
                >
                  Enable Camera
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full py-6 text-base"
                  onClick={() => {
                    if (video && video.srcObject) {
                      const stream = video.srcObject;
                      const tracks = stream.getTracks();
                      tracks.forEach(track => track.stop());
                      video.srcObject = null;
                    }
                    setCameraActive(false);
                    setPredictionActive(false);
                    if (animationFrameRef.current) {
                      window.cancelAnimationFrame(animationFrameRef.current);
                      animationFrameRef.current = null;
                    }
                  }}
                >
                  Disable Camera
                </Button>
              )}
            </div>
            
            {/* Avatar Selection */}
            {/* <h3 className="text-md font-medium mb-4">Choose your avatar</h3> */}
            <div className="grid grid-cols-2 gap-4 mt-2 flex-grow overflow-none">
                  {modelChoiceArray.map((modelChoice, index) => (
                    <div className="" key={index} >
                      <h2 className="font-medium text-center mb-2">{modelChoice.modelName}</h2>
                <div 
                  onClick={() => {setAvatarUrl(modelChoice.modelUrl)
                    setScale(modelChoice.scale)}
                  } 
                 
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:scale-105",
                    "rounded-lg overflow-hidden",
                    avatarUrl === modelChoice.modelUrl 
                      ? "ring-4 ring-primary shadow-lg" 
                      : "ring-1 ring-border hover:ring-2 hover:ring-primary/50"
                  )}
                >
                  <img 
                    src={modelChoice.modelImage || "/placeholder.svg"} 
                    alt={`Avatar option ${index + 1}`} 
                    className="w-full h-full object-cover aspect-square"
                  />
                      </div>
                      </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</div>
  );
}

