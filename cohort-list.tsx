"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, Eye } from "lucide-react"
import type { Cohort, CohortRule, CohortGroup } from "@/lib/supabase/types"
import { deleteCohort } from "@/app/dashboard/cohorts/actions"
import { removeLocalCohort } from "@/lib/local-store"
import { useRouter } from "next/navigation"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface CohortListProps {
    cohorts: Cohort[]
    onLocalDelete?: () => void
}

export function CohortList({ cohorts, onLocalDelete }: CohortListProps) {
    const router = useRouter()

    const handleDelete = async (id: string) => {
        if (id.startsWith('local-')) {
            removeLocalCohort(id)
            onLocalDelete?.()
        } else {
            await deleteCohort(id)
            router.refresh()
        }
    }

    const renderRuleSummary = (rule: CohortRule | CohortGroup, depth = 0): string => {
        if ('field' in rule) {
            return `${rule.field} ${rule.operator} "${rule.value}"`
        } else {
            const ruleStrings = rule.rules.map((r) => renderRuleSummary(r, depth + 1))
            return `(${ruleStrings.join(` ${rule.logic} `)})`
        }
    }

    if (cohorts.length === 0) {
        return (
            <Card>
                <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">No cohorts saved yet. Build your first cohort to get started.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid gap-4">
            {cohorts.map((cohort) => (
                <Card key={cohort.id}>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-semibold">{cohort.name}</h3>
                                    <Badge variant="secondary">
                                        {cohort.definition.logic}
                                    </Badge>
                                    <Badge variant="outline">
                                        {cohort.definition.rules.length} rule{cohort.definition.rules.length !== 1 ? 's' : ''}
                                    </Badge>
                                </div>
                                {cohort.description && (
                                    <p className="text-sm text-muted-foreground">{cohort.description}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Created {new Date(cohort.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle>{cohort.name}</DialogTitle>
                                            <DialogDescription>
                                                {cohort.description || 'View cohort rules'}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-2">
                                            <div className="text-sm font-medium">Logic: {cohort.definition.logic}</div>
                                            <div className="text-sm bg-gray-50 dark:bg-gray-800 p-4 rounded-md font-mono">
                                                {renderRuleSummary(cohort.definition as CohortGroup)}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-4">
                                                Full definition (JSON):
                                            </div>
                                            <pre className="text-xs bg-gray-50 dark:bg-gray-800 p-4 rounded-md overflow-auto max-h-96">
                                                {JSON.stringify(cohort.definition, null, 2)}
                                            </pre>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently delete the cohort "{cohort.name}".
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(cohort.id)}>
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
