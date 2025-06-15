"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

// import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { bungee, righteous } from "@/lib/fonts"
import "@/styles/second-hero.css"

export default function SecondHero() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '-50px 0px'
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <div ref={sectionRef} className={`w-full transition-colors second-hero relative`}>
      <div className="container relative mx-auto px-4 pt-8 pb-0">
        <Card className="overflow-hidden border-none shadow-none bg-transparent">
          <CardContent className="grid gap-8 p-6 md:grid-cols-2 md:p-12 shadow-none">
            <div className="space-y-6">
              <div>

              <h1 className={`text-4xl font-semibold sm:text-5xl righteous-regular ${bungee.className} slide-up-title ${isVisible ? 'visible' : ''}`}>
                <span className="title-what">What is</span><br />
                <span className="title-astrapuff">Astrapuffs?</span>
              </h1>
              </div>
              <p style={{fontWeight: 100,}} className={`text-2xl text-[#4a5568] font-thin leading-10  slide-up-description ${isVisible ? 'visible' : ''}`}>
                Astrapuffs is an agentic NPC multiplayer that is set to revolutionize the cozy gaming genre. Our advanced
                AI-driven NPCs create dynamic, responsive, and immersive stories that adapt to the player interactions
                in real-time.
              </p>
              {/* <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="font-medium">
                  Get Started
                </Button>
                <Button variant="outline" size="lg" className="font-medium">
                  Learn More
                </Button>
              </div> */}
            </div>
            <div className="relative rounded-lg h-full flex items-center justify-center">
              <Image 
                src="/astra_2.webp" 
                alt="Astrapuff Preview" 
                width={500} 
                height={500}  
                className={`mt-0 sm:w-[550px] sm:-mt-[100px] mx-auto bouncy-image ${isVisible ? 'visible' : ''}`} 
                priority 
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const Asset = () => (
  <div className="bouncy-asset hidden sm:block">
    <div className="blob-body h-[50px] w-[50px]">
      <div className="face">
        <div className="eyes">
          <div className="eye"></div>
          <div className="eye"></div>
        </div>
        <div className="mouth"></div>
      </div>
      <div className="cheek cheek-left"></div>
      <div className="cheek cheek-right"></div>
    </div>
    <div className="hat"></div>
    <div className="sparkle sparkle-1"></div>
    <div className="sparkle sparkle-2"></div>
    <div className="sparkle sparkle-3"></div>
    <div className="sparkle sparkle-4"></div>
    <div className="heart heart-1"></div>
    <div className="heart heart-2"></div>
    <div className="shadow"></div>
  </div>
)