import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Filter } from "lucide-react"
import type { Video } from "@/types"
import { api } from "@/lib/api"
import { VI } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { VideoSearchBar } from "@/components/video/video-search-bar"
import { FilterModal } from "@/components/video/filter-modal"
import type { VideoFilters } from "@/components/video/filter-modal"
import { TagFilters } from "@/components/video/tag-filters"
import { VideoGrid } from "@/components/video/video-grid"
import { VideoDetailPanel } from "@/components/video/video-detail-panel"
import { ErrorBoundary } from "@/components/error-boundary"

export function VideoBrowserPage() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [filters, setFilters] = useState<VideoFilters>({})
  const [filterModalOpen, setFilterModalOpen] = useState(false)

  const buildQueryParams = () => {
    const params: Record<string, string> = {}
    if (searchTerm) params.q = searchTerm
    if (filters.dateFrom) params.date_from = filters.dateFrom
    if (filters.dateTo) params.date_to = filters.dateTo
    if (filters.sortOrder) params.sort = filters.sortOrder
    if (filters.duration) params.duration = filters.duration
    if (selectedTags.length > 0) params.tag_ids = selectedTags.join(",")
    return params
  }

  const { data, isLoading } = useQuery({
    queryKey: ["videos", searchTerm, filters, selectedTags],
    queryFn: () => api.getVideos(buildQueryParams()),
  })

  const videos = data || []

  const handleTagSelect = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    )
  }

  const handleFilterApply = (newFilters: VideoFilters) => {
    setFilters(newFilters)
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <VideoSearchBar onSearchChange={(term) => setSearchTerm(term)} />
          </div>
          <Button
            variant="outline"
            onClick={() => setFilterModalOpen(true)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {VI.filter}
          </Button>
        </div>

        <TagFilters selectedTags={selectedTags} onTagSelect={handleTagSelect} />

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

      <FilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        onApply={handleFilterApply}
      />
    </ErrorBoundary>
  )
}