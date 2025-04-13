import AvatarShowcase from "@/components/avatar-showcase";
// import ContactForm from '@/components/contact-form'
import AvatarFaceTracking from "@/components/face-recognition";
// import Footer from "@/components/footer";
// import AstrapuffFeatures from '@/components/features'
import SecondHero from "@/components/second-hero";
import SlidingComponent from "@/components/sliding-component";
import ThreeJSAnimationWithNoSSR from "@/components/threejs-animation";
import { Separator } from "@/components/ui/separator";
import WaitlistComponent from "@/components/waitlist";
import React from "react";
import Features from "@/components/features";

const App = () => {
  return (
    <div className="flex flex-col">
      <ThreeJSAnimationWithNoSSR />
      <header>
        <section id="one">
          <SlidingComponent />
        </section>
      </header>
      <main>
        <Separator className="bg-border" />
        <SecondHero />
        <Separator className="bg-border" />
        <Features />
        <Separator className="bg-border" />
        <section id="three">
          <AvatarShowcase />
        </section>
        <Separator className="bg-border" />
        {/* <AstrapuffFeatures />
      <Separator className="bg-border"/> */}
        <section id="four">
          <AvatarFaceTracking />
        </section>
        <Separator className="bg-border" />
        <section id="five" className="bg-[#faa0ab]/30">
          <WaitlistComponent />
        </section>
        <Separator className="bg-border" />
        {/* <ContactForm/> */}
      </main>
    </div>
  );
};

export default App;
