"use client"

import { useState, useEffect } from "react"
import { addLocalTargetingRule, removeLocalTargetingRule, getLocalTargetingRules } from "@/lib/local-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import { addTargetingRule, deleteTargetingRule } from "@/app/dashboard/targeting/actions"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams, useRouter } from "next/navigation"

interface Rule {
    id: string
    key_value: string
    operator: 'include' | 'exclude'
    type: 'contextual' | 'brand_safety'
}

export function TargetingManager({ campaignId, initialRules = [] }: { campaignId?: string, initialRules?: Rule[] }) {
    const localRules = campaignId?.startsWith('local-') ? getLocalTargetingRules(campaignId) : []
    const allRules = [...initialRules, ...localRules]
    const [contextualKeywords, setContextualKeywords] = useState<Rule[]>(
        allRules.filter(r => r.type === 'contextual')
    )
    const [brandSafetyKeys, setBrandSafetyKeys] = useState<Rule[]>(
        allRules.filter(r => r.type === 'brand_safety')
    )
    const [newContextual, setNewContextual] = useState({ keyword: '', operator: 'include' as 'include' | 'exclude' })
    const [newBrandSafety, setNewBrandSafety] = useState({ keyword: '', operator: 'include' as 'include' | 'exclude' })
    const { toast } = useToast()
    const router = useRouter()

    const handleAddContextual = async () => {
        if (!newContextual.keyword.trim()) {
            toast({ title: 'Error', description: 'Please enter a keyword', variant: 'destructive' })
            return
        }

        if (!campaignId) {
            toast({ title: 'Error', description: 'No campaign selected', variant: 'destructive' })
            return
        }

        if (campaignId.startsWith('local-')) {
            const rule = addLocalTargetingRule(campaignId, 'contextual', newContextual.keyword, newContextual.operator)
            setContextualKeywords((prev) => [rule, ...prev])
            setNewContextual({ keyword: '', operator: 'include' })
            toast({ title: 'Success', description: 'Contextual keyword added' })
        } else {
            const result = await addTargetingRule(campaignId, 'contextual', newContextual.keyword, newContextual.operator)
            if (result?.success) {
                router.refresh()
                setNewContextual({ keyword: '', operator: 'include' })
                toast({ title: 'Success', description: 'Contextual keyword added' })
            } else if (result?.error) {
                toast({ title: 'Error', description: result.error, variant: 'destructive' })
            }
        }
    }

    const handleAddBrandSafety = async () => {
        if (!newBrandSafety.keyword.trim()) {
            toast({ title: 'Error', description: 'Please enter a keyword', variant: 'destructive' })
            return
        }

        if (!campaignId) {
            toast({ title: 'Error', description: 'No campaign selected', variant: 'destructive' })
            return
        }

        if (campaignId.startsWith('local-')) {
            const rule = addLocalTargetingRule(campaignId, 'brand_safety', newBrandSafety.keyword, newBrandSafety.operator)
            setBrandSafetyKeys((prev) => [rule, ...prev])
            setNewBrandSafety({ keyword: '', operator: 'exclude' })
            toast({ title: 'Success', description: 'Brand safety rule added' })
        } else {
            const result = await addTargetingRule(campaignId, 'brand_safety', newBrandSafety.keyword, newBrandSafety.operator)
            if (result?.success) {
                router.refresh()
                setNewBrandSafety({ keyword: '', operator: 'exclude' })
                toast({ title: 'Success', description: 'Brand safety rule added' })
            } else if (result?.error) {
                toast({ title: 'Error', description: result.error, variant: 'destructive' })
            }
        }
    }

    const handleDelete = async (id: string) => {
        if (id.startsWith('local-')) {
            removeLocalTargetingRule(id)
            setContextualKeywords((prev) => prev.filter((r) => r.id !== id))
            setBrandSafetyKeys((prev) => prev.filter((r) => r.id !== id))
            toast({ title: 'Deleted', description: 'Rule removed' })
        } else {
            await deleteTargetingRule(id)
            router.refresh()
            toast({ title: 'Deleted', description: 'Rule removed' })
        }
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Contextual Targeting Keywords</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            value={newContextual.keyword}
                            onChange={(e) => setNewContextual({ ...newContextual, keyword: e.target.value })}
                            placeholder="Enter keyword"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddContextual()}
                        />
                        <Select
                            value={newContextual.operator}
                            onValueChange={(value: 'include' | 'exclude') =>
                                setNewContextual({ ...newContextual, operator: value })
                            }
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="include">Include</SelectItem>
                                <SelectItem value="exclude">Exclude</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={handleAddContextual}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {contextualKeywords.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No contextual keywords added yet.</p>
                        ) : (
                            contextualKeywords.map((rule) => (
                                <div key={rule.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">{rule.key_value}</span>
                                        <Badge variant={rule.operator === 'include' ? 'default' : 'secondary'}>
                                            {rule.operator}
                                        </Badge>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(rule.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Brand Safety Rules</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            value={newBrandSafety.keyword}
                            onChange={(e) => setNewBrandSafety({ ...newBrandSafety, keyword: e.target.value })}
                            placeholder="Enter unsafe keyword to exclude"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddBrandSafety()}
                        />
                        <Select
                            value={newBrandSafety.operator}
                            onValueChange={(value: 'include' | 'exclude') =>
                                setNewBrandSafety({ ...newBrandSafety, operator: value })
                            }
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="include">Include</SelectItem>
                                <SelectItem value="exclude">Exclude</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={handleAddBrandSafety}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {brandSafetyKeys.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No brand safety rules added yet.</p>
                        ) : (
                            brandSafetyKeys.map((rule) => (
                                <div key={rule.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">{rule.key_value}</span>
                                        <Badge variant={rule.operator === 'exclude' ? 'destructive' : 'default'}>
                                            {rule.operator}
                                        </Badge>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(rule.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
