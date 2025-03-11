"use client"

import { useEffect, useState, useCallback, useRef } from 'react';
import { FaceLandmarker, FaceLandmarkerOptions, FilesetResolver } from "@mediapipe/tasks-vision";
import { Color, Euler, Matrix4 } from 'three';
import { Canvas, useFrame, useGraph } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls } from '@react-three/drei';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar as AvatarComponent, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Default avatar URL - pre-defined to avoid user input
const DEFAULT_AVATAR_URL = "./models/astra_glim.glb";

// MediaPipe configuration
let video;
let faceLandmarker;
let lastVideoTime = -1;
let blendshapes = [];
let rotation;
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

function Avatar({ url }) {
  const { scene } = useGLTF(url);
  const { nodes } = useGraph(scene);
  const previousRotationRef = useRef(new Euler());
  const frameCountRef = useRef(0);
  const headMeshRef = useRef([]);
  
  // Store the original position/rotation of nodes
  const initialStateRef = useRef(null);
  // Root node reference for whole-body movement
  const rootRef = useRef(null);

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
    
    // Complete reset of the model to initial state
    resetModelToInitialState();
    
    return () => {
      // Clean up any resources when the Avatar changes
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

  // Coordinate the movement of the entire body
  useFrame(() => {
    frameCountRef.current += 1;
    
    // Reset the entire model periodically to prevent accumulated distortions
    if (frameCountRef.current % 180 === 0) {
      resetModelToInitialState();
    }
    
    // Apply blendshapes if they exist for facial expressions
    if (blendshapes && blendshapes.length > 0) {
      // Apply facial blendshapes to head meshes
      blendshapes.forEach(element => {
        headMeshRef.current.forEach(mesh => {
          if (mesh && mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
            const index = mesh.morphTargetDictionary[element.categoryName];
            if (index !== undefined && index >= 0) {
              // Apply a smoothed value to avoid sudden movements
              mesh.morphTargetInfluences[index] = element.score;
            }
          }
        });
      });
      
      // Movement parameters and limits
      const MAX_X_ROTATION = 0.5;  // Up/down movement
      const MAX_Y_ROTATION = 0.6;  // Left/right movement
      const MAX_Z_ROTATION = 0.3;  // Tilting
      
      // Clamp rotation values to prevent extreme distortion
      const clampedRotation = {
        x: Math.max(-MAX_X_ROTATION, Math.min(MAX_X_ROTATION, rotation.x)),
        y: Math.max(-MAX_Y_ROTATION, Math.min(MAX_Y_ROTATION, rotation.y)),
        z: Math.max(-MAX_Z_ROTATION, Math.min(MAX_Z_ROTATION, rotation.z))
      };
      
      // Apply whole body movement using root node (primary approach)
      if (rootRef.current && initialStateRef.current?.root) {
        // Move the entire body as a unit with the root node
        rootRef.current.rotation.set(
          initialStateRef.current.root.rotation.x + (clampedRotation.x * 0.4),
          initialStateRef.current.root.rotation.y + (clampedRotation.y * 0.6),
          initialStateRef.current.root.rotation.z + (clampedRotation.z * 0.3)
        );
        
        // Add subtle body follow-through for natural movement
        // This creates a slight delay in lower body parts
        
        // Apply coordinated movements to supplemental body parts
        // These movements will be smaller than the main root movement
        
        // 1. Head movements (slightly enhanced from root)
        if (nodes.head && initialStateRef.current?.head) {
          nodes.head.rotation.set(
            initialStateRef.current.head.rotation.x + (clampedRotation.x * 0.15),
            initialStateRef.current.head.rotation.y + (clampedRotation.y * 0.15),
            initialStateRef.current.head.rotation.z + (clampedRotation.z * 0.1)
          );
        }
        
        if (nodes.head003 && initialStateRef.current?.head003) {
          nodes.head003.rotation.set(
            initialStateRef.current.head003.rotation.x + (clampedRotation.x * 0.15),
            initialStateRef.current.head003.rotation.y + (clampedRotation.y * 0.15),
            initialStateRef.current.head003.rotation.z + (clampedRotation.z * 0.1)
          );
        }
        
        if (nodes.head004 && initialStateRef.current?.head004) {
          nodes.head004.rotation.set(
            initialStateRef.current.head004.rotation.x + (clampedRotation.x * 0.15),
            initialStateRef.current.head004.rotation.y + (clampedRotation.y * 0.15),
            initialStateRef.current.head004.rotation.z + (clampedRotation.z * 0.1)
          );
        }
        
        // 2. Spine movement (smaller movement for naturalism)
        if (nodes.spin && initialStateRef.current?.spin) {
          nodes.spin.rotation.set(
            initialStateRef.current.spin.rotation.x + (clampedRotation.x * 0.1),
            initialStateRef.current.spin.rotation.y + (clampedRotation.y * 0.1),
            initialStateRef.current.spin.rotation.z + (clampedRotation.z * 0.05)
          );
        }
        
        // 3. Arms follow-through (subtle counter-movement for natural physics)
        if (nodes.armL && initialStateRef.current?.armL) {
          nodes.armL.rotation.set(
            initialStateRef.current.armL.rotation.x + (clampedRotation.x * -0.05),
            initialStateRef.current.armL.rotation.y + (clampedRotation.y * -0.05),
            initialStateRef.current.armL.rotation.z + (clampedRotation.z * -0.02)
          );
        }
        
        if (nodes.armR && initialStateRef.current?.armR) {
          nodes.armR.rotation.set(
            initialStateRef.current.armR.rotation.x + (clampedRotation.x * -0.05),
            initialStateRef.current.armR.rotation.y + (clampedRotation.y * -0.05),
            initialStateRef.current.armR.rotation.z + (clampedRotation.z * -0.02)
          );
        }
        
        // 4. Legs counter-balance (very subtle opposing movement)
        if (nodes.legL && initialStateRef.current?.legL) {
          nodes.legL.rotation.set(
            initialStateRef.current.legL.rotation.x + (clampedRotation.x * -0.03),
            initialStateRef.current.legL.rotation.y + (clampedRotation.y * -0.03),
            initialStateRef.current.legL.rotation.z + (clampedRotation.z * -0.01)
          );
        }
        
        if (nodes.legR && initialStateRef.current?.legR) {
          nodes.legR.rotation.set(
            initialStateRef.current.legR.rotation.x + (clampedRotation.x * -0.03),
            initialStateRef.current.legR.rotation.y + (clampedRotation.y * -0.03),
            initialStateRef.current.legR.rotation.z + (clampedRotation.z * -0.01)
          );
        }
      } else {
        // Fallback if root node is not available
        // Apply coordinated movement across available body parts
        const nodeRotations = {
          // Head group - primary movement
          'head': { x: 0.7, y: 0.7, z: 0.4 },
          'head003': { x: 0.7, y: 0.7, z: 0.4 },
          'head004': { x: 0.7, y: 0.7, z: 0.4 },
          'Eyes_GEO': { x: 0.7, y: 0.7, z: 0.4 },
          'eyeL': { x: 0.7, y: 0.7, z: 0.4 },
          'eyeR': { x: 0.7, y: 0.7, z: 0.4 },
          
          // Torso group - follows head with slight delay
          'spin': { x: 0.6, y: 0.6, z: 0.3 },
          'clavivleL': { x: 0.6, y: 0.6, z: 0.3 },
          'clavivleR': { x: 0.6, y: 0.6, z: 0.3 },
          
          // Arms group - counter movement
          'armL': { x: 0.5, y: 0.4, z: 0.2 },
          'armR': { x: 0.5, y: 0.4, z: 0.2 },
          
          // Legs group - counter balance
          'legL': { x: 0.4, y: 0.3, z: 0.1 },
          'legR': { x: 0.4, y: 0.3, z: 0.1 },
          'footL': { x: 0.2, y: 0.1, z: 0.1 },
          'footR': { x: 0.2, y: 0.1, z: 0.1 }
        };
        
        // Apply rotations to all available nodes
        Object.entries(nodeRotations).forEach(([nodeName, factors]) => {
          if (nodes[nodeName] && initialStateRef.current?.[nodeName]) {
            nodes[nodeName].rotation.set(
              initialStateRef.current[nodeName].rotation.x + (clampedRotation.x * factors.x),
              initialStateRef.current[nodeName].rotation.y + (clampedRotation.y * factors.y),
              initialStateRef.current[nodeName].rotation.z + (clampedRotation.z * factors.z)
            );
          }
        });
      }
    } else {
      // Subtle idle animation when no face tracking data
      const idleTime = Date.now() / 1000;
      
      // Breathing animation
      const breathe = Math.sin(idleTime * 0.5) * 0.02;
      // Subtle swaying
      const sway = Math.sin(idleTime * 0.3) * 0.02;
      
      // Apply idle animation to root for whole body movement
      if (rootRef.current && initialStateRef.current?.root) {
        rootRef.current.rotation.set(
          initialStateRef.current.root.rotation.x + breathe * 0.5,
          initialStateRef.current.root.rotation.y + sway,
          initialStateRef.current.root.rotation.z + Math.sin(idleTime * 0.2) * 0.01
        );
      } else {
        // Apply breathing to chest/spine
        if (nodes.spin && initialStateRef.current?.spin) {
          nodes.spin.rotation.x = initialStateRef.current.spin.rotation.x + breathe;
        }
        
        // Apply subtle head movement
        if (nodes.head && initialStateRef.current?.head) {
          nodes.head.rotation.x = initialStateRef.current.head.rotation.x + breathe * 0.3;
          nodes.head.rotation.y = initialStateRef.current.head.rotation.y + sway * 0.7;
        }
        
        // Other subtle idle movements for natural appearance
        const nodeIdles = {
          'head003': { x: breathe * 0.3, y: sway * 0.7, z: 0 },
          'head004': { x: breathe * 0.3, y: sway * 0.7, z: 0 },
          'clavivleL': { x: breathe * 0.5, y: 0, z: 0 },
          'clavivleR': { x: breathe * 0.5, y: 0, z: 0 },
          'armL': { x: breathe * 0.2, y: sway * 0.2, z: 0 },
          'armR': { x: breathe * 0.2, y: sway * -0.2, z: 0 }
        };
        
        Object.entries(nodeIdles).forEach(([nodeName, values]) => {
          if (nodes[nodeName] && initialStateRef.current?.[nodeName]) {
            nodes[nodeName].rotation.x = initialStateRef.current[nodeName].rotation.x + values.x;
            nodes[nodeName].rotation.y = initialStateRef.current[nodeName].rotation.y + values.y;
            nodes[nodeName].rotation.z = initialStateRef.current[nodeName].rotation.z + values.z;
          }
        });
      }
    }
  });

  // Adjust position and scale for better camera framing
  return <primitive object={scene} position={[0, -3, -5]} scale={1.9} />;
}

function App() {
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR_URL);
  const [customUrl, setCustomUrl] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionActive, setPredictionActive] = useState(false);
  
  // Ref to store the animation frame ID for proper cleanup
  const animationFrameRef = useRef(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'model/gltf-binary': ['.glb'],
    },
    onDrop: files => {
      setIsLoading(true);
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarUrl(reader.result);
        setIsLoading(false);
      }
      reader.readAsDataURL(file);
    }
  });

  const predict = useCallback(async () => {
    if (!video || !faceLandmarker) return;
    
    let nowInMs = Date.now();
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
  }, []);

  const handleCustomUrlSubmit = (e) => {
    e.preventDefault();
    if (customUrl.trim()) {
      setIsLoading(true);
      setAvatarUrl(customUrl);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">3D Avatar Face Tracking</h1>
          <AvatarComponent className="h-10 w-10 border border-primary">
            <AvatarFallback className="bg-secondary text-secondary-foreground">3D</AvatarFallback>
          </AvatarComponent>
        </header>
        
        <Separator className="mb-6" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative w-full aspect-video bg-muted">
                  <Canvas className="w-full h-full" camera={{ fov: 25 }} shadows>
                    {/* Improved lighting setup for better model appearance */}
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
                    
                    {/* Environment map for more realistic reflections */}
                    <Environment preset="apartment" />
                    
                    <Avatar url={avatarUrl} />
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
          
          <div className="space-y-6">
            {/* Camera Section */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-medium mb-4">Camera Feed</h2>
                <video 
                  id="video" 
                  className="w-full aspect-video rounded-md bg-muted object-cover mb-4"
                  autoPlay
                  playsInline
                  muted
                ></video>
                
                {!cameraActive ? (
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={setup}
                  >
                    Enable Camera
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full"
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
              </CardContent>
            </Card>
            
            {/* Avatar Section */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-medium mb-4">Avatar Controls</h2>
                
                {/* Model URL input */}
                <form onSubmit={handleCustomUrlSubmit} className="mb-4">
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Enter GLB model URL"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit">Load</Button>
                  </div>
                </form>
                
                {/* File upload */}
                <div 
                  {...getRootProps()} 
                  className={cn(
                    "border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors mb-4",
                    isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary/50"
                  )}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">Drag & drop RPM avatar GLB file</p>
                  <p className="text-xs text-muted-foreground mt-1">Or click to select file</p>
                </div>
                
                {/* Reset button */}
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => setAvatarUrl(DEFAULT_AVATAR_URL)}
                >
                  Reset to Default Avatar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;