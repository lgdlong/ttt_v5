import type { Video } from "@/types"
import { cn } from "@/lib/utils"
import { Play, Calendar } from "lucide-react"

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
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export function VideoCard({ video, isSelected, onClick }: VideoCardProps) {
  return (
    <button
      className={cn(
        "w-full text-left cursor-pointer group transition-opacity p-0 bg-transparent border-0",
        isSelected && "opacity-100"
      )}
      onClick={onClick}
    >
      <div className={cn(
        "relative w-full aspect-video bg-muted overflow-hidden transition-colors",
        isSelected ? "ring-2 ring-primary" : ""
      )}>
        {video.thumbnail_url ? (
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
            <Play className="size-8 text-muted-foreground" />
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
          {formatDuration(video.duration_seconds)}
        </div>
      </div>
      <div className="py-1.5 px-1">
        <h3 className={cn(
          "font-medium text-sm leading-tight line-clamp-2 text-foreground transition-colors",
          isSelected ? "text-primary" : "group-hover:text-primary"
        )}>
          {video.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">{video.author}</p>
        <p className="text-xs text-muted-foreground/70 mt-0.5 flex items-center gap-1">
          {formatDate(video.upload_date)}
        </p>
      </div>
    </button>
  )
}
