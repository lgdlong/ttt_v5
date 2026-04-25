import { toast } from "sonner"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { SelectWrapper } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"
import { VI } from "@/lib/constants"
import type { Video, Tag } from "@/types"

export function VideoManagementPage() {
  const [search, setSearch] = useState("")
  const queryClient = useQueryClient()

  const [attachDialogOpen, setAttachDialogOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [selectedTagId, setSelectedTagId] = useState<string>("")

  const { data: videosData, isLoading } = useQuery({
    queryKey: ["videos", { q: search }],
    queryFn: () => api.getVideos(search ? { q: search } : {}),
  })

  const { data: tagsData } = useQuery({
    queryKey: ["tags"],
    queryFn: () => api.getTags(),
  })

  const attachMutation = useMutation({
    mutationFn: ({ youtubeId, tagId }: { youtubeId: string; tagId: number }) =>
      api.attachTag(youtubeId, tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] })
      toast.success(VI.tagAttached)
      setAttachDialogOpen(false)
      setSelectedVideo(null)
      setSelectedTagId("")
    },
    onError: () => {
      toast.error(VI.errorOccurred)
    },
  })

  const detachMutation = useMutation({
    mutationFn: ({ youtubeId, tagId }: { youtubeId: string; tagId: number }) =>
      api.detachTag(youtubeId, tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] })
      toast.success(VI.tagDetached)
    },
    onError: () => {
      toast.error(VI.errorOccurred)
    },
  })

  const videos: Video[] = videosData ?? []
  const tags: Tag[] = tagsData ?? []

  const handleAttach = (video: Video) => {
    setSelectedVideo(video)
    setAttachDialogOpen(true)
  }

  const handleAttachConfirm = () => {
    if (selectedVideo && selectedTagId) {
      attachMutation.mutate({ youtubeId: selectedVideo.youtube_id, tagId: Number(selectedTagId) })
    }
  }

  const handleDetachTag = (video: Video, tagId: number) => {
    detachMutation.mutate({ youtubeId: video.youtube_id, tagId })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{VI.totalVideos}</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{VI.totalVideos}</CardTitle>
            <Input
              placeholder={VI.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thumbnail</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-10 w-10" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                  </TableRow>
                ))
              ) : videos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                    {VI.noResults}
                  </TableCell>
                </TableRow>
              ) : (
                videos.map((video) => (
                  <TableRow key={video.youtube_id}>
                    <TableCell>
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="h-10 w-10 rounded object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">{video.title}</TableCell>
                    <TableCell className="text-muted-foreground">{video.author}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(video.tags ?? []).map((tag) => (
                          <Badge key={tag.id} variant="secondary" className="gap-1">
                            {tag.name}
                            <button
                              onClick={() => handleDetachTag(video, tag.id)}
                              className="ml-1 text-xs hover:text-red-500"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => handleAttach(video)}>
                        Gán thẻ
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={attachDialogOpen} onOpenChange={setAttachDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gán thẻ cho video</DialogTitle>
            <DialogDescription>
              Chọn một thẻ để gán cho video: {selectedVideo?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Thẻ</Label>
            <SelectWrapper value={selectedTagId} onChange={(e) => setSelectedTagId(e.target.value)}>
              <option value="">-- Chọn thẻ --</option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>{tag.name}</option>
              ))}
            </SelectWrapper>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAttachDialogOpen(false)}>{VI.cancel}</Button>
            <Button onClick={handleAttachConfirm} disabled={!selectedTagId || attachMutation.isPending}>
              {attachMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Gán
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
