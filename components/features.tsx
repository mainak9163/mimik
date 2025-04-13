import { Card, CardContent } from "@/components/ui/card";
import { FC } from "react";
import CustomCarousel from "./custom-carousel";

interface SecondHeroProps {
  index: number;
  id: string;
  title: string;
  description: string;
  image: string|string[];
}

const Feature: FC<SecondHeroProps> = ({
  index,
  title,
  id,
  description,
  image,
}) => {

  return (
    <section id={id}>
      <div className={`w-full transition-colors py-3`}>
        <div className="container relative mx-auto px-4 pt-16">
          <Card className="overflow-hidden border-none bg-background/60 backdrop-blur-sm shadow-none">
            <CardContent
              className={`flex gap-10 lg:gap-20 justify-between flex-col ${
                index % 2 ? "lg:flex-row-reverse" : "lg:flex-row"
              }`}
            >
              <div className="space-y-6 w-full">
                <h2 className="text-5xl font-medium sour-gummy " style={{color:index%2==0?"#f58895":"#0edcdc"}}>
                  {title}
                </h2>
                <p className="text-xl text-muted-foreground">{description}</p>
              </div>
              <div className="w-full">
                {Array.isArray(image) ? (
                 <CustomCarousel images={image} autoPlayInterval={5000} />
                ) : (
                  <img src={image} className="w-full bg-cover rounded-3xl" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default function Features() {
  const features: {
    id: string;
    title: string;
    description: string;
    image: string|string[];
  }[] = [
    {
      id: "two.one",
      title: "Companionship",
      description: `AstraPuffs feature Agentic NPCs that act as your in-game companions, tell stories, help solve puzzles, spark quests, and engage in heartfelt conversations—making every interaction feel like an adventure with a trusted friend`,
      image: "/features/companion.webp",
    },
    {
      id: "two.two",
      title: "Calm",
      description: `Landscapes shift with your journey—from cozy meadows to glowing crystal caves—each designed to spark curiosity and invite peaceful exploration, blending comfort with a sense of magical discovery.`,
      image: ["/features/estrellas.webp","/features/dia.webp","/features/nocheLuna.webp", "/features/amanecer.webp"],
    },
    {
      id: "two.three",
      title: "Safety",
      description: `To foster kindness, players who use toxic language are gently “bubbled,” causing their speech to appear as playful gibberish to other players. They can still play and interact with Astras, but group chat stays safe and respectful`,
      image: "/features/safety.webp",
    },
    {
      id: "two.four",
      title: "Delight",
      description: `AstraPuffs bring joy through playful mechanics like making bubbles and flying. Whether you’re gliding across shimmering skies or popping bubbles with friends, moments of wonder are always just a tap away`,
      image: "/features/delight.webp",
    },
    {
      id: "two.five",
      title: "Fun",
      description: `From whimsical rain dances to grass-growing minigames, AstraPuffs offers endless fun. Shake trees for candies, recycle with purpose, and craft across entire dimensions filled with color, magic, and whymsical experiences`,
      image: "/features/fun.webp",
    },
  ];

  return (
    <div>
      <div className="container relative mx-auto px-4 pt-16">
        <h1 className="text-6xl text-center font-semibold sour-gummy sm:text-5xl xl:text-6xl/none">
         <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f58895] to-[#0edcdc]"> Key Features</span>
        </h1>
      </div>
      {features.map((feature, index) => (
        <Feature
          key={index}
          index={index}
          id={feature.id}
          title={feature.title}
          description={feature.description}
          image={feature.image}
        />
      ))}
    </div>
  );
}
