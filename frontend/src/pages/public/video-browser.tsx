import { useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Search } from "lucide-react"
import type { Video } from "@/types"
import { api } from "@/lib/api"
import { FilterSidebar } from "@/components/video/filter-sidebar"
import type { VideoFilters } from "@/components/video/filter-sidebar"
import { VideoGrid } from "@/components/video/video-grid"
import { VideoDetailPanel } from "@/components/video/video-detail-panel"
import { ErrorBoundary } from "@/components/error-boundary"
import { cn } from "@/lib/utils"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

const PAGE_SIZE = 20

export function VideoBrowserPage() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [filters, setFilters] = useState<VideoFilters>({})
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const buildQueryParams = (page: number) => {
    const params: Record<string, string> = {
      page: String(page),
      limit: String(PAGE_SIZE),
    }
    if (searchTerm) params.q = searchTerm
    if (selectedTags.length > 0) params.tag_ids = selectedTags.join("-")
    if (filters.sortOrder) {
      if (filters.sortOrder === "newest") {
        params.sort = "upload_date"
        params.order = "desc"
      } else if (filters.sortOrder === "oldest") {
        params.sort = "upload_date"
        params.order = "asc"
      } else if (filters.sortOrder === "alphabetical") {
        params.sort = "title"
        params.order = "asc"
      }
    }
    return params
  }

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["videos", searchTerm, filters, selectedTags],
    queryFn: ({ pageParam }) => api.getVideos(buildQueryParams(pageParam)),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.meta.page + 1
      return nextPage <= lastPage.meta.total_pages ? nextPage : undefined
    },
  })

  const videos = data?.pages.flatMap((page) => page.data) ?? []

  const handleFilterApply = (newFilters: VideoFilters) => {
    if (newFilters.tagIds) {
      setSelectedTags(newFilters.tagIds)
    }
    setFilters(newFilters)
  }

  const hasActiveFilters = searchTerm || selectedTags.length > 0 || filters.sortOrder

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedTags([])
    setFilters({})
  }

  return (
    <ErrorBoundary>
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-full overflow-hidden gap-4 p-4">
          <FilterSidebar onApply={handleFilterApply} onClearAll={handleClearFilters} selectedTagIds={selectedTags} />
          <SidebarInset className="flex flex-col flex-1 overflow-hidden rounded-lg">
            {/* Search Header - Full Width */}
            <div className="flex-none bg-card/50 backdrop-blur h-14">
              {/*<div className="flex h-full items-center gap-4 px-4">*/}
                <div className={cn(
                  "flex-1 flex items-center gap-2 rounded-lg border bg-background px-4 py-2.5 transition-colors h-10",
                  isSearchFocused && "border-primary"
                )}>
                  <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm video..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground"
                  />
                </div>
              </div>

            {/* Main Content - Full Screen */}
            <div className="flex flex-1 h-full overflow-hidden">
              <div className="flex-1 h-full overflow-hidden">
                <VideoGrid
                  videos={videos}
                  selectedVideo={selectedVideo}
                  onSelectVideo={setSelectedVideo}
                  isLoading={isLoading}
                  onLoadMore={fetchNextPage}
                  hasNextPage={hasNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                />
              </div>
              {/* Video Detail Panel - Right Side */}
              <div className={cn(
                "w-[420px] flex-none border-l bg-card overflow-hidden transition-all duration-300",
                selectedVideo ? "visible" : "hidden lg:block"
              )}>
                <VideoDetailPanel video={selectedVideo} />
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ErrorBoundary>
  )
}
