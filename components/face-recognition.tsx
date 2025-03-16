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
const DEFAULT_AVATAR_URL = "./models/astra1.glb";

// MediaPipe configuration
let video;
let faceLandmarker;
let lastVideoTime = -1;
let blendshapes = [];
let rotation;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  useEffect(() => {
    // Clear the head mesh array before adding new meshes
    headMeshRef.current = [];
    
    // Log the available nodes for debugging
    console.log("Available nodes:", nodes);
    
    // Store initial state of all relevant nodes to properly reset them
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
    if (nodes.root) {
      rootRef.current = nodes.root;
    } else if (nodes.Scene) {
      rootRef.current = nodes.Scene;
    }
    
    // Only add head-related meshes for blendshapes
    if (nodes.head) headMeshRef.current.push(nodes.head);
    if (nodes.head003) headMeshRef.current.push(nodes.head003);
    if (nodes.head004) headMeshRef.current.push(nodes.head004);
    if (nodes.Eyes_GEO) headMeshRef.current.push(nodes.Eyes_GEO);
    if (nodes.tongue) headMeshRef.current.push(nodes.tongue);
    if (nodes.eyeL) headMeshRef.current.push(nodes.eyeL);
    if (nodes.eyeR) headMeshRef.current.push(nodes.eyeR);
    
    // Initialize rotation if not already set
    if (!rotation) {
      rotation = new Euler(0, 0, 0);
    }
    
    // Initialize last rotation for smooth interpolation
    lastRotationRef.current = new Euler(0, 0, 0);
    
    // Complete reset of the model to initial state
    resetModelToInitialState();
    
    return () => {
      // Clean up any resources when the Avatar changes
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Coordinate the movement of the entire body
  useFrame(() => {
    // Calculate time delta for consistent animation speed
    const now = Date.now();
    timeRef.current.delta = (now - timeRef.current.last) / 1000; // Convert to seconds
    timeRef.current.last = now;
    
    // Use time-based smoothing factor (between 0 and 1)
    // Lower is smoother but less responsive, higher is more responsive but can be jittery
    const smoothFactor = Math.min(1, timeRef.current.delta * 8);
    
    frameCountRef.current += 1;
    
    // Reset the entire model periodically to prevent accumulated distortions
    if (frameCountRef.current % 600 === 0) { // Reduced frequency of resets for smoother motion
      resetModelToInitialState();
    }
    
    // Movement parameters and limits - adjusted for more natural range
    const MAX_X_ROTATION = 0.6;  // Up/down movement
    const MAX_Y_ROTATION = 0.7;  // Left/right movement
    const MAX_Z_ROTATION = 0.4;  // Tilting
    
    if (blendshapes && blendshapes.length > 0) {
      // Apply facial blendshapes with improved smoothing
      blendshapes.forEach(element => {
        headMeshRef.current.forEach(mesh => {
          if (mesh && mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
            const index = mesh.morphTargetDictionary[element.categoryName];
            if (index !== undefined && index >= 0) {
              // Apply a smoother transition to facial expressions
              mesh.morphTargetInfluences[index] = smoothRotation(
                mesh.morphTargetInfluences[index] || 0,
                element.score,
                smoothFactor * 1.2 // Slightly faster reactions for facial expressions
              );
            }
          }
        });
      });
      
      // Clamp rotation values to prevent extreme distortion
      const clampedRotation = {
        x: Math.max(-MAX_X_ROTATION, Math.min(MAX_X_ROTATION, rotation.x)),
        y: Math.max(-MAX_Y_ROTATION, Math.min(MAX_Y_ROTATION, rotation.y)),
        z: Math.max(-MAX_Z_ROTATION, Math.min(MAX_Z_ROTATION, rotation.z))
      };
      
      // Smoothly interpolate rotation for more fluid movement
      rotationLerpRef.current.x = smoothRotation(rotationLerpRef.current.x, clampedRotation.x, smoothFactor);
      rotationLerpRef.current.y = smoothRotation(rotationLerpRef.current.y, clampedRotation.y, smoothFactor);
      rotationLerpRef.current.z = smoothRotation(rotationLerpRef.current.z, clampedRotation.z, smoothFactor);
      
      // Store last valid rotation values
      lastRotationRef.current = new Euler(
        rotationLerpRef.current.x,
        rotationLerpRef.current.y,
        rotationLerpRef.current.z
      );
      
      // Apply whole body movement using root node as primary approach
      if (rootRef.current && initialStateRef.current?.root) {
        // Apply primary movement to root with improved smoothing
        // Apply the smoothed rotation values to the root node
        rootRef.current.rotation.set(
          initialStateRef.current.root.rotation.x + (rotationLerpRef.current.x * 0.6),
          initialStateRef.current.root.rotation.y + (rotationLerpRef.current.y * 0.8),
          initialStateRef.current.root.rotation.z + (rotationLerpRef.current.z * 0.4)
        );
        
        // Create propagation delay factors for natural body mechanics
        // Different body parts should follow the head with varying delays
        const applyDelayedMovement = (nodeName, xFactor, yFactor, zFactor, delay) => {
          if (nodes[nodeName] && initialStateRef.current?.[nodeName]) {
            // Calculate delayed rotation values (delay factor 0-1: lower = more delay)
            const delayedX = rotationLerpRef.current.x * (1 - delay) + previousRotationRef.current.x * delay;
            const delayedY = rotationLerpRef.current.y * (1 - delay) + previousRotationRef.current.y * delay;
            const delayedZ = rotationLerpRef.current.z * (1 - delay) + previousRotationRef.current.z * delay;
            
            nodes[nodeName].rotation.set(
              initialStateRef.current[nodeName].rotation.x + (delayedX * xFactor),
              initialStateRef.current[nodeName].rotation.y + (delayedY * yFactor),
              initialStateRef.current[nodeName].rotation.z + (delayedZ * zFactor)
            );
          }
        };
        
        // Apply natural kinetic chain movement through the body
        // Head - primary movement, minimal delay
        applyDelayedMovement('head', 0.3, 0.3, 0.2, 0.05);
        applyDelayedMovement('head003', 0.3, 0.3, 0.2, 0.05);
        applyDelayedMovement('head004', 0.3, 0.3, 0.2, 0.05);
        
        // Neck - follows head closely
        applyDelayedMovement('neck', 0.25, 0.25, 0.15, 0.15);
        
        // Upper spine - follows with more delay
        applyDelayedMovement('spine001', 0.2, 0.2, 0.1, 0.25);
        applyDelayedMovement('spine002', 0.2, 0.2, 0.1, 0.25);
        applyDelayedMovement('spin', 0.2, 0.2, 0.1, 0.25);
        
        // Middle spine - follows with more delay
        applyDelayedMovement('spine', 0.15, 0.15, 0.08, 0.35);
        
        // Lower spine - slight counter movement for balance
        applyDelayedMovement('spine003', 0.05, 0.05, 0.05, 0.5);
        
        // Shoulders - follow spine with slight counter-movement
        applyDelayedMovement('clavivleL', 0.15, 0.15, 0.1, 0.3);
        applyDelayedMovement('clavivleR', 0.15, 0.15, 0.1, 0.3);
        
        // Arms - counter-movement for natural balance
        applyDelayedMovement('armL', -0.08, -0.08, -0.04, 0.4);
        applyDelayedMovement('armR', -0.08, -0.08, -0.04, 0.4);
        
        // Forearms - follow arms with more delay (pendulum effect)
        applyDelayedMovement('forearmL', -0.06, -0.06, -0.03, 0.5);
        applyDelayedMovement('forearmR', -0.06, -0.06, -0.03, 0.5);
        
        // Hands - slight follow-through
        applyDelayedMovement('handL', -0.04, -0.04, -0.02, 0.6);
        applyDelayedMovement('handR', -0.04, -0.04, -0.02, 0.6);
        
        // Hips - subtle counter-movement
        applyDelayedMovement('hips', -0.05, -0.05, -0.03, 0.7);
        
        // Legs - counter-balance
        applyDelayedMovement('legL', -0.04, -0.04, -0.02, 0.8);
        applyDelayedMovement('legR', -0.04, -0.04, -0.02, 0.8);
        
        // Feet - ground the character with minimal movement
        applyDelayedMovement('footL', 0, 0, 0, 0.9);
        applyDelayedMovement('footR', 0, 0, 0, 0.9);
      } else {
        // Fallback approach if root node is not available
        // Apply progressive movement down the body with natural physics
        const nodeHierarchy = [
          // Head group - primary movement
          { node: 'head', factors: { x: 0.8, y: 0.8, z: 0.5 }, delay: 0.05 },
          { node: 'head003', factors: { x: 0.8, y: 0.8, z: 0.5 }, delay: 0.05 },
          { node: 'head004', factors: { x: 0.8, y: 0.8, z: 0.5 }, delay: 0.05 },
          { node: 'eyeL', factors: { x: 0.8, y: 0.8, z: 0.5 }, delay: 0.05 },
          { node: 'eyeR', factors: { x: 0.8, y: 0.8, z: 0.5 }, delay: 0.05 },
          
          // Neck group - follows head closely
          { node: 'neck', factors: { x: 0.6, y: 0.6, z: 0.4 }, delay: 0.15 },
          
          // Upper torso - follows with some delay
          { node: 'spine001', factors: { x: 0.5, y: 0.5, z: 0.3 }, delay: 0.2 },
          { node: 'spine002', factors: { x: 0.5, y: 0.5, z: 0.3 }, delay: 0.2 },
          { node: 'spin', factors: { x: 0.5, y: 0.5, z: 0.3 }, delay: 0.2 },
          
          // Middle torso - follows with more delay
          { node: 'spine', factors: { x: 0.4, y: 0.4, z: 0.2 }, delay: 0.3 },
          
          // Lower torso - subtle counter-movement
          { node: 'spine003', factors: { x: 0.2, y: 0.2, z: 0.1 }, delay: 0.4 },
          
          // Shoulders 
          { node: 'clavivleL', factors: { x: 0.3, y: 0.3, z: 0.2 }, delay: 0.25 },
          { node: 'clavivleR', factors: { x: 0.3, y: 0.3, z: 0.2 }, delay: 0.25 },
          
          // Arms - natural counter-movement
          { node: 'armL', factors: { x: -0.15, y: -0.15, z: -0.1 }, delay: 0.35 },
          { node: 'armR', factors: { x: -0.15, y: -0.15, z: -0.1 }, delay: 0.35 },
          
          // Forearms - follow arms with pendulum effect
          { node: 'forearmL', factors: { x: -0.1, y: -0.1, z: -0.05 }, delay: 0.45 },
          { node: 'forearmR', factors: { x: -0.1, y: -0.1, z: -0.05 }, delay: 0.45 },
          
          // Hands - slight follow through
          { node: 'handL', factors: { x: -0.05, y: -0.05, z: -0.03 }, delay: 0.55 },
          { node: 'handR', factors: { x: -0.05, y: -0.05, z: -0.03 }, delay: 0.55 },
          
          // Hips - subtle counter-movement
          { node: 'hips', factors: { x: -0.1, y: -0.1, z: -0.05 }, delay: 0.5 },
          
          // Legs - counter-balance with more delay
          { node: 'legL', factors: { x: -0.08, y: -0.08, z: -0.04 }, delay: 0.6 },
          { node: 'legR', factors: { x: -0.08, y: -0.08, z: -0.04 }, delay: 0.6 },
          
          // Calves - follow legs with more delay
          { node: 'shinL', factors: { x: -0.03, y: -0.03, z: -0.02 }, delay: 0.7 },
          { node: 'shinR', factors: { x: -0.03, y: -0.03, z: -0.02 }, delay: 0.7 },
          
          // Feet - minimal movement to ground the character
          { node: 'footL', factors: { x: -0.01, y: -0.01, z: -0.01 }, delay: 0.8 },
          { node: 'footR', factors: { x: -0.01, y: -0.01, z: -0.01 }, delay: 0.8 }
        ];
        
        // Apply movement to all nodes in the hierarchy
        nodeHierarchy.forEach(({ node, factors, delay }) => {
          if (nodes[node] && initialStateRef.current?.[node]) {
            // Calculate delayed rotation values (delay factor 0-1: lower = more delay)
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
      }
      
      // Store current rotation for next frame's calculations
      previousRotationRef.current = new Euler(
        rotationLerpRef.current.x,
        rotationLerpRef.current.y,
        rotationLerpRef.current.z
      );
      
    } else {
      // Improved idle animation when no face tracking data
      const idleTime = Date.now() / 1000;
      
      // Use multiple sine waves with different frequencies for more natural idle movement
      // Main breathing cycle
      const breathe = Math.sin(idleTime * 0.5) * 0.02;
      // Primary subtle swaying
      const sway = Math.sin(idleTime * 0.3) * 0.02;
      // Secondary micro-movements
      const microMove1 = Math.sin(idleTime * 1.7) * 0.005;
      const microMove2 = Math.sin(idleTime * 2.3) * 0.003;
      
      // Combine breathing and micromovement for a more lifelike idle
      const combinedBreathing = breathe + microMove1;
      const combinedSwaying = sway + microMove2;
      
      // Gradually transition from active tracking to idle
      // This creates a seamless blend when tracking is lost
      if (lastRotationRef.current) {
        rotationLerpRef.current.x = smoothRotation(rotationLerpRef.current.x, 0, smoothFactor * 0.5);
        rotationLerpRef.current.y = smoothRotation(rotationLerpRef.current.y, 0, smoothFactor * 0.5);
        rotationLerpRef.current.z = smoothRotation(rotationLerpRef.current.z, 0, smoothFactor * 0.5);
      }
      
      // Apply idle animation to root for whole body movement
      if (rootRef.current && initialStateRef.current?.root) {
        rootRef.current.rotation.set(
          initialStateRef.current.root.rotation.x + combinedBreathing * 0.5,
          initialStateRef.current.root.rotation.y + combinedSwaying,
          initialStateRef.current.root.rotation.z + Math.sin(idleTime * 0.2) * 0.01
        );
      } else {
        // Apply breathing to chest/spine with natural physics
        if (nodes.spin && initialStateRef.current?.spin) {
          nodes.spin.rotation.x = initialStateRef.current.spin.rotation.x + combinedBreathing;
        }
        
        // Apply subtle head movement
        if (nodes.head && initialStateRef.current?.head) {
          nodes.head.rotation.x = initialStateRef.current.head.rotation.x + combinedBreathing * 0.3;
          nodes.head.rotation.y = initialStateRef.current.head.rotation.y + combinedSwaying * 0.7;
          nodes.head.rotation.z = initialStateRef.current.head.rotation.z + microMove1 * 0.5;
        }
        
        // Create a more varied idle animation with subtle differences
        // for each body part to avoid the robot-like synchronized movement
        const nodeIdles = {
          'head003': { x: combinedBreathing * 0.3, y: combinedSwaying * 0.7, z: microMove1 * 0.5 },
          'head004': { x: combinedBreathing * 0.3, y: combinedSwaying * 0.7, z: microMove1 * 0.5 },
          'neck': { x: combinedBreathing * 0.25, y: combinedSwaying * 0.6, z: microMove2 * 0.4 },
          'spine001': { x: combinedBreathing * 0.7, y: combinedSwaying * 0.5, z: microMove1 * 0.3 },
          'spine002': { x: combinedBreathing * 0.7, y: combinedSwaying * 0.4, z: microMove2 * 0.3 },
          'clavivleL': { x: combinedBreathing * 0.6, y: combinedSwaying * 0.1, z: microMove1 * 0.2 },
          'clavivleR': { x: combinedBreathing * 0.6, y: combinedSwaying * 0.1, z: microMove2 * 0.2 },
          'spine': { x: combinedBreathing * 0.8, y: combinedSwaying * 0.3, z: microMove1 * 0.2 },
          'armL': { x: combinedBreathing * 0.3, y: combinedSwaying * 0.2 + Math.sin(idleTime * 0.27) * 0.01, z: microMove2 * 0.1 },
          'armR': { x: combinedBreathing * 0.3, y: combinedSwaying * -0.2 + Math.sin(idleTime * 0.29) * 0.01, z: microMove1 * 0.1 },
          'forearmL': { x: combinedBreathing * 0.2, y: combinedSwaying * 0.1 + Math.sin(idleTime * 0.31) * 0.005, z: microMove2 * 0.05 },
          'forearmR': { x: combinedBreathing * 0.2, y: combinedSwaying * -0.1 + Math.sin(idleTime * 0.33) * 0.005, z: microMove1 * 0.05 }
        };
        
        Object.entries(nodeIdles).forEach(([nodeName, values]) => {
          if (nodes[nodeName] && initialStateRef.current?.[nodeName]) {
            nodes[nodeName].rotation.x = initialStateRef.current[nodeName].rotation.x + values.x;
            nodes[nodeName].rotation.y = initialStateRef.current[nodeName].rotation.y + values.y;
            nodes[nodeName].rotation.z = initialStateRef.current[nodeName].rotation.z + values.z;
          }
        });
        
        // Add very subtle random movements to simulate muscle micro-adjustments
        // This makes idle animation feel less mechanical
        if (frameCountRef.current % 90 === 0) {
          const microNodes = ['head', 'armL', 'armR', 'spine', 'eyeL', 'eyeR'];
          microNodes.forEach(nodeName => {
            if (nodes[nodeName] && initialStateRef.current?.[nodeName]) {
              // Tiny random adjustment (max 0.5 degrees) that will be smoothed out
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
    }
  });

  // Adjust position and scale for better camera framing
  return <primitive object={scene} position={[0, -2, -5]} scale={scale} />;
}

export default function AavatarFaceTracking() {
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR_URL);
  const [scale, setScale] = useState(1.9);
  const modelChoiceArray = [{ modelUrl: "./models/astra1.glb", modelImage: "/astra1.png",scale:1.9,modelName:"Glimmerpuff" },
    { modelUrl: "./models/astra2.glb", modelImage: "/astra2.png",scale:4,modelName:"Cosmodrip" },
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
  useEffect(() => {
    // Start with camera on automatically
    setup();
    
    return () => {
      // Cleanup on component unmount
      if (video && video.srcObject) {
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        
        tracks.forEach(track => {
          track.stop();
        });
      }
      
      // Cancel any animation frames
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Reset global variables
      lastVideoTime = -1;
      blendshapes = [];
      headMesh = [];
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="bg-background text-foreground px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none mb-12 text-center">Lets Play</h1>
  <div className="mx-auto max-w-6xl">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Avatar Display - Left Side */}
      <div>
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
      <div>
        <Card className="h-full shadow-md">
          <CardContent className="pt-6 h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-6 text-center">Control avatar body using your face movements</h2>
            
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
                  className="w-full py-6 text-base"
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

