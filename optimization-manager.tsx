"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Plus, Trash2, Play, Pause } from "lucide-react"
import { createExperiment, deleteExperiment } from "@/app/dashboard/optimization/actions"
import { addLocalExperiment, removeLocalExperiment, getLocalExperiments } from "@/lib/local-store"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import type { Experiment } from "@/lib/supabase/types"

interface OptimizationProps {
    campaignId?: string
    experiments: Experiment[]
}

export function OptimizationManager({ campaignId, experiments }: OptimizationProps) {
    const localExps = campaignId?.startsWith('local-') ? getLocalExperiments(campaignId) : []
    const allExperiments = [...experiments, ...localExps]
    const [abTestName, setAbTestName] = useState('')
    const [variantA, setVariantA] = useState({ name: 'Variant A', weight: 50 })
    const [variantB, setVariantB] = useState({ name: 'Variant B', weight: 50 })

    const [mabName, setMabName] = useState('')
    const [mabArms, setMabArms] = useState<Array<{ name: string; weight: number }>>([
        { name: 'Arm 1', weight: 33 },
        { name: 'Arm 2', weight: 33 },
        { name: 'Arm 3', weight: 34 },
    ])

    const { toast } = useToast()
    const router = useRouter()

    const handleCreateABTest = async () => {
        if (!abTestName || !campaignId) {
            toast({ title: 'Error', description: 'Please enter a test name', variant: 'destructive' })
            return
        }

        const config = {
            variants: [variantA, variantB],
        }

        if (campaignId.startsWith('local-')) {
            addLocalExperiment(campaignId, abTestName, 'ab_test', config)
            toast({ title: 'Success', description: 'A/B test created' })
            setAbTestName('')
            window.dispatchEvent(new CustomEvent('experiments-updated'))
            router.refresh()
        } else {
            const result = await createExperiment(campaignId, abTestName, 'ab_test', config)
            if (result?.success) {
                toast({ title: 'Success', description: 'A/B test created' })
                setAbTestName('')
                router.refresh()
            } else if (result?.error) {
                toast({ title: 'Error', description: result.error, variant: 'destructive' })
            }
        }
    }

    const handleCreateMAB = async () => {
        if (!mabName || !campaignId) {
            toast({ title: 'Error', description: 'Please enter a test name', variant: 'destructive' })
            return
        }

        const config = {
            arms: mabArms,
            algorithm: 'epsilon-greedy',
            epsilon: 0.1,
        }

        if (campaignId.startsWith('local-')) {
            addLocalExperiment(campaignId, mabName, 'multi_arm_bandit', config)
            toast({ title: 'Success', description: 'Multi-armed bandit test created' })
            setMabName('')
            window.dispatchEvent(new CustomEvent('experiments-updated'))
            router.refresh()
        } else {
            const result = await createExperiment(campaignId, mabName, 'multi_arm_bandit', config)
            if (result?.success) {
                toast({ title: 'Success', description: 'Multi-armed bandit test created' })
                setMabName('')
                router.refresh()
            } else if (result?.error) {
                toast({ title: 'Error', description: result.error, variant: 'destructive' })
            }
        }
    }

    const handleDelete = async (id: string) => {
        if (id.startsWith('local-')) {
            removeLocalExperiment(id)
            window.dispatchEvent(new CustomEvent('experiments-updated'))
            toast({ title: 'Deleted', description: 'Experiment removed' })
            router.refresh()
        } else {
            await deleteExperiment(id)
            toast({ title: 'Deleted', description: 'Experiment removed' })
            router.refresh()
        }
    }

    const addMabArm = () => {
        setMabArms([...mabArms, { name: `Arm ${mabArms.length + 1}`, weight: 0 }])
    }

    const removeMabArm = (index: number) => {
        setMabArms(mabArms.filter((_, i) => i !== index))
    }

    return (
        <div className="space-y-6">
            <Tabs defaultValue="ab" className="w-full">
                <TabsList>
                    <TabsTrigger value="ab">A/B Testing</TabsTrigger>
                    <TabsTrigger value="mab">Multi-Armed Bandit</TabsTrigger>
                    <TabsTrigger value="active">Active Tests ({allExperiments.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="ab" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create A/B Test</CardTitle>
                            <CardDescription>Split traffic between two variants to determine which performs better</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Test Name</Label>
                                <Input
                                    value={abTestName}
                                    onChange={(e) => setAbTestName(e.target.value)}
                                    placeholder="e.g., Homepage Hero Test"
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <Card>
                                    <CardContent className="pt-6 space-y-3">
                                        <Input
                                            value={variantA.name}
                                            onChange={(e) => setVariantA({ ...variantA, name: e.target.value })}
                                            placeholder="Variant A name"
                                        />
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Traffic Split</span>
                                                <span className="font-medium">{variantA.weight}%</span>
                                            </div>
                                            <Slider
                                                value={[variantA.weight]}
                                                onValueChange={([value]) => {
                                                    setVariantA({ ...variantA, weight: value })
                                                    setVariantB({ ...variantB, weight: 100 - value })
                                                }}
                                                max={100}
                                                step={1}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="pt-6 space-y-3">
                                        <Input
                                            value={variantB.name}
                                            onChange={(e) => setVariantB({ ...variantB, name: e.target.value })}
                                            placeholder="Variant B name"
                                        />
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Traffic Split</span>
                                                <span className="font-medium">{variantB.weight}%</span>
                                            </div>
                                            <Slider
                                                value={[variantB.weight]}
                                                onValueChange={([value]) => {
                                                    setVariantB({ ...variantB, weight: value })
                                                    setVariantA({ ...variantA, weight: 100 - value })
                                                }}
                                                max={100}
                                                step={1}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Button onClick={handleCreateABTest} className="w-full">
                                Create A/B Test
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="mab" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create Multi-Armed Bandit</CardTitle>
                            <CardDescription>AI-powered optimization that automatically allocates traffic to best-performing variants</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Test Name</Label>
                                <Input
                                    value={mabName}
                                    onChange={(e) => setMabName(e.target.value)}
                                    placeholder="e.g., CTA Button Optimization"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label>Arms (Variants)</Label>
                                    <Button variant="outline" size="sm" onClick={addMabArm}>
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add Arm
                                    </Button>
                                </div>

                                {mabArms.map((arm, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={arm.name}
                                            onChange={(e) => {
                                                const updated = [...mabArms]
                                                updated[index].name = e.target.value
                                                setMabArms(updated)
                                            }}
                                            placeholder={`Arm ${index + 1} name`}
                                        />
                                        <Input
                                            type="number"
                                            value={arm.weight}
                                            onChange={(e) => {
                                                const updated = [...mabArms]
                                                updated[index].weight = Number(e.target.value)
                                                setMabArms(updated)
                                            }}
                                            placeholder="Initial weight"
                                            className="w-32"
                                        />
                                        {mabArms.length > 2 && (
                                            <Button variant="ghost" size="sm" onClick={() => removeMabArm(index)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md">
                                <p className="text-sm text-blue-900 dark:text-blue-100">
                                    <strong>Note:</strong> The algorithm will dynamically adjust traffic allocation based on performance metrics. Initial weights will be overridden as the test learns.
                                </p>
                            </div>

                            <Button onClick={handleCreateMAB} className="w-full">
                                Create Multi-Armed Bandit
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="active" className="mt-6">
                    <div className="space-y-4">
                        {allExperiments.length === 0 ? (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <p className="text-muted-foreground">No experiments created yet. Create an A/B test or Multi-Armed Bandit to get started.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            allExperiments.map((exp) => (
                                <Card key={exp.id}>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold">{exp.name}</h3>
                                                    <Badge variant={exp.status === 'draft' ? 'secondary' : 'default'}>
                                                        {exp.status}
                                                    </Badge>
                                                    <Badge variant="outline">
                                                        {exp.type === 'ab_test' ? 'A/B Test' : 'Multi-Armed Bandit'}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Created {new Date(exp.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm">
                                                    <Play className="h-4 w-4" />
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => handleDelete(exp.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
