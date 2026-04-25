import type { Video } from "@/types"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface VideoCardProps {
  video: Video
  isSelected: boolean
  onClick: () => void
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

export function VideoCard({ video, isSelected, onClick }: VideoCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer overflow-hidden transition-all hover:shadow-md p-0",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={onClick}
    >
      <div className="min-h-30 w-full bg-muted relative">
        {video.thumbnail_url ? (
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
            <span className="text-4xl">Không có thubnail</span>
          </div>
        )}
        <Badge className="absolute bottom-2 right-2" variant="secondary">
          {formatDuration(video.duration_seconds)}
        </Badge>
      </div>
      <div className="p-3 space-y-1">
        <h3 className="font-medium line-clamp-2 text-sm">{video.title}</h3>
        <p className="text-xs text-muted-foreground">{video.author}</p>
        <p className="text-xs text-muted-foreground">{formatDate(video.upload_date)}</p>
      </div>
    </Card>
  )
}
