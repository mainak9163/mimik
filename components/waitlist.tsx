"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, CheckCircle2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { appendEmailToSheet } from "@/lib/append-email"
import { cn } from "@/lib/utils"

const WaitlistComponent = () => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [wantToTest, setWantToTest] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  // const [isDarkMode, setIsDarkMode] = useState(false)

  // Email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  const validateEmail = (email: string) => {
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error("Please enter your email address")
      return
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address", {
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      })
      return
    }

    setIsLoading(true)

    try {
      await appendEmailToSheet(email)
      toast.success("You've been added to our waitlist!", {
        description: "We'll be in touch soon with updates.",
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      })
      setEmail("")
      setWantToTest(false)
      setAcceptedTerms(false)
    } catch (error: unknown) {
        console.error("Error appending email:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // const toggleDarkMode = () => {
  //   setIsDarkMode(!isDarkMode)
  //   document.documentElement.classList.toggle("dark")
  // }

  const isSubmitDisabled = !email || !wantToTest || !acceptedTerms || isLoading

  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center p-4 py-16 transition-colors"
      )}
    >


        <Card className="overflow-hidden border-2 shadow-lg dark:border-gray-800">
          {/* <div className="absolute right-0 top-0 h-20 w-20 translate-x-6 -translate-y-6 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute left-0 bottom-0 h-20 w-20 -translate-x-6 translate-y-6 bg-primary/20 rounded-full blur-3xl"></div> */}

          <CardHeader className="space-y-1 text-center pb-2">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">Join the Waitlist</CardTitle>
            <CardDescription className="text-base">
              Be the first to know when we launch and get early access
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn(
                      "pr-10 transition-all",
                      email && !validateEmail(email) && "border-red-500 focus-visible:ring-red-500",
                    )}
                  />
                  {email && !validateEmail(email) && (
                    <AlertCircle className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-red-500" />
                  )}
                </div>
                {email && !validateEmail(email) && (
                  <p className="text-xs text-red-500 mt-1">Please enter a valid email address</p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="test-demo"
                    checked={wantToTest}
                    onCheckedChange={(checked) => setWantToTest(checked === true)}
                    className="mt-1"
                  />
                  <div className="space-y-1">
                    <Label htmlFor="test-demo" className="font-medium">
                      I want to test the demo!
                    </Label>
                    <p className="text-xs text-muted-foreground">Get early access to our beta testing program</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                    className="mt-1"
                  />
                  <div className="space-y-1">
                    <Label htmlFor="terms" className="font-medium">
                      I agree to the terms
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      By signing up, you agree to our{" "}
                      <a href="#" className="text-primary underline hover:text-primary/80">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-primary underline hover:text-primary/80">
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>

          <CardFooter className="bg-muted/50 px-6 py-4 dark:bg-gray-900/50">
            <Button onClick={handleSubmit} className="w-full transition-all" disabled={isSubmitDisabled} size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining waitlist...
                </>
              ) : (
                "Join Waitlist"
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            Already have an account?{" "}
            <a href="#" className="font-medium text-primary hover:underline">
              Sign in
            </a>
          </p>
        </div> */}

    </div>
  )
}

export default WaitlistComponent

