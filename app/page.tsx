import AvatarShowcase from '@/components/avatar-showcase'
// import ContactForm from '@/components/contact-form'
import AvatarFaceTracking from '@/components/face-recognition'
import Footer from '@/components/footer'
// import AstrapuffFeatures from '@/components/features'
import SecondHero from '@/components/second-hero'
import SlidingComponent from '@/components/sliding-component'
import ThreeJSAnimationWithNoSSR from '@/components/threejs-animation'
import { Separator } from '@/components/ui/separator'
import WaitlistComponent from '@/components/waitlist'
import React from 'react'

const App = () => {
  return (
    <div className="flex flex-col">
      <ThreeJSAnimationWithNoSSR/>
      <section id="one">
        <SlidingComponent />
      </section>
      <Separator className="bg-border" />
      <section id="two">
        <SecondHero />
      </section>
      <section id="three">
        <AvatarShowcase />
        </section>
      <Separator className="bg-border"/>
      {/* <AstrapuffFeatures />
      <Separator className="bg-border"/> */}
      <section id="four">
        <AvatarFaceTracking />
        </section>
      <Separator className="bg-border" />
      <section id="five">
        <WaitlistComponent />
        </section>
      <Separator className="bg-border"/>
      {/* <ContactForm/> */}
      <Footer/>
    </div>
  )
}

export default App