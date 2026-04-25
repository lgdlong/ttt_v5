import { useRef } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Film } from "lucide-react"
import type { Video } from "@/types"
import { VideoCard } from "./video-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { VI } from "@/lib/constants"

interface VideoGridProps {
  videos: Video[]
  selectedVideo: Video | null
  onSelectVideo: (video: Video) => void
  isLoading: boolean
}

export function VideoGrid({ videos, selectedVideo, onSelectVideo, isLoading }: VideoGridProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(videos.length / 3),
    getScrollElement: () => parentRef.current,
    estimateSize: () => 280,
    overscan: 5,
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-video w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <Film className="size-10" />
        </EmptyMedia>
        <EmptyTitle>{VI.noResults}</EmptyTitle>
        <EmptyDescription>
          Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
        </EmptyDescription>
      </Empty>
    )
  }

  return (
    <div ref={parentRef} className="overflow-auto max-h-[calc(100vh-300px)]">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const rowStart = virtualRow.index * 3
          const rowVideos = videos.slice(rowStart, rowStart + 3)

          return (
            <div
              key={virtualRow.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 p-1"
            >
              {rowVideos.map((video) => (
                <VideoCard
                  key={video.youtube_id}
                  video={video}
                  isSelected={selectedVideo?.youtube_id === video.youtube_id}
                  onClick={() => onSelectVideo(video)}
                />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
