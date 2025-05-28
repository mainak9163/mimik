import { Card } from "@/components/ui/card"
import { GlobeIcon, Users, Sparkles, Briefcase, Heart, Code, Palette } from "lucide-react"

export default function JobListingContent() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="space-y-12">
        <section>
          <h2 className="font-montserrat text-3xl font-bold text-gray-900 mb-6">About P3CO</h2>
          <div className="font-merriweather text-lg text-gray-700 space-y-4">
            <p>
              We&apos;re P3CO, an indie studio crafting <span className="font-semibold text-black">Astrapuffs</span> — a
              whimsical, AI-powered cozy sim where emotionally intelligent NPCs form real relationships with players.
              This isn&apos;t just another cute game — it&apos;s a shot at reimagining what NPCs can be.
            </p>
            <p>
              We&apos;re at the pre-seed stage and actively raising funds. In the meantime, we&apos;re opening the door for
              skilled professionals — artists, engineers, designers — who believe in the potential of agentic AI, cozy
              storytelling, and psychological safety in games.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-montserrat text-3xl font-bold text-gray-900 mb-6">The Opportunity</h2>
          <div className="font-merriweather text-lg text-gray-700 space-y-4">
            <p>
              <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full mr-2">
                <span className="text-black font-bold">•</span>
              </span>
              This is an unpaid, short-term opportunity with a path toward becoming part of our core team and earning
              stock options. You&apos;ll be building something ambitious with a clear, meaningful role and trajectory.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-montserrat text-3xl font-bold text-gray-900 mb-6">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-l-4 border-black shadow-md">
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <Sparkles className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 className="font-montserrat text-lg font-semibold text-gray-900 mb-2">Pre-alpha Demo</h3>
                  <p className="font-merriweather text-gray-700">A working demo with functional agentic NPCs</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-black shadow-md">
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <GlobeIcon className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 className="font-montserrat text-lg font-semibold text-gray-900 mb-2">Clear Vision</h3>
                  <p className="font-merriweather text-gray-700">A defined product vision and global market fit</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-black shadow-md">
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <Users className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 className="font-montserrat text-lg font-semibold text-gray-900 mb-2">Strong Team</h3>
                  <p className="font-merriweather text-gray-700">
                    An international team with deep AI and creative roots
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-black shadow-md">
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <Briefcase className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 className="font-montserrat text-lg font-semibold text-gray-900 mb-2">Industry Impact</h3>
                  <p className="font-merriweather text-gray-700">
                    Help ship one of the first stable and fun agentic games
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="font-montserrat text-3xl font-bold text-gray-900 mb-6">What We&apos;re Looking For</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <Code className="h-6 w-6 text-black" />
              </div>
              <div>
                <p className="font-merriweather text-lg text-gray-700">
                  Professionals with strong skills and initiative
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <Heart className="h-6 w-6 text-black" />
              </div>
              <div>
                <p className="font-merriweather text-lg text-gray-700">
                  People excited by AI-driven, emotionally intelligent NPCs
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <Palette className="h-6 w-6 text-black" />
              </div>
              <div>
                <p className="font-merriweather text-lg text-gray-700">
                  Those who want to contribute meaningfully and grow with us
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 p-8 rounded-lg border border-gray-200">
          <h2 className="font-montserrat text-2xl font-bold text-gray-900 mb-4">Ready to Join Us?</h2>
          <p className="font-merriweather text-lg text-gray-700">
            If you&apos;re between gigs, want to keep your skills sharp, or are ready to help shape a game that could truly
            shake the industry — let&apos;s talk.
          </p>
        </section>
      </div>
    </div>
  )
}
