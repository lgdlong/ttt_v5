import type { Video } from "@/types"
import { VI } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ExternalLink, Film } from "lucide-react"

interface VideoDetailPanelProps {
  video: Video | null
  onClose?: () => void
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function VideoDetailPanel({ video, onClose }: VideoDetailPanelProps) {
  if (!video) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-muted rounded-full p-4 mb-4">
          <Film className="size-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">{VI.selectVideo}</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="aspect-video w-full bg-muted rounded-none overflow-hidden">
        {video.thumbnail_url ? (
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
            <Film className="size-16 text-muted-foreground" />
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold leading-tight">{video.title}</h2>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground shrink-0">Tên kênh:</span>
              <span className="font-medium">{video.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground shrink-0">Ngày đăng:</span>
              <span className="font-medium">{formatDate(video.upload_date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground shrink-0">Thời lượng:</span>
              <span className="font-medium">{formatDuration(video.duration_seconds)}</span>
            </div>
          </div>

          {video.tags && video.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {video.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex gap-2 xl:hidden">
            <Button
              variant="default"
              className="w-3/5 cursor-pointer"
              onClick={() => window.open(`https://youtube.com/watch?v=${video.youtube_id}`, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {VI.watchOnYoutube}
            </Button>
            {onClose && (
              <Button
                variant="outline"
                className="w-1/3 cursor-pointer"
                onClick={onClose}
              >
                {VI.close}
              </Button>
            )}
          </div>
          <Button
            variant="default"
            className="hidden xl:flex w-full cursor-pointer"
            onClick={() => window.open(`https://youtube.com/watch?v=${video.youtube_id}`, "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-4" />
            {VI.watchOnYoutube}
          </Button>
        </div>
      </ScrollArea>
    </div>
  )
}