import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { ArrowUpDown, ArrowUp, ArrowDown, Search, X, Check, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import { VI } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export interface VideoFilters {
  sortOrder?: "newest" | "oldest" | "alphabetical"
  tagIds?: number[]
}

interface FilterSidebarProps {
  onApply: (filters: VideoFilters) => void
  onClearAll?: () => void
  selectedTagIds?: number[]
  isOpen?: boolean
}

const sortOptions = [
  { value: "newest", label: "Mới nhất", Icon: ArrowDown },
  { value: "oldest", label: "Cũ nhất", Icon: ArrowUp },
  { value: "alphabetical", label: "A-Z", Icon: ArrowUpDown },
] as const

export function FilterSidebar({
  onApply,
  onClearAll,
  selectedTagIds = [],
  isOpen = true,
}: FilterSidebarProps) {
  const [filters, setFilters] = useState<VideoFilters>({})
  const [tagSearch, setTagSearch] = useState("")

  useEffect(() => {
    if (isOpen && selectedTagIds.length > 0) {
      setFilters((prev) => ({ ...prev, tagIds: selectedTagIds }))
    }
  }, [isOpen, selectedTagIds])

  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: () => api.getTags({ page: "1", limit: "100" }),
  })

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  )

  const handleReset = () => {
    setFilters({})
    setTagSearch("")
    onApply({})
    onClearAll?.()
  }

  const handleApply = () => {
    onApply(filters)
  }

  const selectedTags = filters.tagIds || []

  return (
    <div className="w-64 flex-none bg-card flex flex-col rounded-lg overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-sm">{VI.filter}</span>
        </div>
        {(selectedTags.length > 0 || filters.sortOrder) && (
          <button
            onClick={handleReset}
            className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          >
            Đặt lại
          </button>
        )}
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-3 mb-2 scrollbar-gutter-stable max-h-[calc(100vh-12rem)]">
        {/* Sort Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 px-3 py-0.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Sắp xếp
            </span>
          </div>
          <div className="space-y-1">
            {sortOptions.map((option) => {
              const isSelected = filters.sortOrder === option.value
              return (
                <button
                  key={option.value}
                  onClick={() => setFilters({ ...filters, sortOrder: isSelected ? undefined : option.value })}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all cursor-pointer",
                    isSelected
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-accent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <option.Icon className="h-4 w-4 text-muted-foreground" />
                  <span>{option.label}</span>
                  {isSelected && <Check className="h-4 w-4 ml-auto" />}
                </button>
              )
            })}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Tags Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Bộ lọc theo thẻ
            </span>
            {selectedTags.length > 0 && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                {selectedTags.length}
              </Badge>
            )}
          </div>

          {/* Search Tags */}
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm thẻ..."
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>

          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3 p-2 bg-muted/50 rounded-md">
              {selectedTags
                .map((id) => tags.find((t) => t.id === id))
                .filter(Boolean)
                .map((tag) => (
                  <Badge
                    key={tag!.id}
                    variant="default"
                    className="text-xs cursor-pointer gap-1 pr-1.5"
                    onClick={() => {
                      const current = filters.tagIds || []
                      setFilters({ ...filters, tagIds: current.filter((id) => id !== tag!.id) })
                    }}
                  >
                    {tag!.name}
                    <X className="h-3 w-3" />
                  </Badge>
                ))}
              <button
                onClick={handleReset}
                className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 cursor-pointer"
              >
                Xóa tất cả
              </button>
            </div>
          )}

          {/* Tag List */}
          <div className="space-y-0.5 max-h-[280px] overflow-y-auto">
            {filteredTags.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                Không tìm thấy thẻ
              </p>
            ) : (
              filteredTags.map((tag) => {
                const isSelected = filters.tagIds?.includes(tag.id)
                return (
                  <button
                    key={tag.id}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-all cursor-pointer",
                      isSelected ? "bg-primary/10 text-primary" : "hover:bg-accent"
                    )}
                    onClick={() => {
                      const current = filters.tagIds || []
                      const updated = current.includes(tag.id)
                        ? current.filter((id) => id !== tag.id)
                        : [...current, tag.id]
                      setFilters({ ...filters, tagIds: updated })
                    }}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center flex-none transition-colors",
                        isSelected ? "bg-primary border-primary" : "border-muted-foreground/50 bg-background"
                      )}
                    >
                      {isSelected && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                    </div>
                    <span className={cn(!isSelected && "text-muted-foreground")}>
                      {tag.name}
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions - Always visible */}
      <div className="border-t p-3 shrink-0">
        <Button
          variant="default"
          onClick={handleApply}
          className="w-full cursor-pointer"
          size="sm"
        >
          Áp dụng
        </Button>
      </div>
    </div>
  )
}
