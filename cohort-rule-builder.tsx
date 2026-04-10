"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Plus, Trash2, Save } from "lucide-react"
import type { CohortDefinition, CohortRule, CohortGroup } from "@/lib/supabase/types"
import { saveCohort } from "@/app/dashboard/cohorts/actions"
import { addLocalCohort } from "@/lib/local-store"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const OPERATORS = [
    { value: 'is', label: 'Is' },
    { value: 'contains', label: 'Contains' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
] as const

const STANDARD_FIELDS = [
    'Age',
    'Gender',
    'City',
    'Country',
    'Income',
    'Device',
    'Browser',
    'Purchase_History',
    'Engagement_Score',
]

export function CohortRuleBuilder() {
    const [cohortName, setCohortName] = useState('')
    const [cohortDescription, setCohortDescription] = useState('')
    const [customFields, setCustomFields] = useState<string[]>([])
    const [newCustomField, setNewCustomField] = useState('')
    const [definition, setDefinition] = useState<CohortDefinition>({
        logic: 'AND',
        rules: [],
    })
    const { toast } = useToast()
    const router = useRouter()

    const allFields = [...STANDARD_FIELDS, ...customFields]

    const addRule = (parentPath: number[] = []) => {
        const newRule: CohortRule = {
            field: allFields[0] || '',
            operator: 'is',
            value: '',
        }

        if (parentPath.length === 0) {
            setDefinition({
                ...definition,
                rules: [...definition.rules, newRule],
            })
        } else {
            const updatedDef = { ...definition }
            let current: any = updatedDef

            for (let i = 0; i < parentPath.length - 1; i++) {
                current = current.rules[parentPath[i]]
            }

            const groupIdx = parentPath[parentPath.length - 1]
            if (current.rules && current.rules[groupIdx]) {
                current.rules[groupIdx].rules.push(newRule)
            }

            setDefinition(updatedDef)
        }
    }

    const addGroup = (parentPath: number[] = []) => {
        const newGroup: CohortGroup = {
            logic: 'AND',
            rules: [],
        }

        if (parentPath.length === 0) {
            setDefinition({
                ...definition,
                rules: [...definition.rules, newGroup],
            })
        }
    }

    const removeRule = (path: number[]) => {
        const updatedDef = { ...definition }

        if (path.length === 1) {
            updatedDef.rules.splice(path[0], 1)
        } else {
            let current: any = updatedDef
            for (let i = 0; i < path.length - 1; i++) {
                current = current.rules[path[i]]
            }
            current.rules.splice(path[path.length - 1], 1)
        }

        setDefinition(updatedDef)
    }

    const updateRule = (path: number[], updates: Partial<CohortRule>) => {
        const updatedDef = { ...definition }
        let current: any = updatedDef

        for (let i = 0; i < path.length - 1; i++) {
            current = current.rules[path[i]]
        }

        const ruleIdx = path[path.length - 1]
        current.rules[ruleIdx] = { ...current.rules[ruleIdx], ...updates }

        setDefinition(updatedDef)
    }

    const addCustomField = () => {
        if (newCustomField && !allFields.includes(newCustomField)) {
            setCustomFields([...customFields, newCustomField])
            setNewCustomField('')
            toast({
                title: 'Custom field added',
                description: `"${newCustomField}" is now available for cohort rules`,
            })
        }
    }

    const handleSave = async () => {
        if (!cohortName) {
            toast({
                title: 'Error',
                description: 'Please enter a cohort name',
                variant: 'destructive',
            })
            return
        }

        if (definition.rules.length === 0) {
            toast({
                title: 'Error',
                description: 'Please add at least one rule',
                variant: 'destructive',
            })
            return
        }

        const result = await saveCohort(cohortName, cohortDescription, definition)

        if (result?.success) {
            toast({
                title: 'Cohort saved',
                description: 'Your cohort has been saved successfully',
            })
            router.refresh()
            setCohortName('')
            setCohortDescription('')
            setDefinition({ logic: 'AND', rules: [] })
        } else {
            addLocalCohort(cohortName, cohortDescription, definition)
            toast({
                title: 'Cohort saved locally',
                description: 'Saved to browser storage (Supabase unavailable)',
            })
            window.dispatchEvent(new CustomEvent('cohorts-updated'))
            router.refresh()
            setCohortName('')
            setCohortDescription('')
            setDefinition({ logic: 'AND', rules: [] })
        }
    }

    const renderRule = (rule: CohortRule | CohortGroup, path: number[]) => {
        if ('field' in rule) {
            // It's a rule
            return (
                <div key={path.join('-')} className="flex gap-2 items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <Select
                        value={rule.field}
                        onValueChange={(value) => updateRule(path, { field: value })}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Standard Fields</div>
                            {STANDARD_FIELDS.map((field) => (
                                <SelectItem key={field} value={field}>
                                    {field}
                                </SelectItem>
                            ))}
                            {customFields.length > 0 && (
                                <>
                                    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Custom Fields</div>
                                    {customFields.map((field) => (
                                        <SelectItem key={field} value={field}>
                                            {field}
                                        </SelectItem>
                                    ))}
                                </>
                            )}
                        </SelectContent>
                    </Select>

                    <Select
                        value={rule.operator}
                        onValueChange={(value: any) => updateRule(path, { operator: value })}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {OPERATORS.map((op) => (
                                <SelectItem key={op.value} value={op.value}>
                                    {op.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Input
                        value={rule.value}
                        onChange={(e) => updateRule(path, { value: e.target.value })}
                        placeholder="Value"
                        className="flex-1"
                    />

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRule(path)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )
        } else {
            // It's a group
            return (
                <Card key={path.join('-')} className="ml-6 mt-2">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <Select
                                value={rule.logic}
                                onValueChange={(value: 'AND' | 'OR') => {
                                    const updatedDef = { ...definition }
                                    let current: any = updatedDef
                                    for (let i = 0; i < path.length - 1; i++) {
                                        current = current.rules[path[i]]
                                    }
                                    current.rules[path[path.length - 1]].logic = value
                                    setDefinition(updatedDef)
                                }}
                            >
                                <SelectTrigger className="w-[100px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="AND">AND</SelectItem>
                                    <SelectItem value="OR">OR</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addRule(path)}
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Rule
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {rule.rules.map((subRule, idx) => renderRule(subRule, [...path, idx]))}
                    </CardContent>
                </Card>
            )
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Cohort Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Cohort Name</label>
                        <Input
                            value={cohortName}
                            onChange={(e) => setCohortName(e.target.value)}
                            placeholder="e.g., High Value Customers"
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Description</label>
                        <Input
                            value={cohortDescription}
                            onChange={(e) => setCohortDescription(e.target.value)}
                            placeholder="Optional description"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Custom Columns</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Input
                            value={newCustomField}
                            onChange={(e) => setNewCustomField(e.target.value)}
                            placeholder="Add custom field name"
                            onKeyDown={(e) => e.key === 'Enter' && addCustomField()}
                        />
                        <Button onClick={addCustomField}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                        </Button>
                    </div>
                    {customFields.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {customFields.map((field) => (
                                <div key={field} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-md text-sm">
                                    {field}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Cohort Rules</CardTitle>
                        <div className="flex gap-2">
                            <Select
                                value={definition.logic}
                                onValueChange={(value: 'AND' | 'OR') =>
                                    setDefinition({ ...definition, logic: value })
                                }
                            >
                                <SelectTrigger className="w-[100px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="AND">AND</SelectItem>
                                    <SelectItem value="OR">OR</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" onClick={() => addRule()}>
                                <Plus className="h-4 w-4 mr-1" />
                                Add Rule
                            </Button>
                            <Button variant="outline" onClick={() => addGroup()}>
                                <Plus className="h-4 w-4 mr-1" />
                                Add Group
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-2">
                    {definition.rules.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No rules added yet. Click "Add Rule" to start building your cohort.</p>
                    ) : (
                        definition.rules.map((rule, idx) => renderRule(rule, [idx]))
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSave} size="lg">
                    <Save className="h-4 w-4 mr-2" />
                    Save Cohort
                </Button>
            </div>
        </div>
    )
}
