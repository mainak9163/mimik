import { Card, CardContent } from "@/components/ui/card";
import { FC } from "react";

interface SecondHeroProps {
  index: number;
  id: string;
  title: string;
  description: string;
  image: string;
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
                <h2 className="text-5xl font-bold tracking-tighter ">
                  {title}
                </h2>
                <p className="text-xl text-muted-foreground">{description}</p>
              </div>
              <div className="w-full overflow-hidden rounded-3xl">
                <img src={image} className="w-full bg-cover" />
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
    image: string;
  }[] = [
    {
      id: "two.one",
      title: "Companionship",
      description: `AstraPuffs feature Agenti NPCs who journey with you, tell stories, help solve puzzles, spark quests, and engage in heartfelt conversations—making every interaction feel like an adventure with a trusted friend`,
      image: "/features/companion.png",
    },
    {
      id: "two.two",
      title: "Safety",
      description: `To foster kindness, players who use toxic language are gently “bubbled,” causing their speech to appear as playful gibberish. They can still play, but group chat stays safe and respectful`,
      image: "/features/safety.png",
    },
    {
      id: "two.three",
      title: "Delight",
      description: `AstraPuffs bring joy through playful mechanics like bubble-making and effortless flying. Whether you’re gliding across shimmering skies or popping bubbles with friends, moments of wonder are always just a tap away`,
      image: "/features/delight.png",
    },
    {
      id: "two.four",
      title: "Fun",
      description: `From whimsical rain dances to grass-growing minigames, AstraPuffs offers endless fun. Shake trees for surprises, recycle with purpose, and craft across entire dimensions filled with color, magic, and meaning`,
      image: "/features/fun.png",
    },
  ];

  return (
    <div>
      <div className="container relative mx-auto px-4 pt-16">
        <h1 className="text-6xl text-center font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
          Key Features
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
