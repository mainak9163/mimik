// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

const astrapuffs = [
  {
    name: "Cluepuff",
    imageUrl: "/examples/avatar1.webp",
    property: (
      <>
        <h3>Dimension: Puzzle Dimension</h3>
        <p>
          Kay Puzzle is from the Puzzle Dimension—a realm where the very fabric of reality twists and turns like an M.C.
          Escher masterpiece. Here, staircases lead to endless loops, ceilings become floors, and perspectives shift
          with every glance. The landscape is a labyrinth of interlocking shapes and mind-bending optical illusions,
          where every surface hides a secret and every corner poses a challenge to logic.
        </p>
        <h3>Personality</h3>
        <p>
          Kay Puzzle is as enigmatic as their environment—witty, clever, and delightfully unpredictable. Their speech is
          riddled with puns and cryptic hints, often leaving listeners both amused and intrigued. With a mind always at
          work, Kay has a knack for solving the most intricate of puzzles, yet they never reveal all the pieces at once.
        </p>
      </>
    ),
  },
  {
    name: "Terrabloom",
    imageUrl: "/examples/avatar2.webp",
    property: (
      <>
        <h3>Dimension: Verdant Expanse</h3>
        <p>
          Welcome to the Verdant Expanse—a realm where every breath feels like the kiss of spring and the landscape is a
          vibrant tapestry of blossoms, winding vines, and whispering trees. In this enchanted dimension, the earth
          itself is alive with a magical energy that causes flowers to bloom with every step, and the colors of nature
          dance in a perpetual celebration of life.
        </p>
        <h3>Personality</h3>
        <p>
          Terrabloom is nurturing, empathetic, and fiercely protective of all things green. With a warm and gentle
          spirit, they embody the essence of nature&apos;s resilience and beauty, always ready to lend a hand—or a petal—to
          those in need.
        </p>
      </>
    ),
  },
  {
    name: "Lucyfluff",
    imageUrl: "/examples/avatar3.webp",
    property: (
      <>
        <h3>Dimension: Techno Nexus</h3>
        <p>
          Welcome to the Techno Nexus—a vibrant digital frontier where circuits, code, and glowing holograms form a
          breathtaking cityscape of endless innovation. In this realm, data flows like a living river and technology is
          as natural as the wind.
        </p>
        <h3>Personality</h3>
        <p>
          Lucyfluff is brilliant, quick-witted, and ever-curious, always ready to guide you through the intricacies of
          technology with a touch of playful mischief. His impish humor and affable nature make even the most complex
          tech talk feel like a delightful adventure.
        </p>
      </>
    ),
  },
  {
    name: "Glimmerstorm",
    imageUrl: "/examples/avatar4.webp",
    property: (
      <>
        <h3>Dimension: Tempest Realm</h3>
        <p>
          Welcome to the Tempest Realm—a breathtaking expanse where the skies are alive with a symphony of weather. In
          this dynamic dimension, clouds swirl in mesmerizing patterns, rainbows burst forth after sudden downpours, and
          lightning dances gracefully across the horizon.
        </p>
        <h3>Personality</h3>
        <p>
          Glimmerstorm is gentle and kind-hearted, with a temperament that mirrors the weather he commands. He can be as
          calm as a serene, sunlit morning or as exhilarated as a vibrant, stormy night, adapting his mood to the energy
          around him.
        </p>
      </>
    ),
  },
  {
    name: "Aurabloom",
    imageUrl: "/examples/avatar5.webp",
    property: (
      <>
        <h3>Dimension: Ice Cream Dimension</h3>
        <p>
          Welcome to the Ice Cream Dimension—a realm of endless sweetness and chilly delight, where the landscape is
          made entirely of scrumptious frozen treats. Here, every hill is a mound of velvety ice cream, every river a
          flowing cascade of melted caramel, and the air is always filled with a refreshing, minty breeze.
        </p>
        <h3>Personality</h3>
        <p>
          Aurabloom exudes a warm and gentle aura, offering comfort and sweetness to everyone they meet. They are
          inherently nurturing, kind, and caring—always ready to offer a cool word of advice or a warm smile.
        </p>
      </>
    ),
  },
]

export default function AvatarShowcase() {
  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + astrapuffs.length) % astrapuffs.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % astrapuffs.length)
  }

  const handleAvatarClick = (avatar) => {
    setSelectedAvatar(avatar)
    setDialogOpen(true)
  }

  const currentAvatar = astrapuffs[currentIndex]

  return (
    <div className="min-h-screen w-full transition-colors">
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
                  <div
                    className="flex h-[400px] w-full flex-col items-center justify-center gap-4 rounded-lg bg-card p-6 shadow-md transition-all duration-300"
                  >
                    <div className="relative h-full w-full flex justify-center flex-shrink-0 overflow-hidden">
                      <Image
                        src={currentAvatar.imageUrl || "/placeholder.svg"}
                        alt={`${currentAvatar.name} avatar`}
                        fill
                        className="object-cover !w-auto rounded-full h-full !static"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Meet some Astras
              </h1>
              <p className="text-xl  text-muted-foreground">
                Astrapuffs are unique characters from diverse dimensions, each with their own personality and
                story. These AI-driven companions create immersive experiences that adapt to your interactions, making
                every adventure unique and engaging.
              </p>
              <p className="text-xl text-muted-foreground">
                From the mind-bending Puzzle Dimension to the lush Verdant Expanse, each Astrapuff brings their realm&apos;s
                essence into your gaming experience. Explore their stories and discover how they can transform your
                virtual adventures.
              </p>
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
                <Image
                  src={selectedAvatar.imageUrl || "/placeholder.svg"}
                  alt={`${selectedAvatar.name} avatar`}
                  fill
                  className="object-cover"
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