import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Filter } from "lucide-react"
import { VI } from "@/lib/constants"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export interface VideoFilters {
  dateFrom?: string
  dateTo?: string
  sortOrder?: "newest" | "oldest" | "alphabetical"
  duration?: "short" | "medium" | "long"
  tagIds?: number[]
}

interface FilterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApply: (filters: VideoFilters) => void
}

export function FilterModal({ open, onOpenChange, onApply }: FilterModalProps) {
  const [filters, setFilters] = useState<VideoFilters>({})

  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: () => api.getTags({ page: "1", limit: "100" }),
  })

  const handleReset = () => setFilters({})

  const handleApply = () => {
    onApply(filters)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {VI.filter}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">{VI.filter} ngày</label>
            <div className="flex gap-2 items-center">
              <Input
                type="date"
                value={filters.dateFrom || ""}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="flex-1"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="date"
                value={filters.dateTo || ""}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Sắp xếp theo ngày đăng</label>
            <div className="flex flex-wrap gap-2">
              {(["newest", "oldest", "alphabetical"] as const).map((sort) => (
                <Badge
                  key={sort}
                  variant={filters.sortOrder === sort ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setFilters({ ...filters, sortOrder: sort })}
                >
                  {sort === "newest" ? "Mới nhất" : sort === "oldest" ? "Cũ nhất" : "A-Z"}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Thời lượng</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "short", label: "Ngắn (<5p)" },
                { value: "medium", label: "Vừa (5-20p)" },
                { value: "long", label: "Dài (>20p)" },
              ].map((d) => (
                <Badge
                  key={d.value}
                  variant={filters.duration === d.value ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setFilters({ ...filters, duration: d.value as VideoFilters["duration"] })}
                >
                  {d.label}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Thẻ</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={filters.tagIds?.includes(tag.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    const current = filters.tagIds || []
                    const updated = current.includes(tag.id)
                      ? current.filter((id) => id !== tag.id)
                      : [...current, tag.id]
                    setFilters({ ...filters, tagIds: updated })
                  }}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            {VI.reset}
          </Button>
          <Button onClick={handleApply}>{VI.apply}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
