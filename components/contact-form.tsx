"use client"

import type React from "react"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { appendContactToSheet } from "@/lib/append-contact"

export default function ContactForm() {
  const [email, setEmail] = useState("")
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !content) {
      toast.error("Please fill in all fields")
      return
    }

    setIsLoading(true)

    try {
      await appendContactToSheet(email, content)
      toast.success("Message sent successfully!")
      setEmail("")
      setContent("")
    } catch (error) {
        console.error(error)
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16  border-b-2 border-border min-h-screen flex flex-col justify-center">
      <Card className="mx-auto my-auto max-w-lg border-none bg-background/60 backdrop-blur-sm sm:min-w-[500px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold">Contact Us</CardTitle>
          <CardDescription className="text-lg">Have questions? We&apos;d love to hear from you.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Tell us about your concerns..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="min-h-[150px] bg-background"
              />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

