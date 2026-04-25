import { toast } from "sonner"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"
import { VI } from "@/lib/constants"
import type { Tag } from "@/types"

export function TagManagementPage() {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null)
  const [tagName, setTagName] = useState("")
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null)
  const [search, setSearch] = useState("")

  const { data: tags, isLoading } = useQuery({
    queryKey: ["tags", { q: search }],
    queryFn: () => api.getTags({ q: search, page: "1", limit: "100" }),
  })

  const createMutation = useMutation({
    mutationFn: (name: string) => api.createTag({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] })
      toast.success(VI.tagCreated)
      closeDialog()
    },
    onError: () => {
      toast.error(VI.errorOccurred)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => api.updateTag(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] })
      toast.success(VI.tagUpdated)
      closeDialog()
    },
    onError: () => {
      toast.error(VI.errorOccurred)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] })
      toast.success(VI.tagDeleted)
      setDeleteDialogOpen(false)
      setTagToDelete(null)
    },
    onError: () => {
      toast.error(VI.errorOccurred)
    },
  })

  const openCreateDialog = () => {
    setSelectedTag(null)
    setTagName("")
    setDialogOpen(true)
  }

  const openEditDialog = (tag: Tag) => {
    setSelectedTag(tag)
    setTagName(tag.name)
    setDialogOpen(true)
  }

  const openDeleteDialog = (tag: Tag) => {
    setTagToDelete(tag)
    setDeleteDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setSelectedTag(null)
    setTagName("")
  }

  const handleSave = () => {
    if (!tagName.trim()) return
    if (selectedTag) {
      updateMutation.mutate({ id: selectedTag.id, name: tagName })
    } else {
      createMutation.mutate(tagName)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{VI.totalTags}</h1>
        <Button onClick={openCreateDialog}>{VI.create}</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{VI.totalTags}</CardTitle>
            <Input
              placeholder="Tìm thẻ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
          </div>
        </CardHeader>
        <CardContent className="max-h-[60vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : !tags || tags.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                    {VI.noTags}
                  </TableCell>
                </TableRow>
              ) : (
                tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell className="text-muted-foreground">{tag.id}</TableCell>
                    <TableCell className="font-medium">{tag.name}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => openEditDialog(tag)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => openDeleteDialog(tag)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
        <DialogHeader>
          <DialogTitle>{selectedTag ? VI.edit : VI.create}</DialogTitle>
          <DialogDescription>
            {selectedTag ? "Sửa thông tin thẻ" : "Tạo mới thẻ"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label>Tên thẻ</Label>
          <Input
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            placeholder="Nhập tên thẻ..."
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={closeDialog}>{VI.cancel}</Button>
          <Button onClick={handleSave} disabled={!tagName.trim() || createMutation.isPending || updateMutation.isPending}>
            {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-4 w-4 animate-spin" />}
            {VI.save}
          </Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
        <DialogHeader>
          <DialogTitle>{VI.delete}</DialogTitle>
          <DialogDescription>
            Bạn có chắc muốn xóa thẻ "{tagToDelete?.name}"? Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>{VI.cancel}</Button>
          <Button variant="destructive" onClick={() => tagToDelete && deleteMutation.mutate(tagToDelete.id)} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {VI.delete}
          </Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
