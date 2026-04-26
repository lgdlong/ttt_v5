import { useRef } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Film } from "lucide-react"
import type { Video } from "@/types"
import { VideoCard } from "./video-card"
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { VI } from "@/lib/constants"

interface VideoGridProps {
  videos: Video[]
  selectedVideo: Video | null
  onSelectVideo: (video: Video) => void
  isLoading: boolean
  onLoadMore?: () => void
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
}

const CARD_HEIGHT = 200
const CARD_GAP = 12
const COLUMNS = 4

export function VideoGrid({
  videos,
  selectedVideo,
  onSelectVideo,
  isLoading,
  onLoadMore,
  hasNextPage,
  isFetchingNextPage,
}: VideoGridProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const rowCount = Math.ceil(videos.length / COLUMNS)
  const totalRows = hasNextPage ? rowCount + 1 : rowCount

  const rowVirtualizer = useVirtualizer({
    count: totalRows,
    getScrollElement: () => parentRef.current,
    estimateSize: () => CARD_HEIGHT + CARD_GAP,
    overscan: 3,
  })

  // Detect when to load more
  const lastItem = rowVirtualizer.getVirtualItems().at(-1)
  if (
    lastItem &&
    lastItem.index >= rowCount - 1 &&
    hasNextPage &&
    !isFetchingNextPage
  ) {
    onLoadMore?.()
  }

  if (isLoading && videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Empty>
          <EmptyMedia variant="icon">
            <Film className="size-10" />
          </EmptyMedia>
          <EmptyTitle>{VI.noResults}</EmptyTitle>
          <EmptyDescription>
            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
          </EmptyDescription>
        </Empty>
      </div>
    )
  }

  return (
    <div ref={parentRef} className="h-full overflow-auto p-3 pb-8">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "calc(100% - 56px)",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const rowStart = virtualRow.index * COLUMNS
          const rowVideos = videos.slice(rowStart, rowStart + COLUMNS)
          const isLoaderRow = virtualRow.index >= rowCount

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
            >
              <div className="grid grid-cols-4 gap-4 h-full">
                {isLoaderRow ? (
                  <div className="col-span-4 flex items-center justify-center">
                    {isFetchingNextPage ? (
                      <Spinner />
                    ) : hasNextPage ? (
                      <span className="text-muted-foreground text-sm">Đang tải...</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">Không còn video</span>
                    )}
                  </div>
                ) : (
                  rowVideos.map((video) => (
                    <VideoCard
                      key={video.youtube_id}
                      video={video}
                      isSelected={selectedVideo?.youtube_id === video.youtube_id}
                      onClick={() => onSelectVideo(video)}
                    />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
