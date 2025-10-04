"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useResources } from "@/lib/hooks/use-resources"
import { LinkIcon } from "lucide-react"

export function UrlUpload() {
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const { addUrl } = useResources()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setLoading(true)
    try {
      await addUrl(url, title || undefined)
      setUrl("")
      setTitle("")
    } catch (error) {
      console.error("Error adding URL:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add URL</CardTitle>
        <CardDescription>Add links to external resources, documentation, or web pages.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <div className="flex gap-2">
              <LinkIcon className="w-5 h-5 text-muted-foreground mt-2" />
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/onboarding-guide"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title (Optional)</Label>
            <Input id="title" placeholder="Onboarding Guide" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <Button type="submit" disabled={!url.trim() || loading} className="w-full">
            {loading ? "Adding..." : "Add URL"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
