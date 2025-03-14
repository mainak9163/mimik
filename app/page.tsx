import ContactForm from '@/components/contact-form'
import AstrapuffFeatures from '@/components/features'
import SecondHero from '@/components/second-hero'
import SlidingComponent from '@/components/sliding-component'
import { Separator } from '@/components/ui/separator'
import WaitlistComponent from '@/components/waitlist'
import React from 'react'

const App = () => {
  return (
      <div className="flex flex-col">
      <SlidingComponent />
      <SecondHero />
      <Separator className="bg-border"/>
      <AstrapuffFeatures />
      <Separator className="bg-border"/>
      <WaitlistComponent />
      <Separator className="bg-border"/>
      <ContactForm/>
    </div>
  )
}

export default App