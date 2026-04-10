"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, X, Shield, Target } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Keyword {
  id: string
  text: string
  type: "include" | "exclude"
}

export function ContextualTargeting() {
  const [brandSafetyKeywords, setBrandSafetyKeywords] = useState<Keyword[]>([
    { id: "1", text: "violence", type: "exclude" },
    { id: "2", text: "adult content", type: "exclude" },
    { id: "3", text: "gambling", type: "exclude" },
  ])

  const [contextualKeywords, setContextualKeywords] = useState<Keyword[]>([
    { id: "1", text: "technology", type: "include" },
    { id: "2", text: "innovation", type: "include" },
    { id: "3", text: "startup", type: "include" },
  ])

  const [newKeyword, setNewKeyword] = useState("")
  const [bulkKeywords, setBulkKeywords] = useState("")
  const { toast } = useToast()

  const addKeyword = (keywords: Keyword[], setKeywords: (keywords: Keyword[]) => void, type: "include" | "exclude") => {
    if (!newKeyword.trim()) return

    const keyword: Keyword = {
      id: Date.now().toString(),
      text: newKeyword.trim(),
      type,
    }

    setKeywords([...keywords, keyword])
    setNewKeyword("")
    toast({
      title: "Keyword Added",
      description: `"${keyword.text}" has been added to ${type} list`,
    })
  }

  const removeKeyword = (keywords: Keyword[], setKeywords: (keywords: Keyword[]) => void, id: string) => {
    setKeywords(keywords.filter((keyword) => keyword.id !== id))
  }

  const addBulkKeywords = (
    keywords: Keyword[],
    setKeywords: (keywords: Keyword[]) => void,
    type: "include" | "exclude",
  ) => {
    if (!bulkKeywords.trim()) return

    const newKeywords = bulkKeywords
      .split("\n")
      .map((text) => text.trim())
      .filter((text) => text.length > 0)
      .map((text) => ({
        id: Date.now().toString() + Math.random(),
        text,
        type,
      }))

    setKeywords([...keywords, ...newKeywords])
    setBulkKeywords("")
    toast({
      title: "Bulk Keywords Added",
      description: `${newKeywords.length} keywords have been added`,
    })
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="brand-safety" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="brand-safety">
            <Shield className="h-4 w-4 mr-2" />
            Brand Safety
          </TabsTrigger>
          <TabsTrigger value="contextual">
            <Target className="h-4 w-4 mr-2" />
            Contextual Targeting
          </TabsTrigger>
        </TabsList>

        <TabsContent value="brand-safety" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Safety Keywords</CardTitle>
              <CardDescription>Manage keywords to ensure your ads appear in brand-safe environments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-600">Exclude Keywords</h3>
                  <div className="flex gap-2">
                    <Input
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="Enter keyword to exclude"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addKeyword(brandSafetyKeywords, setBrandSafetyKeywords, "exclude")
                        }
                      }}
                    />
                    <Button onClick={() => addKeyword(brandSafetyKeywords, setBrandSafetyKeywords, "exclude")}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {brandSafetyKeywords
                      .filter((keyword) => keyword.type === "exclude")
                      .map((keyword) => (
                        <Badge key={keyword.id} variant="destructive" className="flex items-center gap-1">
                          {keyword.text}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeKeyword(brandSafetyKeywords, setBrandSafetyKeywords, keyword.id)}
                          />
                        </Badge>
                      ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-600">Include Keywords</h3>
                  <div className="flex gap-2">
                    <Input
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="Enter safe keyword"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addKeyword(brandSafetyKeywords, setBrandSafetyKeywords, "include")
                        }
                      }}
                    />
                    <Button onClick={() => addKeyword(brandSafetyKeywords, setBrandSafetyKeywords, "include")}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {brandSafetyKeywords
                      .filter((keyword) => keyword.type === "include")
                      .map((keyword) => (
                        <Badge key={keyword.id} variant="default" className="flex items-center gap-1">
                          {keyword.text}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeKeyword(brandSafetyKeywords, setBrandSafetyKeywords, keyword.id)}
                          />
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Bulk Import</h3>
                <Textarea
                  value={bulkKeywords}
                  onChange={(e) => setBulkKeywords(e.target.value)}
                  placeholder="Enter keywords (one per line)"
                  rows={5}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => addBulkKeywords(brandSafetyKeywords, setBrandSafetyKeywords, "exclude")}
                    variant="destructive"
                  >
                    Add as Exclude
                  </Button>
                  <Button onClick={() => addBulkKeywords(brandSafetyKeywords, setBrandSafetyKeywords, "include")}>
                    Add as Include
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contextual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contextual Targeting Keywords</CardTitle>
              <CardDescription>Define keywords for contextual ad placement and targeting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-600">Target Keywords</h3>
                  <div className="flex gap-2">
                    <Input
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="Enter targeting keyword"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addKeyword(contextualKeywords, setContextualKeywords, "include")
                        }
                      }}
                    />
                    <Button onClick={() => addKeyword(contextualKeywords, setContextualKeywords, "include")}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {contextualKeywords
                      .filter((keyword) => keyword.type === "include")
                      .map((keyword) => (
                        <Badge key={keyword.id} variant="default" className="flex items-center gap-1">
                          {keyword.text}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeKeyword(contextualKeywords, setContextualKeywords, keyword.id)}
                          />
                        </Badge>
                      ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-600">Negative Keywords</h3>
                  <div className="flex gap-2">
                    <Input
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="Enter negative keyword"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addKeyword(contextualKeywords, setContextualKeywords, "exclude")
                        }
                      }}
                    />
                    <Button onClick={() => addKeyword(contextualKeywords, setContextualKeywords, "exclude")}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {contextualKeywords
                      .filter((keyword) => keyword.type === "exclude")
                      .map((keyword) => (
                        <Badge key={keyword.id} variant="destructive" className="flex items-center gap-1">
                          {keyword.text}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeKeyword(contextualKeywords, setContextualKeywords, keyword.id)}
                          />
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Keyword Matching Options</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold">Exact Match</h4>
                      <p className="text-sm text-muted-foreground">
                        Ads show only when search exactly matches your keyword
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold">Contains</h4>
                      <p className="text-sm text-muted-foreground">Ads show when search contains your keyword</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold">Broad Match</h4>
                      <p className="text-sm text-muted-foreground">Ads show for related searches and synonyms</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
