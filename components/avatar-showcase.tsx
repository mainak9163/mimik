"use client"
import { useState, useEffect, JSX, SetStateAction, useRef } from "react"
import { ChevronLeft, ChevronRight, Info } from "lucide-react"
import AvatarFeaturer from "./avatar-component"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { bungee } from "@/lib/fonts"
import "@/styles/second-hero.css"

const astrapuffs = [
  {
    name: "Cluepuff",
    imageUrl: "/examples/avatar1.webp",
    bgColor: "#fb923c",
    property: (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            🧩 Puzzle Dimension Guide
          </h3>
          <p className="text-gray-700 leading-relaxed">
            From a mind-bending realm of M.C. Escher-like illusions where reality twists through 
            endless loops and impossible geometries. Cluepuff is an enigmatic puzzle master with 
            a razor-sharp wit, speaking in clever puns and cryptic riddles that both amuse and 
            intrigue. Always thinking several steps ahead, they reveal solutions piece by piece, 
            making every interaction a delightful mental challenge.
          </p>
        </div>
      </div>
    ),
  },
  {
    name: "Terrabloom",
    imageUrl: "/examples/avatar2.webp",
    bgColor: "#4ade80",
    property: (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            🌸 Verdant Expanse Nurturer
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Hails from an enchanted realm where every step blooms flowers and nature dances in 
            perpetual celebration. This gentle soul embodies the resilience and beauty of the 
            natural world, offering nurturing care and fierce protection to all living things. 
            With an empathetic heart and healing touch, Terrabloom brings growth and harmony 
            wherever they go.
          </p>
        </div>
      </div>
    ),
  },
  {
    name: "Lucyfluff",
    imageUrl: "/examples/avatar3.webp",
    bgColor: "#f87171",
    property: (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            ⚡ Techno Nexus Innovator
          </h3>
          <p className="text-gray-700 leading-relaxed">
            A brilliant digital native from a cyberpunk wonderland of flowing data streams and 
            holographic cities. Quick-witted and endlessly curious, Lucyfluff navigates complex 
            technology with playful mischief and infectious enthusiasm. Their impish humor and 
            warm personality transform even the most intimidating tech concepts into delightful 
            adventures of discovery.
          </p>
        </div>
      </div>
    ),
  },
  {
    name: "Glimmerstorm",
    imageUrl: "/examples/avatar4.webp",
    bgColor: "#facc15",
    property: (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            ⛈️ Tempest Realm Conductor
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Master of the ever-changing Tempest Realm where weather performs a breathtaking 
            symphony across dynamic skies. Gentle and kind-hearted, Glimmerstorm&apos;s mood flows 
            like the weather they command—from serene morning calm to exhilarating stormy 
            passion. They bring balance and wonder, adapting gracefully to the energy of 
            those around them.
          </p>
        </div>
      </div>
    ),
  },
  {
    name: "Aurabloom",
    imageUrl: "/examples/avatar5.webp",
    bgColor: "#60a5fa",
    property: (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            🍦 Ice Cream Dimension Sweetkeeper
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Guardian of a deliciously sweet frozen paradise where hills are made of velvety 
            ice cream and rivers flow with liquid caramel. Despite their chilly domain, 
            Aurabloom radiates warmth through their nurturing spirit and gentle care. Always 
            ready with comforting words and sweet smiles, they bring joy and refreshment to 
            weary souls seeking solace.
          </p>
        </div>
      </div>
    ),
  },
];

export default function AvatarShowcase() {
  const [selectedAvatar, setSelectedAvatar] = useState(astrapuffs[0]) // Default to first avatar
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [imageTransform, setImageTransform] = useState({ x: 0, y: 0, scale: 1 })
const imageRef = useRef<HTMLDivElement>(null)

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + astrapuffs.length) % astrapuffs.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % astrapuffs.length)
  }

const [isChanging, setIsChanging] = useState(false)

// Modify the handleAvatarClick function
const handleAvatarClick = (avatar: SetStateAction<{ name: string; imageUrl: string; bgColor: string; property: JSX.Element }>) => {
  if (isMobile) {
    setSelectedAvatar(avatar)
    setDialogOpen(true)
  } else {
    if (selectedAvatar?.name !== avatar.name) {
      setIsChanging(true)
      setTimeout(() => {
        setSelectedAvatar(avatar)
        setTimeout(() => setIsChanging(false), 50)
      }, 150)
    }
  }
  }
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  if (!imageRef.current) return
  
  const rect = imageRef.current.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  
  const mouseX = e.clientX
  const mouseY = e.clientY
  
  const deltaX = (mouseX - centerX) / rect.width
  const deltaY = (mouseY - centerY) / rect.height
  
  const maxStretch = 30
  const stretchX = Math.max(-maxStretch, Math.min(maxStretch, deltaX * maxStretch))
  const stretchY = Math.max(-maxStretch, Math.min(maxStretch, deltaY * maxStretch))
  
  setImageTransform({
    x: stretchX,
    y: stretchY,
    scale: 1.05
  })
}

const handleMouseLeave = () => {
  setImageTransform({ x: 0, y: 0, scale: 1 })
}

  const currentAvatar = astrapuffs[currentIndex]

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="min-h-screen w-full transition-colors py-8"
       style={{
        background:
          "linear-gradient(135deg, #f8f9ff 0%, #fff5f8 50%, #f0fff4 100%)",
      }}>
                      <h2 className={`text-2xl font-semibold sm:text-5xl righteous-regular ${bungee.className} slide-up-title`}>
                <span className="title-what">Explore our</span>
                <span className="title-astrapuff ml-3">Astrapuffs</span>
              </h2>
        <div className="container relative mx-auto px-4 py-16">
          <Card className="overflow-hidden border-none bg-background/60 shadow-none">
            <CardContent className="grid gap-8 p-6 md:grid-cols-2 md:p-12">
              <div className="relative flex flex-col items-center">
                {/* Navigation controls with improved positioning */}
                <div className="flex w-full justify-between pb-6">
                  <div
                    onClick={handlePrevious}
                    className="z-20 rounded-full active:opacity-50 hover:opacity-75"
                    aria-label="Previous avatar"
                  >
                    <ChevronLeft className="w-20 h-20 cursor-pointer" />
                  </div>
                  <div className="text-center">
                    <h3 className="mb-2 text-3xl sm:text-4xl font-semibold">{currentAvatar.name}</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2" 
                      onClick={() => handleAvatarClick(currentAvatar)}
                      aria-label={`Learn more about ${currentAvatar.name}`}
                    >
                      <Info className="h-4 w-4" />
                      Know More
                    </Button>
                  </div>
                  <div
                    onClick={handleNext}
                    className="z-20 rounded-full active:opacity-50 hover:opacity-75"
                    aria-label="Next avatar"
                  >
                    <ChevronRight className="w-20 h-20 cursor-pointer" />
                  </div>
                </div>

                {/* Card container with backdrop blur effect */}
                <div className="relative h-[400px] w-full overflow-hidden rounded-lg bg-gradient-to-b from-background/10 to-background/60 backdrop-blur-sm">
                  <div className="flex h-full items-center justify-center">
                    <div className="flex h-[400px] w-full flex-col items-center justify-center gap-4 rounded-lg bg-card p-6 shadow-md transition-all duration-300">
                      <div className="relative h-full w-full flex justify-center flex-shrink-0 overflow-hidden">
                        <img
                          src={currentAvatar.imageUrl || "/placeholder.svg"}
                          alt={`${currentAvatar.name} avatar`}
                          className="object-cover w-auto rounded-full h-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedAvatar && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedAvatar.name}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4 md:grid-cols-[200px_1fr]">
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <img
                    src={selectedAvatar.imageUrl || "/placeholder.svg"}
                    alt={`${selectedAvatar.name} avatar`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="prose prose-sm dark:prose-invert">{selectedAvatar.property}</div>
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    )
  }
// console.log(selectedAvatar)
  // Desktop Layout - Three Column Grid
  return (
    <div className="w-full transition-colors py-16"
     style={{
        background:
          "linear-gradient(135deg, #f8f9ff 0%, #fff5f8 50%, #f0fff4 100%)",
      }}>
                            <h2 className={`text-4xl font-semibold sm:text-5xl righteous-regular text-center ${bungee.className}`}>
                <span className="title-what">Explore our</span>
                <span className="title-astrapuff ml-3">Astrapuffs</span>
              </h2>
      <div className="container mx-auto py-16 pb-0">
        <div className="flex gap-x-2">
          {/* First Column - Avatar List */}
          <div className="flex w-[35%] flex-col gap-4 p-6 pr-0 rounded-lg">
            {/* <h2 className="text-2xl font-semibold mb-4">Choose Avatar</h2> */}
            <div className="flex flex-wrap gap-4">
              {astrapuffs.map((avatar) => (
                <AvatarFeaturer
                  key={avatar.name}
                  imgSrc={avatar.imageUrl}
                  bgColor={avatar.bgColor}
                  onClick={() => handleAvatarClick(avatar)}
                  isSelected={selectedAvatar?.name == avatar.name}
                />
              ))}
            </div>
          </div>

          {/* Second Column - Avatar Image */}
          <div className="flex w-[35%] items-start justify-center p-6 pl-0 rounded-lg overflow-hidden">
  <div 
  className="relative w-80 h-80 overflow-hidden rounded-full cursor-pointer"
  onMouseMove={handleMouseMove}
  onMouseLeave={handleMouseLeave}
  ref={imageRef}
>
 <img
  src={selectedAvatar?.imageUrl || "/placeholder.svg"}
  alt={`${selectedAvatar?.name} avatar`}
  className={`w-full h-full object-cover transition-all duration-300 ease-out ${
    isChanging ? 'transform translate-y-full' : 'transform translate-y-0'
  }`}
  style={{
    transform: `translate(${imageTransform.x}px, ${imageTransform.y}px) scale(${imageTransform.scale})`
  }}
/>
  </div>
</div>

          {/* Third Column - Name and Description */}
          <div className="flex flex-col w-[30%] p-2 rounded-lg">
            <h1 className="text-4xl font-bold mb-6">{selectedAvatar?.name}</h1>
            <ScrollArea className="flex-1">
              <div className="prose prose-sm dark:prose-invert">
                {selectedAvatar?.property}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}