"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Target, Zap } from "lucide-react"
import type { Campaign } from "@/lib/supabase/types"
import { deleteCampaign } from "@/app/dashboard/campaigns/actions"
import { useCampaigns } from "@/components/campaigns-provider"
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

interface CampaignListProps {
    campaigns: Campaign[]
}

export function CampaignList({ campaigns }: CampaignListProps) {
    const router = useRouter()
    const { removeCampaign } = useCampaigns()

    const handleDelete = async (id: string) => {
        if (id.startsWith("local-")) {
            removeCampaign(id)
        } else {
            await deleteCampaign(id)
        }
        router.refresh()
    }

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'active':
                return 'default'
            case 'paused':
                return 'secondary'
            case 'completed':
                return 'outline'
            default:
                return 'secondary'
        }
    }

    if (campaigns.length === 0) {
        return (
            <Card>
                <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">No campaigns yet. Create your first campaign to get started.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid gap-4">
            {campaigns.map((campaign) => (
                <Card key={campaign.id}>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-semibold">{campaign.name}</h3>
                                    <Badge variant={getStatusVariant(campaign.status)}>
                                        {campaign.status}
                                    </Badge>
                                </div>
                                <div className="flex gap-4 text-sm text-muted-foreground">
                                    {campaign.budget && <span>Budget: ${campaign.budget.toLocaleString()}</span>}
                                    {campaign.start_date && campaign.end_date && (
                                        <span>
                                            {new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}
                                        </span>
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                        Created {new Date(campaign.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/targeting?campaign=${campaign.id}`)}>
                                        <Target className="h-4 w-4 mr-2" />
                                        Targeting
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/optimization?campaign=${campaign.id}`)}>
                                        <Zap className="h-4 w-4 mr-2" />
                                        Optimization
                                    </Button>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4" />
                                </Button>
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
                                                This will permanently delete the campaign "{campaign.name}" and all associated data.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(campaign.id)}>
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
