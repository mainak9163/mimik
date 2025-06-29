"use client"
import "../styles/second-hero.css"
import { useState } from "react";
import confetti from "canvas-confetti";
export default function NewWaitlist() {
    return (
        <div className="h-screen flex flex-col justify-center items-enter relative"
         style={{
        background:
          "linear-gradient(135deg, #f8f9ff 0%, #fff5f8 50%, #f0fff4 100%)",
      }}>
            <div>
                <div className="flex items-center p-1 w-fit border-1 border-[#FF9B9B]/50 rounded-xl px-2 mx-auto">
                    <span className="relative flex size-3 mr-2 -mt-[2px]">
  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF9B9B]/80 opacity-75"></span>
  <span className="relative inline-flex size-3 rounded-full bg-[#FF9B9B]"></span>
                    </span>
                    <span  className="text-[#cf689c] text-sm font-semibold">AVAILABLE IN EARLY 2025</span>
                </div>
                <div className="flex flex-col gap-y-2 mx-auto w-fit text-center my-6">
                    <p className="text-xl sm:text-2xl font-semibold text-[#e3529a]">Get early access</p>
                    <p className="text-sm sm:text-base max-w-[400px] text-[#c92838]">Be amongst the first to experience ,wait and launch a viral waitlist. Sign up to be notified when we launch!</p>
                </div>
                <FloatingInput />
                <div className="mt-10">
                    <AnimatedTooltipPreview />
                    <div className="text-center text-sm sm:text-base text-[#c92838] ml-4 -mt-4">
                        Join 
                        <span className="mx-2">
                            <NumberTicker
                            startValue={10000}
      value={12500}
      className="whitespace-pre-wrap font-semibold tracking-tighter text-[#e3529a]"
                            /></span>
                        others on the waitlist
                    </div>
                    </div>
        </div>
        <Asset />
        
        </div>
    )
}

function FloatingInput() {
  const [email, setEmail] = useState("")
  const [isFocused, setIsFocused] = useState(false)
 const [isLoading, setIsLoading] = useState(false);

  const isFloating = isFocused || email.length > 0;

  // Email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validateEmail = (email:string) => {
    return emailRegex.test(email);
  };

  const isValidEmail = validateEmail(email);
    const isSubmitDisabled = !email || !isValidEmail || isLoading;
    
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
    
        if (!email) {
          toast.error("Please enter your email address")
          return
        }
    
        if (!validateEmail(email)) {
          toast.error("Please enter a valid email address", {
            icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          })
          return
        }
    
        setIsLoading(true)
    
        try {
          await appendEmailToSheet(email)
          toast.success("You've been added to our waitlist!", {
            description: "We'll be in touch soon with updates.",
            icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
          })
            setEmail("")
            confetti();
        } catch (error: unknown) {
            console.error("Error appending email:", error)
          toast.error("Something went wrong. Please try again.")
        } finally {
          setIsLoading(false)
        }
      }

      const handleKeyPress = (e: React.KeyboardEvent<Element>) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative bg-white border-2 border-gray-300 rounded-lg p-4 w-80 sm:w-100 h-12 flex items-center focus-within:border-[#e02a85] transition-colors duration-200">
        {/* Floating Label */}
        <label
          className={`absolute left-3 bg-white px-1 text-gray-500 pointer-events-none transition-all duration-200 ease-in-out ${
            isFloating ? "-top-2 text-xs text-blue-600 font-medium" : "top-1/2 -translate-y-1/2 text-base"
          }`}
        >
          Email
        </label>

        {/* Input Field */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyPress={handleKeyPress}
          className={`w-full bg-transparent border-none outline-none text-base ${
            isFloating ? "pt-2 pb-1" : "py-0"
          } transition-all duration-200`}
        />

              {/* Join Waitlist Button */}
          <button 
            className={`absolute right-1 top-1/2 -translate-y-1/2 px-4 py-2 text-white font-medium rounded-lg text-sm transition-all duration-200 ${
              isSubmitDisabled 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#e02a85] hover:bg-[#e02a85]/80 cursor-pointer'
            }`}
          disabled={isSubmitDisabled}
          onClick={handleSubmit}
          >
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                <span className="text-xs">Joining...</span>
              </div>
            ) : (
              "Join waitlist"
            )}
              </button>
          </div>
    </div>
  )
}

import React from "react";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { NumberTicker } from "./ui/number-ticker";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { appendEmailToSheet } from "@/lib/append-email";
import { Asset } from "./second-hero-asset";
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

