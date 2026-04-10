"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createCampaign } from "@/app/dashboard/campaigns/actions"
import { useCampaigns } from "@/components/campaigns-provider"
import { Plus } from "lucide-react"

export function CampaignCreateDialog() {
    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState("draft")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { addCampaign } = useCampaigns()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)
        setLoading(true)
        const form = e.currentTarget
        const formData = new FormData(form)
        formData.set("status", status || "draft")

        const result = await createCampaign(formData)

        if (result?.error) {
            try {
                addCampaign({
                    user_id: "",
                    name: (formData.get("name") as string) || "Untitled",
                    status: (status as "draft" | "active" | "paused" | "completed") || "draft",
                    budget: formData.get("budget") ? parseFloat(formData.get("budget") as string) : null,
                    start_date: (formData.get("start_date") as string) || null,
                    end_date: (formData.get("end_date") as string) || null,
                })
                setOpen(false)
                setError(null)
                form.reset()
                setStatus("draft")
                router.refresh()
            } catch {
                setError(result.error)
            }
        } else {
            setOpen(false)
            setError(null)
            form.reset()
            setStatus("draft")
            router.refresh()
        }
        setLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Campaign
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create Campaign</DialogTitle>
                        <DialogDescription>
                            Set up a new marketing campaign with your targeting parameters.
                        </DialogDescription>
                    </DialogHeader>
                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Campaign Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Enter campaign name"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="paused">Paused</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="budget">Budget</Label>
                            <Input
                                id="budget"
                                name="budget"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="start_date">Start Date</Label>
                                <Input
                                    id="start_date"
                                    name="start_date"
                                    type="date"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="end_date">End Date</Label>
                                <Input
                                    id="end_date"
                                    name="end_date"
                                    type="date"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Campaign"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
