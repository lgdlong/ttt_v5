import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Filter, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import { VI } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"

export interface VideoFilters {
  sortOrder?: "newest" | "oldest" | "alphabetical"
  tagIds?: number[]
}

interface FilterSidebarProps {
  onApply: (filters: VideoFilters) => void
  selectedTagIds?: number[]
  isOpen?: boolean
}

export function FilterSidebar({
  onApply,
  selectedTagIds = [],
  isOpen = true,
}: FilterSidebarProps) {
  const [filters, setFilters] = useState<VideoFilters>({})
  const [tagSearch, setTagSearch] = useState("")
  const { setOpen } = useSidebar()

  // Sync selected tags from parent when sidebar opens
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
  }

  const handleApply = () => {
    onApply(filters)
    setOpen(false)
  }

  const selectedTags = filters.tagIds || []

  return (
    <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-3">
          <Filter className="h-4 w-4" />
          <span className="font-semibold">{VI.filter}</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex flex-col">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wide text-muted-foreground">
            Sắp xếp theo ngày đăng
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex flex-wrap gap-2 px-1">
              {(["newest", "oldest", "alphabetical"] as const).map((sort) => (
                <Badge
                  key={sort}
                  variant={filters.sortOrder === sort ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-colors",
                    filters.sortOrder === sort
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                  onClick={() => setFilters({ ...filters, sortOrder: sort })}
                >
                  {sort === "newest" ? "Mới nhất" : sort === "oldest" ? "Cũ nhất" : "A-Z"}
                </Badge>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wide text-muted-foreground">
            Thẻ
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-1">
            <div className="relative mb-2">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm thẻ..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                className="pl-8 h-8"
              />
            </div>

            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {selectedTags
                  .map((id) => tags.find((t) => t.id === id))
                  .filter(Boolean)
                  .map((tag) => (
                    <Badge
                      key={tag!.id}
                      variant="default"
                      className="cursor-pointer pr-1 gap-1"
                      onClick={() => {
                        const current = filters.tagIds || []
                        setFilters({ ...filters, tagIds: current.filter((id) => id !== tag!.id) })
                      }}
                    >
                      {tag!.name}
                      <X className="h-3 w-3" />
                    </Badge>
                  ))}
              </div>
            )}

            <ScrollArea className="h-[200px] rounded-md border bg-card">
              <div className="flex flex-col">
                {filteredTags.length === 0 ? (
                  <p className="text-sm text-muted-foreground w-full text-center py-4">
                    Không tìm thấy thẻ
                  </p>
                ) : (
                  filteredTags.map((tag) => {
                    const isSelected = filters.tagIds?.includes(tag.id)
                    return (
                      <div
                        key={tag.id}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors",
                          isSelected
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-accent"
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
                            "w-4 h-4 border rounded flex items-center justify-center",
                            isSelected ? "bg-primary border-primary" : "border-muted-foreground"
                          )}
                        >
                          {isSelected && (
                            <svg
                              className="w-3 h-3 text-primary-foreground"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm">{tag.name}</span>
                      </div>
                    )
                  })
                )}
              </div>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4 mt-auto">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            {VI.reset}
          </Button>
          <Button onClick={handleApply} className="flex-1">
            {VI.apply}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
