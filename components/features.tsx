import Image from "next/image"

// import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface SecondHeroProps {
  index: number;
  id: string;
  title: string;
  description: string;
  image: string;
}

function Feature({ index, title,id, description, image }: SecondHeroProps) {
   console.log(index%2==0)
  return (
    <section  id={id}>
    <div className={`min-h-screen w-full transition-colors`}>
      <div className="container relative mx-auto px-4 py-16">

        <Card className="overflow-hidden border-none bg-background/60 backdrop-blur-sm shadow-none">
          <CardContent className="grid gap-8 p-12 md:grid-cols-2 shadow-none ">
          {index%2!=0&&<div className="relative aspect-square overflow-hidden rounded-lg">
              <Image src={image} alt="Astrapuff Preview" fill className="object-cover" priority />
            </div>}
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">{title}</h1>
              <p className="text-lg text-muted-foreground">
                {description}
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
            {index%2==0&&<div className="relative aspect-square overflow-hidden rounded-lg">
              <Image src={image} alt="Astrapuff Preview" fill className="object-cover" priority />
            </div>}
          </CardContent>
        </Card>
      </div>
      </div>
      </section>
  )
}

export default function Features() {
  const features: { id:string,title: string; description: string; image: string }[] = [
    {
      id:"two.one",
      title: "Companionship",
      description: `AstraPuffs feature Agenti NPCs who journey with you, tell stories, help solve puzzles, spark quests, and engage in heartfelt conversations—making every interaction feel like an adventure with a trusted friend`,
      image:"/features/companion.png",
    },
    {
      id:"two.two",
      title: "Safety",
      description: `To foster kindness, players who use toxic language are gently “bubbled,” causing their speech to appear as playful gibberish. They can still play, but group chat stays safe and respectful`,
      image:"/features/safety.png",
    },
    {
      id:"two.three",
      title: "Delight",
      description: `AstraPuffs bring joy through playful mechanics like bubble-making and effortless flying. Whether you’re gliding across shimmering skies or popping bubbles with friends, moments of wonder are always just a tap away`,
      image:"/features/delight.png",
    },
    {
      id:"two.four",
      title: "Fun",
      description: `From whimsical rain dances to grass-growing minigames, AstraPuffs offers endless fun. Shake trees for surprises, recycle with purpose, and craft across entire dimensions filled with color, magic, and meaning`,
      image:"/features/fun.png",
    }
  ]

  return (
    <>
      {
        features.map((feature, index) => (
          <Feature key={index} index={index} id={feature.id} title={feature.title} description={feature.description} image={feature.image} />
        ))
      }
    </>
  )
}