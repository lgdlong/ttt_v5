import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { IconPencil, IconTrash, IconSearch } from "@tabler/icons-react"
import { Button, Card, Modal, TextInput, Table, Skeleton, Group, Title, Text, ActionIcon, ScrollArea, Stack } from "@mantine/core"
import { notifications } from "@mantine/notifications"
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
      notifications.show({ message: VI.tagCreated, color: 'green' })
      closeDialog()
    },
    onError: () => {
      notifications.show({ message: VI.errorOccurred, color: 'red' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => api.updateTag(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] })
      notifications.show({ message: VI.tagUpdated, color: 'green' })
      closeDialog()
    },
    onError: () => {
      notifications.show({ message: VI.errorOccurred, color: 'red' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] })
      notifications.show({ message: VI.tagDeleted, color: 'green' })
      setDeleteDialogOpen(false)
      setTagToDelete(null)
    },
    onError: () => {
      notifications.show({ message: VI.errorOccurred, color: 'red' })
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
    <Stack gap="xl">
      <Group justify="space-between">
        <Title order={2}>{VI.totalTags}</Title>
        <Button onClick={openCreateDialog}>{VI.create}</Button>
      </Group>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section withBorder inheritPadding py="xs" mb="md">
          <Group justify="space-between">
            <Title order={4}>{VI.totalTags}</Title>
            <TextInput
              placeholder="Tìm thẻ..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.currentTarget.value)}
              w={256}
              leftSection={<IconSearch size={16} className="text-gray-400" />}
            />
          </Group>
        </Card.Section>

        <ScrollArea h={400} offsetScrollbars>
          <Table stickyHeader striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Table.Tr key={i}>
                    <Table.Td><Skeleton height={20} width={32} /></Table.Td>
                    <Table.Td><Skeleton height={20} width={128} /></Table.Td>
                    <Table.Td><Skeleton height={32} width={96} /></Table.Td>
                  </Table.Tr>
                ))
              ) : !tags || tags.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={3}>
                    <Text c="dimmed" ta="center" py="xl">
                      {VI.noTags}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                tags.map((tag) => (
                  <Table.Tr key={tag.id}>
                    <Table.Td c="dimmed">{tag.id}</Table.Td>
                    <Table.Td fw={500}>{tag.name}</Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon variant="subtle" color="blue" onClick={() => openEditDialog(tag)}>
                          <IconPencil size={18} />
                        </ActionIcon>
                        <ActionIcon variant="subtle" color="red" onClick={() => openDeleteDialog(tag)}>
                          <IconTrash size={18} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Card>

      {/* Create/Edit Dialog */}
      <Modal 
        opened={dialogOpen} 
        onClose={closeDialog} 
        title={<Title order={4}>{selectedTag ? VI.edit : VI.create}</Title>}
      >
        <Text size="sm" c="dimmed" mb="md">
          {selectedTag ? "Sửa thông tin thẻ" : "Tạo mới thẻ"}
        </Text>
        <TextInput
          label="Tên thẻ"
          value={tagName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagName(e.currentTarget.value)}
          placeholder="Nhập tên thẻ..."
          mb="xl"
          data-autofocus
        />
        <Group justify="flex-end">
          <Button variant="default" onClick={closeDialog}>{VI.cancel}</Button>
          <Button 
            onClick={handleSave} 
            disabled={!tagName.trim()} 
            loading={createMutation.isPending || updateMutation.isPending}
          >
            {VI.save}
          </Button>
        </Group>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Modal 
        opened={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)} 
        title={<Title order={4} c="red">{VI.delete}</Title>}
      >
        <Text mb="xl">
          Bạn có chắc muốn xóa thẻ <strong>"{tagToDelete?.name}"</strong>? Hành động này không thể hoàn tác.
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setDeleteDialogOpen(false)}>{VI.cancel}</Button>
          <Button 
            color="red" 
            onClick={() => tagToDelete && deleteMutation.mutate(tagToDelete.id)} 
            loading={deleteMutation.isPending}
          >
            {VI.delete}
          </Button>
        </Group>
      </Modal>
    </Stack>
  )
}
