import Image from "next/image"

// import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function SecondHero() {
  return (
    <div className={`min-h-screen w-full transition-colors`}>
      <div className="container relative mx-auto px-4 py-16">

        <Card className="overflow-hidden border-none bg-background/60 backdrop-blur-sm shadow-none">
          <CardContent className="grid gap-8 p-6 md:grid-cols-2 md:p-12 shadow-none">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">What is astrapuff?</h1>
              <p className="text-2xl text-muted-foreground">
                Astrapuff is a multiplayer agentic NPC simulator that revolutionizes gaming experiences. Our advanced
                AI-driven NPCs create dynamic, responsive, and immersive environments that adapt to player interactions
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
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image src="/astra_2.png" alt="Astrapuff Preview" fill className="object-cover" priority />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

