"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FC, useEffect, useRef, useState } from "react";
import CustomCarousel from "./custom-carousel";
import { lilita, nunito, righteous } from "@/lib/fonts";
import FireIcon from "@/lib/fire";
import TreeIcon from "@/lib/tree";
import ShieldIcon from "@/lib/shield";
import IcecreamIcon from "@/lib/ice-cream";
import MagicIcon from "@/lib/magic";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

interface SecondHeroProps {
  index: number;
  id: string;
  title: string;
  description: string;
  image: string | string[];
  asset: string;
}

const Feature: FC<SecondHeroProps> = ({
  index,
  title,
  id,
  description,
  image,
  asset,
}) => {
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
      { threshold: 0.1 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const AssetIcon = ({ type }: { type: string }) => {
    const baseClasses = "w-9 h-9 hidden lg:block mr-3";

    switch (type) {
      case "fire":
        return (
          <div className={`${baseClasses} text-orange-500`}>
            <FireIcon />
          </div>
        );
      case "tree":
        return (
          <div className={`${baseClasses} text-green-600`}>
            <TreeIcon />
          </div>
        );
      case "shield":
        return (
          <div className={`${baseClasses} text-blue-600`}>
            <ShieldIcon />
          </div>
        );
      case "icecream":
        return (
          <div className={`${baseClasses} text-pink-500`}>
            <IcecreamIcon />
          </div>
        );
      case "magic":
        return (
          <div className={`${baseClasses} text-purple-600`}>
            <MagicIcon />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id={id} ref={ref} className="w-screen shrink-0 px-4">
      <div className="w-full h-screen flex items-center justify-center">
        <Card className="overflow-hidden border-none !bg-transparent shadow-none max-w-6xl w-full">
          <CardContent className="flex gap-10 lg:gap-20 justify-between flex-col h-full">
            <div
              className={`my-auto space-y-3 w-full transform transition-all duration-700 ease-out ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="flex items-center justify-center">
                <AssetIcon type={asset} />
                <h2
                  className={`text-5xl sm:text-6xl font-semibold bg-gradient-to-r from-purple-600 via-pink-400 to-blue-600 bg-clip-text text-black/40 ${righteous.className}`}
                >
                  {title}
                </h2>
              </div>
              <p
                className={`text-xl sm:text-2xl text-center bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent leading-relaxed ${nunito.className}`}
              >
                {description}
              </p>
            </div>
            <div
              className={`w-full transform transition-all duration-700 ease-out ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              } group`}
              style={{ transitionDelay: `${index * 200 + 100}ms` }}
            >
              <div className="relative overflow-hidden rounded-3xl transition-all duration-300 hover:scale-105 hover:rotate-1">
                {Array.isArray(image) ? (
                  <div className="transform transition-transform duration-300">
                    <CustomCarousel images={image} autoPlayInterval={5000} />
                  </div>
                ) : (
                  <img
                    src={image}
                    className="w-full max-w-2xl mx-auto bg-cover rounded-3xl transform transition-transform duration-300"
                    alt={title}
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default function Features() {
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const features: {
    id: string;
    title: string;
    description: string;
    image: string | string[];
    asset: string;
  }[] = [
    {
      id: "two.one",
      title: "Companionship",
      description: `AstraPuffs feature Agentic NPCs that act as your in-game companions, tell stories, help solve puzzles, spark quests, and engage in heartfelt conversations—making every interaction feel like an adventure with a trusted friend`,
      image: "/features/companion.webp",
      asset: "fire",
    },
    {
      id: "two.two",
      title: "Calm",
      description: `Landscapes shift with your journey—from cozy meadows to glowing crystal caves—each designed to spark curiosity and invite peaceful exploration, blending comfort with a sense of magical discovery.`,
      image: [
        "/features/dia.webp",
        "/features/estrellas.webp",
        "/features/nocheLuna.webp",
        "/features/amanecer.webp",
      ],
      asset: "tree",
    },
    {
      id: "two.three",
      title: "Safety",
      description: `To foster kindness, players who use toxic language are gently "bubbled," causing their speech to appear as playful gibberish to other players. They can still play and interact with Astras, but group chat stays safe and respectful`,
      image: "/features/safety.webp",
      asset: "shield",
    },
    {
      id: "two.four",
      title: "Delight",
      description: `AstraPuffs bring joy through playful mechanics like making bubbles and flying. Whether you're gliding across shimmering skies or popping bubbles with friends, moments of wonder are always just a tap away`,
      image: "/features/delight.webp",
      asset: "icecream",
    },
    {
      id: "two.five",
      title: "Fun",
      description: `From whimsical rain dances to grass-growing minigames, AstraPuffs offers endless fun. Shake trees for candies, recycle with purpose, and craft across entire dimensions filled with color, magic, and whymsical experiences`,
      image: "/features/fun.webp",
      asset: "magic",
    },
  ];

  // Register GSAP plugin
  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    // GSAP horizontal scroll animation
    const ctx = gsap.context(() => {
      gsap.to(featuresRef.current, {
        xPercent: -100 * (features.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (features.length - 1),
          end: () =>
            containerRef.current
              ? `+=${containerRef.current.offsetWidth}`
              : "+=0",
        },
      });
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [features.length]);

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #f8f9ff 0%, #fff5f8 50%, #f0fff4 100%)",
      }}
    >
      {/* Header Section */}
      <div className="py-16">
        <div className="container relative mx-auto px-4">
          <h1
            className={`text-4xl sm:text-5xl text-center text-[#4a5568] ${lilita.className}`}
          >
            Key Features
          </h1>
        </div>
      </div>

      {/* Horizontal Scroll Section */}
      <section
        ref={containerRef}
        className="overflow-hidden"
        style={{
          width: `${features.length * 100}vw`,
          background:
            "linear-gradient(135deg, #f8f9ff 0%, #fff5f8 50%, #f0fff4 100%)",
        }}
      >
        <div className="flex flex-nowrap h-screen">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              ref={(el) => {
                featuresRef.current[index] = el;
              }}
              className="w-screen shrink-0"
            >
              <Feature
                index={index}
                id={feature.id}
                title={feature.title}
                description={feature.description}
                image={feature.image}
                asset={feature.asset}
              />
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        @keyframes bounce-subtle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }

        @keyframes sway {
          0%,
          100% {
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

        .animate-bounce-subtle {
          animation: bounce-subtle 6s ease-in-out infinite;
        }

        .animate-sway {
          animation: sway 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        @keyframes subtleBounce {
          0%,
          100% {
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

        .subtle {
          animation: subtleBounce 1.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
