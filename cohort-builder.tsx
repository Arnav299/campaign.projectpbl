"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const operators = [
  { value: "equals", label: "Equals" },
  { value: "contains", label: "Contains" },
  { value: "greater_than", label: "Greater Than" },
  { value: "less_than", label: "Less Than" },
  { value: "greater_equal", label: "Greater Than or Equal" },
  { value: "less_equal", label: "Less Than or Equal" },
  { value: "not_equals", label: "Not Equals" },
  { value: "starts_with", label: "Starts With" },
  { value: "ends_with", label: "Ends With" },
]

const standardColumns = [
  { value: "age", label: "Age", type: "number" },
  { value: "gender", label: "Gender", type: "text" },
  { value: "location", label: "Location", type: "text" },
  { value: "income", label: "Income", type: "number" },
  { value: "education", label: "Education", type: "text" },
  { value: "occupation", label: "Occupation", type: "text" },
  { value: "interests", label: "Interests", type: "text" },
  { value: "device_type", label: "Device Type", type: "text" },
  { value: "browser", label: "Browser", type: "text" },
  { value: "purchase_history", label: "Purchase History", type: "number" },
]

interface CohortRule {
  id: string
  column: string
  operator: string
  value: string
  type: "include" | "exclude"
}

interface CustomColumn {
  id: string
  name: string
  type: "text" | "number" | "date"
}

export function CohortBuilder() {
  const [cohortName, setCohortName] = useState("")
  const [rules, setRules] = useState<CohortRule[]>([])
  const [customColumns, setCustomColumns] = useState<CustomColumn[]>([])
  const [newCustomColumn, setNewCustomColumn] = useState({
    name: "",
    type: "text" as const,
  })
  const [isAddingCustomColumn, setIsAddingCustomColumn] = useState(false)
  const { toast } = useToast()

  const addRule = () => {
    const newRule: CohortRule = {
      id: Date.now().toString(),
      column: "",
      operator: "equals",
      value: "",
      type: "include",
    }
    setRules([...rules, newRule])
  }

  const updateRule = (id: string, field: keyof CohortRule, value: string) => {
    setRules(rules.map((rule) => (rule.id === id ? { ...rule, [field]: value } : rule)))
  }

  const removeRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id))
  }

  const addCustomColumn = () => {
    if (!newCustomColumn.name) {
      toast({
        title: "Error",
        description: "Please enter a column name",
        variant: "destructive",
      })
      return
    }

    const customColumn: CustomColumn = {
      id: Date.now().toString(),
      name: newCustomColumn.name,
      type: newCustomColumn.type,
    }

    setCustomColumns([...customColumns, customColumn])
    setNewCustomColumn({ name: "", type: "text" })
    setIsAddingCustomColumn(false)
    toast({
      title: "Custom Column Added",
      description: "Your custom column has been added successfully",
    })
  }

  const removeCustomColumn = (id: string) => {
    setCustomColumns(customColumns.filter((col) => col.id !== id))
  }

  const saveCohort = () => {
    if (!cohortName) {
      toast({
        title: "Error",
        description: "Please enter a cohort name",
        variant: "destructive",
      })
      return
    }

    if (rules.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one rule",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Cohort Saved",
      description: `Cohort "${cohortName}" has been saved successfully`,
    })

    // Reset form
    setCohortName("")
    setRules([])
  }

  const allColumns = [
    ...standardColumns,
    ...customColumns.map((col) => ({
      value: col.id,
      label: col.name,
      type: col.type,
    })),
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Build Your Cohort</CardTitle>
          <CardDescription>Create audience segments with advanced filtering and custom columns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cohortName">Cohort Name</Label>
            <Input
              id="cohortName"
              value={cohortName}
              onChange={(e) => setCohortName(e.target.value)}
              placeholder="Enter cohort name"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Custom Columns</h3>
              <Button variant="outline" size="sm" onClick={() => setIsAddingCustomColumn(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Column
              </Button>
            </div>

            {isAddingCustomColumn && (
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Column Name</Label>
                      <Input
                        value={newCustomColumn.name}
                        onChange={(e) =>
                          setNewCustomColumn({
                            ...newCustomColumn,
                            name: e.target.value,
                          })
                        }
                        placeholder="Enter column name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Data Type</Label>
                      <Select
                        value={newCustomColumn.type}
                        onValueChange={(value: "text" | "number" | "date") =>
                          setNewCustomColumn({
                            ...newCustomColumn,
                            type: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end gap-2">
                      <Button onClick={addCustomColumn}>Add</Button>
                      <Button variant="outline" onClick={() => setIsAddingCustomColumn(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {customColumns.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {customColumns.map((column) => (
                  <Badge key={column.id} variant="secondary" className="flex items-center gap-1">
                    {column.name} ({column.type})
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeCustomColumn(column.id)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Filtering Rules</h3>
              <Button onClick={addRule}>
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </div>

            {rules.map((rule, index) => (
              <Card key={rule.id}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-6 gap-4 items-end">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select
                        value={rule.type}
                        onValueChange={(value: "include" | "exclude") => updateRule(rule.id, "type", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="include">Include</SelectItem>
                          <SelectItem value="exclude">Exclude</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Column</Label>
                      <Select value={rule.column} onValueChange={(value) => updateRule(rule.id, "column", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                        <SelectContent>
                          {standardColumns.map((column) => (
                            <SelectItem key={column.value} value={column.value}>
                              {column.label}
                            </SelectItem>
                          ))}
                          {customColumns.length > 0 && (
                            <>
                              <SelectSeparator />
                              {customColumns.map((column) => (
                                <SelectItem key={column.id} value={column.id}>
                                  {column.name} (Custom)
                                </SelectItem>
                              ))}
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Operator</Label>
                      <Select value={rule.operator} onValueChange={(value) => updateRule(rule.id, "operator", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {operators.map((operator) => (
                            <SelectItem key={operator.value} value={operator.value}>
                              {operator.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Value</Label>
                      <Input
                        value={rule.value}
                        onChange={(e) => updateRule(rule.id, "value", e.target.value)}
                        placeholder="Enter value"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Rule {index + 1}</Label>
                      <Badge variant={rule.type === "include" ? "default" : "destructive"}>{rule.type}</Badge>
                    </div>

                    <div>
                      <Button variant="outline" size="sm" onClick={() => removeRule(rule.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-2">
            <Button onClick={saveCohort}>
              <Filter className="h-4 w-4 mr-2" />
              Save Cohort
            </Button>
            <Button variant="outline">Preview Results</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cohort Recommendations</CardTitle>
          <CardDescription>AI-powered suggestions based on your campaign performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold">High-Value Customers</h4>
              <p className="text-sm text-muted-foreground">
                Users with purchase history {">"} $500 and engagement rate {">"} 70%
              </p>
              <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                Apply Recommendation
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold">Mobile-First Users</h4>
              <p className="text-sm text-muted-foreground">
                Users primarily accessing via mobile devices with high session duration
              </p>
              <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                Apply Recommendation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
