/* eslint-disable @next/next/no-img-element */
"use client";
import React from 'react';
import { GlowingEffect } from "@/components/ui/glowing-effect";

export function AstrapuffFeatures() {
  const features = [
    {
      title: "Cozy",
      description: "Astrapuff is a multiplayer agentic NPC simulator",
      image: "/astra2.png"
    },
    {
      title: "Companion",
      description: "Astrapuff is a multiplayer agentic NPC simulator",
      image: "/astra3.png"
    },
    {
      title: "Delight",
      description: "Astrapuff is a multiplayer agentic NPC simulator",
      image: "/astra4.png"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">Features</h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {features.map((feature, index) => (
          <FeatureCard 
            key={index}
            title={feature.title}
            description={feature.description}
            image={feature.image}
          />
        ))}
      </div>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  image: string;
}

const FeatureCard = ({ title, description, image }: FeatureCardProps) => {
  return (
    <div className="relative h-full">
      <div className="relative rounded-2xl border-[0.75px] border-border p-2 md:p-3 h-full">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={2}
        />
        <div className="relative flex flex-col items-center justify-between h-full overflow-hidden rounded-xl border-[0.75px] bg-background p-6 shadow-sm">
          <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted mb-6">
            <img 
              src={image} 
              alt={`${title} feature`} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="text-center space-y-3">
            <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstrapuffFeatures;