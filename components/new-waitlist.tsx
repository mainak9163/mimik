"use client";
import "../styles/second-hero.css";
import { useCallback, useEffect, useMemo, useState } from "react";
// import confetti from "canvas-confetti"; //need to use dynamic import
export default function NewWaitlist() {
  const [emailCount, setEmailCount] = useState<number>(30);
  const screenSize = useScreenSize();

  const cachedFetchEmailCount = useCallback(
    async function fetchEmailCount() {
      setEmailCount((await getEmailCountFromEmailColumn()).count);
    }, [])
  
  useEffect(() => { 
    cachedFetchEmailCount();
  }, [cachedFetchEmailCount]);

  return (
    <div
      className="h-screen flex flex-col justify-center items-enter relative z-[5]"
      style={{
        background:
          "linear-gradient(135deg, #f8f9ff 0%, #fff5f8 50%, #f0fff4 100%)",
      }}
    >
       <Gravity
        attractorStrength={0.0}
        cursorStrength={0.0004}
        cursorFieldRadius={200}
        className="w-full h-full z-0 absolute hidden sm:block"
      >
        {[...Array(75)].map((_, i) => {
          // Adjust max size based on screen size
          const maxSize = screenSize.lessThan("sm")
            ? 20
            : screenSize.lessThan("md")
              ? 30
              : 40
          const size = Math.max(
            screenSize.lessThan("sm") ? 10 : 20,
            Math.random() * maxSize
          )
          return (
            <MatterBody
              key={i}
              matterBodyOptions={{ friction: 0.5, restitution: 0.2 }}
              x={`${Math.random() * 100}%`}
              y={`${Math.random() * 100}%`}
            >
              <div
                className="rounded-full bg-[#eee]"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                }}
              />
            </MatterBody>
          )
        })}
      </Gravity>
      <div>
        <div className="flex items-center p-1 w-fit border-1 border-[#FF9B9B]/50 rounded-xl px-2 mx-auto z-10 relative">
          <span className="relative flex size-3 mr-2 -mt-[2px]">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF9B9B]/80 opacity-75"></span>
            <span className="relative inline-flex size-3 rounded-full bg-[#FF9B9B]"></span>
          </span>
          <span className="text-[#cf689c] text-sm">
            PLAYTESTS STARTING SOON!
          </span>
        </div>
        <TextRotater/>
        <ElasticLiner/>


        <FloatingInput setEmailCount={setEmailCount} />
        <div className="mt-10">
          {/* <AnimatedTooltipPreview /> */}
          <div className="text-center text-sm sm:text-base text-[#c92838] ml-4 -mt-4">
            Join
            <span className="mx-2">
              <NumberTicker
                startValue={10}
                value={emailCount}
                className="whitespace-pre-wrap font-semibold tracking-tighter text-[#e3529a]"
              />
            </span>
            others on the waitlist
          </div>
        </div>
      </div>
    </div>
  );
}

import { Dispatch, SetStateAction } from "react";

interface FloatingInputProps {
  setEmailCount: Dispatch<SetStateAction<number>>;
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function FloatingInput({ setEmailCount }: FloatingInputProps) {
  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isFloating = isFocused || email.length > 0;
  const isValidEmail = useMemo(() => EMAIL_REGEX.test(email), [email]);
  const isSubmitDisabled = !email || !isValidEmail || isLoading;

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!isValidEmail) {
      toast.error('Please enter a valid email address', {
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      });
      return;
    }

    setIsLoading(true);

    try {
      await appendEmailToSheet(email);
      toast.success("You've been added to our waitlist!", {
        description: "We'll be in touch soon with updates.",
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      });
      setEmail('');
      setEmailCount((prev: number) => prev + 1);
      
      // Dynamic confetti import
      const confetti = (await import('canvas-confetti')).default;
      confetti?.();
    } catch (error) {
      console.error('Error appending email:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [email, isValidEmail, setEmailCount]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  }, [handleSubmit]);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  // Memoized class names
  const labelClasses = useMemo(() => 
    `absolute left-4 px-1 text-gray-500 pointer-events-none transition-all duration-200 ease-in-out ${
      isFloating
        ? '-top-5 text-sm text-blue-600 font-medium'
        : 'top-1/2 -translate-y-1/2 text-lg'
    }`, [isFloating]);

  const inputClasses = useMemo(() => 
    `w-full bg-transparent border-none outline-none text-lg z-[200] transition-all duration-200 ${
      isFloating ? 'pt-3 pb-2' : 'py-0'
    }`, [isFloating]);

  const buttonClasses = useMemo(() => 
    `w-fit mx-auto px-6 py-4 text-white font-medium rounded-lg text-lg transition-all duration-200 relative z-10 ${
      isSubmitDisabled
        ? 'bg-[#e02a85]/60 cursor-not-allowed'
        : 'bg-[#e02a85] hover:bg-[#e02a85]/80 cursor-pointer'
    }`, [isSubmitDisabled]);

  return (
    <div className="flex flex-col items-center justify-center p-8 w-full max-w-4xl mx-auto">
      <div className="relative border-2 border-gray-300 rounded-lg p-4 w-full h-16 flex items-center focus-within:border-[#e02a85] transition-colors duration-200 mb-4">
        <label className={labelClasses} htmlFor="email-input">
          Email
        </label>
        <input
          type="email"
          id="email-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={inputClasses}
        />
      </div>

      <button
        className={buttonClasses}
        disabled={isSubmitDisabled}
        onClick={handleSubmit}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <span>Joining...</span>
          </div>
        ) : (
          'Join waitlist'
        )}
      </button>
    </div>
  );
}

import React from "react";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { NumberTicker } from "./ui/number-ticker";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { appendEmailToSheet } from "@/lib/append-email";
import { getEmailCountFromEmailColumn } from "@/lib/get-number-email";
const people = [
  {
    id: 1,
    name: "John Doe",
    designation: "Software Engineer",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  },
  {
    id: 2,
    name: "Robert Johnson",
    designation: "Product Manager",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 3,
    name: "Jane Smith",
    designation: "Data Scientist",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 4,
    name: "Emily Davis",
    designation: "UX Designer",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 5,
    name: "Tyler Durden",
    designation: "Soap Developer",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
  },
  {
    id: 6,
    name: "Dora",
    designation: "The Explorer",
    image:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3534&q=80",
  },
];

export function AnimatedTooltipPreview() {
  return (
    <div className="flex flex-row items-center justify-center mb-10 w-full">
      <AnimatedTooltip items={people} />
    </div>
  );
}


import { LayoutGroup, motion } from "motion/react"

import TextRotate from "@/components/ui/text-rotate"
import ElasticLine from "./ui/elastic-line";
import Gravity, { MatterBody } from "./ui/cursor-attractor-and-gravity";
import useScreenSize from "@/lib/hooks/use-screen-size";

function TextRotater() {
  return (
    <div className="relative z-10 w-dvw text-2xl sm:text-3xl md:text-7xl flex flex-row items-center justify-center font-overused-grotesk my-6 dark:text-muted text-foreground font-light overflow-hidden">
      <LayoutGroup>
        <motion.p className="flex whitespace-pre" layout>
          <motion.span
            className="pt-0.5 sm:pt-1 md:pt-2"
            layout
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
          >
            Get in Touch with{" "}
          </motion.span>
          <TextRotate
            texts={[
              "Us!",
              "Astrapuffs ✽",
              "Friends",
              "Community",
            ]}
            mainClassName="text-white px-2 sm:px-2 md:px-3 bg-[#ff5941] overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
            staggerFrom={"last"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2000}
          />
        </motion.p>
      </LayoutGroup>
    </div>
  )
}





 function ElasticLiner() {

  return (
    <div className="max-w-5xl mx-auto flex-row items-center justify-center font-overused-grotesk overflow-hidden bg-white text-foreground dark:text-muted hidden sm:flex">
      <div className="absolute left-0 -top-20 w-full h-full z-10">
        {/* Animated elastic line */}
        <ElasticLine
          releaseThreshold={50}
          strokeWidth={1}
          animateInTransition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            delay: 0.15,
          }}
        />
      </div>
    </div>
  )
}
