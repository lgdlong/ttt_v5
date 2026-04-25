import type { Video } from "@/types"
import { VI } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Empty, EmptyTitle, EmptyMedia } from "@/components/ui/empty"
import { ExternalLink, Film } from "lucide-react"

interface VideoDetailPanelProps {
  video: Video | null
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("vi-VN")
}

export function VideoDetailPanel({ video }: VideoDetailPanelProps) {
  if (!video) {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <Film className="size-10" />
        </EmptyMedia>
        <EmptyTitle>{VI.selectVideo}</EmptyTitle>
      </Empty>
    )
  }

  return (
    <div className="space-y-4">
      <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden">
        {video.thumbnail_url ? (
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
            <span className="text-6xl">🎬</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">{video.title}</h2>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{video.author}</span>
          <span>{formatDate(video.upload_date)}</span>
          <Badge variant="secondary">{formatDuration(video.duration_seconds)}</Badge>
        </div>

        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {video.tags.map((tag) => (
              <Badge key={tag.id} variant="outline">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        <Button
          variant="default"
          className="w-full"
          onClick={() => window.open(`https://youtube.com/watch?v=${video.youtube_id}`, "_blank")}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          {VI.watchOnYoutube}
        </Button>
      </div>
    </div>
  )
}