import { toast } from "sonner"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"
import { VI } from "@/lib/constants"
import type { Video, Tag } from "@/types"

export function VideoManagementPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()

  const [attachDialogOpen, setAttachDialogOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [tagSearch, setTagSearch] = useState("")

  const { data: videosData, isLoading } = useQuery({
    queryKey: ["videos", { q: search, page: page.toString() }],
    queryFn: () => api.getVideos({ q: search, page: page.toString(), limit: "20" }),
  })

  const { data: tagsData } = useQuery({
    queryKey: ["tags", { page: "1", limit: "100" }],
    queryFn: () => api.getTags({ page: "1", limit: "100" }),
  })

  const attachMutation = useMutation({
    mutationFn: ({ youtubeId, tagId }: { youtubeId: string; tagId: number }) =>
      api.attachTag(youtubeId, tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] })
      toast.success(VI.tagAttached)
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

  const videos: Video[] = videosData?.data ?? []
  const tags: Tag[] = tagsData ?? []

  // Get available tags that are not yet attached to the video
  const availableTags = tags.filter(
    (tag) => !selectedVideo?.tags?.some((t) => t.id === tag.id)
  )
  const filteredTags = availableTags.filter((tag) =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  )

  const handleAttach = (video: Video) => {
    setSelectedVideo(video)
    setTagSearch("")
    setAttachDialogOpen(true)
  }

  const handleAttachTag = (tagId: number) => {
    if (selectedVideo) {
      attachMutation.mutate({ youtubeId: selectedVideo.youtube_id, tagId })
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
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
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

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            {page === 1 ? (
              <PaginationPrevious className="pointer-events-none opacity-50" />
            ) : (
              <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} />
            )}
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive>{page}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            {isLoading || videos.length < 20 ? (
              <PaginationNext className="pointer-events-none opacity-50" />
            ) : (
              <PaginationNext onClick={() => setPage((p) => p + 1)} />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <Dialog open={attachDialogOpen} onOpenChange={setAttachDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Gán thẻ cho video</DialogTitle>
            <DialogDescription className="text-sm">
              {selectedVideo?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Assigned Tags - Top */}
            <div>
              <Label className="text-xs text-muted-foreground">Thẻ đã gán</Label>
              <div className="mt-1 flex flex-wrap gap-1 min-h-[32px]">
                {selectedVideo?.tags && selectedVideo.tags.length > 0 ? (
                  selectedVideo.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      {tag.name}
                      <button
                        onClick={() => handleDetachTag(selectedVideo, tag.id)}
                        disabled={detachMutation.isPending}
                        className="ml-1 text-xs hover:text-red-500 disabled:opacity-50"
                      >
                        ×
                      </button>
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">Chưa có thẻ nào</span>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <div>
              <Label className="text-xs text-muted-foreground">Thêm thẻ mới</Label>
              <Input
                placeholder="Tìm thẻ..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Available Tags List */}
            <div className="max-h-48 overflow-y-auto space-y-1">
              {filteredTags.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">
                  {availableTags.length === 0 ? "Tất cả thẻ đã được gán" : "Không tìm thấy thẻ"}
                </p>
              ) : (
                filteredTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleAttachTag(tag.id)}
                    disabled={attachMutation.isPending}
                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground disabled:opacity-50 transition-colors"
                  >
                    {tag.name}
                  </button>
                ))
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAttachDialogOpen(false)}>
              {VI.cancel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
