import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { PanelLeftIcon } from "lucide-react"
import type { Video } from "@/types"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { VideoSearchBar } from "@/components/video/video-search-bar"
import { FilterSidebar } from "@/components/video/filter-sidebar"
import type { VideoFilters } from "@/components/video/filter-sidebar"
import { VideoGrid } from "@/components/video/video-grid"
import { VideoDetailPanel } from "@/components/video/video-detail-panel"
import { ErrorBoundary } from "@/components/error-boundary"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function VideoBrowserPage() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [filters, setFilters] = useState<VideoFilters>({})

  const buildQueryParams = () => {
    const params: Record<string, string> = {}
    if (searchTerm) params.q = searchTerm
    if (selectedTags.length > 0) params.tag_ids = selectedTags.join("-")
    // Map sortOrder to API params
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

  const { data, isLoading } = useQuery({
    queryKey: ["videos", searchTerm, filters, selectedTags],
    queryFn: () => api.getVideos(buildQueryParams()),
  })

  const videos = data || []

  const handleFilterApply = (newFilters: VideoFilters) => {
    // Sync tagIds from filter sidebar to selectedTags for API query
    if (newFilters.tagIds) {
      setSelectedTags(newFilters.tagIds)
    }
    setFilters(newFilters)
  }

  return (
    <ErrorBoundary>
      <SidebarProvider defaultOpen={true}>
        <FilterSidebar
          onApply={handleFilterApply}
          selectedTagIds={selectedTags}
        />
        <SidebarInset>
          <div className="container mx-auto px-4 py-6 space-y-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger>
                <Button variant="ghost" size="icon">
                  <PanelLeftIcon className="h-4 w-4" />
                </Button>
              </SidebarTrigger>
              <div className="flex-1">
                <VideoSearchBar onSearchChange={(term) => setSearchTerm(term)} />
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 lg:max-w-[60%]">
                <VideoGrid
                  videos={videos}
                  selectedVideo={selectedVideo}
                  onSelectVideo={setSelectedVideo}
                  isLoading={isLoading}
                />
              </div>
              <div className="lg:w-[40%] lg:sticky lg:top-4 lg:h-fit">
                <VideoDetailPanel video={selectedVideo} />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ErrorBoundary>
  )
}