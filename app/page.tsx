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
const DEFAULT_AVATAR_URL = "/models/astra_glim.glb";

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
  useEffect(() => {
    // Clear the head mesh array before adding new meshes
    headMesh = [];
    
    // Log all available nodes for reference
    console.log("Available nodes:", Object.keys(nodes));
    
    // Only add nodes that actually exist and have morphTargets
    Object.values(nodes).forEach(node => {
      if (node && node.isMesh && node.morphTargetDictionary && node.morphTargetInfluences) {
        headMesh.push(node);
        console.log("Added mesh with morphTargets:", node.name);
      }
    });
    
    console.log("Found head meshes with morphTargets:", headMesh.length);
    
    // Initialize rotation if not already set
    if (!rotation) {
      rotation = new Euler(0, 0, 0);
    }
  }, [nodes, url]);

  useFrame(() => {
    frameCountRef.current += 1;
    
    // Apply blendshapes if they exist
    if (blendshapes && blendshapes.length > 0) {
      // Apply blendshapes cautiously
      blendshapes.forEach(element => {
        headMesh.forEach(mesh => {
          if (mesh && mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
            const index = mesh.morphTargetDictionary[element.categoryName];
            if (index !== undefined && index >= 0) {
              mesh.morphTargetInfluences[index] = element.score;
            }
          }
        });
      });
      
      // Apply rotation very conservatively
      if (rotation) {
        // Find head node - be very careful with rotation
        if (nodes.head) {
          // Apply gentler rotation
          nodes.head.rotation.x = rotation.x * 0.7;
          nodes.head.rotation.y = rotation.y * 0.7;
          nodes.head.rotation.z = rotation.z * 0.7;
        }
      }
    }
  });

// Update the primitive component in the Avatar function
// Adjust the Avatar component's return statement for better positioning:
return <primitive 
  object={scene} 
  position={[0, -1, 0]} 
  scale={1.0} 
  rotation={[0, 0, 0]}
/>
}

function App() {
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR_URL);
  const [customUrl, setCustomUrl] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionActive, setPredictionActive] = useState(false);
  
  // Ref to store the animation frame ID for proper cleanup
  const animationFrameRef = useRef(null);

  function analyzeModelStructure(scene) {
    console.log("Analyzing model structure...");
    
    // Find all meshes with morph targets
    const meshesWithMorphs = [];
    scene.traverse((node) => {
      if (node.isMesh && node.morphTargetDictionary && node.morphTargetInfluences) {
        meshesWithMorphs.push({
          name: node.name,
          morphTargets: Object.keys(node.morphTargetDictionary)
        });
      }
    });
    
    console.log("Meshes with morph targets:", meshesWithMorphs);
    
    // Find all bones that might be relevant for head movement
    const relevantBones = [];
    scene.traverse((node) => {
      if (node.isBone && (
        node.name.includes('Head') || 
        node.name.includes('head') || 
        node.name.includes('Neck') || 
        node.name.includes('neck') || 
        node.name.includes('Face') || 
        node.name.includes('face')
      )) {
        relevantBones.push(node.name);
      }
    });
    
    console.log("Relevant bones:", relevantBones);
    
    return { meshesWithMorphs, relevantBones };
  }
  
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
                <Canvas 
  className="w-full h-full" 
  camera={{ 
    fov: 40, 
    position: [0, 0, 3], 
    near: 0.1, 
    far: 1000 
  }} 
  shadows
>
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