import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Film, Tags, Calendar, CalendarDays } from "lucide-react"
import { api } from "@/lib/api"
import { VI } from "@/lib/constants"
import type { Video, Tag } from "@/types"

function StatCard({ icon: Icon, label, value, loading }: { icon: React.ElementType; label: string; value: number; loading: boolean }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-10 w-20" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  )
}

export function AdminDashboardPage() {
  const { data: videosData, isLoading: videosLoading } = useQuery({
    queryKey: ["videos"],
    queryFn: () => api.getVideos(),
  })

  const { data: tagsData, isLoading: tagsLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: () => api.getTags(),
  })

  const videos: Video[] = videosData ?? []
  const tags: Tag[] = tagsData ?? []

  const totalVideos = videos.length
  const totalTags = tags.length

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const thisWeek = videos.filter((v) => new Date(v.upload_date) >= weekAgo).length
  const thisMonth = videos.filter((v) => new Date(v.upload_date) >= monthAgo).length

  // Top 5 tags by video count
  const tagVideoCounts = tags.map((tag) => ({
    tag,
    count: videos.filter((v) => v.tags?.some((t) => t.id === tag.id)).length,
  }))
  const topTags = tagVideoCounts.sort((a, b) => b.count - a.count).slice(0, 5)

  return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Film} label={VI.totalVideos} value={totalVideos} loading={videosLoading} />
          <StatCard icon={Tags} label={VI.totalTags} value={totalTags} loading={tagsLoading} />
          <StatCard icon={Calendar} label={VI.thisWeek} value={thisWeek} loading={videosLoading} />
          <StatCard icon={CalendarDays} label={VI.thisMonth} value={thisMonth} loading={videosLoading} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top Tags</CardTitle>
          </CardHeader>
          <CardContent>
            {tagsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : topTags.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-24 text-muted-foreground gap-2">
                <Tags className="h-6 w-6" />
                <span>{VI.noData}</span>
              </div>
            ) : (
              <div className="space-y-2">
                {topTags.map(({ tag, count }) => (
                  <div key={tag.id} className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{tag.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{count} videos</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
}
