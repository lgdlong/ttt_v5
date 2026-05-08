import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { IconSearch } from "@tabler/icons-react"
import { 
  Pagination, 
  TextInput, 
  Button, 
  Badge, 
  Card, 
  Modal, 
  Table, 
  Skeleton, 
  Group, 
  Title, 
  Text, 
  ScrollArea, 
  Stack, 
  Image, 
  CloseButton,
  UnstyledButton,
  Box
} from "@mantine/core"
import { notifications } from "@mantine/notifications"
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
      notifications.show({ message: VI.tagAttached, color: 'green' })
    },
    onError: () => {
      notifications.show({ message: VI.errorOccurred, color: 'red' })
    },
  })

  const detachMutation = useMutation({
    mutationFn: ({ youtubeId, tagId }: { youtubeId: string; tagId: number }) =>
      api.detachTag(youtubeId, tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] })
      notifications.show({ message: VI.tagDetached, color: 'green' })
    },
    onError: () => {
      notifications.show({ message: VI.errorOccurred, color: 'red' })
    },
  })

  const videos: Video[] = videosData?.data ?? []
  const totalPages = videosData?.meta?.total_pages ?? 1
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
    <Stack gap="xl">
      <Title order={2}>{VI.totalVideos}</Title>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section withBorder inheritPadding py="xs" mb="md">
          <Group justify="space-between">
            <Title order={4}>{VI.totalVideos}</Title>
            <TextInput
              placeholder={VI.searchPlaceholder}
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearch(e.currentTarget.value)
                setPage(1)
              }}
              w={256}
              leftSection={<IconSearch size={16} className="text-gray-400" />}
            />
          </Group>
        </Card.Section>
        
        <ScrollArea>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Thumbnail</Table.Th>
                <Table.Th>Title</Table.Th>
                <Table.Th>Author</Table.Th>
                <Table.Th>Tags</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Table.Tr key={i}>
                    <Table.Td><Skeleton height={40} width={40} radius="sm" /></Table.Td>
                    <Table.Td><Skeleton height={20} width={200} /></Table.Td>
                    <Table.Td><Skeleton height={20} width={100} /></Table.Td>
                    <Table.Td><Skeleton height={20} width={80} /></Table.Td>
                    <Table.Td><Skeleton height={32} width={80} /></Table.Td>
                  </Table.Tr>
                ))
              ) : videos.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Text c="dimmed" ta="center" py="xl">
                      {VI.noResults}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                videos.map((video) => (
                  <Table.Tr key={video.youtube_id}>
                    <Table.Td>
                      <Image
                        src={video.thumbnail_url}
                        alt={video.title}
                        h={40}
                        w={40}
                        radius="sm"
                        style={{ objectFit: 'cover' }}
                      />
                    </Table.Td>
                    <Table.Td>
                      <Text fw={500} lineClamp={1} maw={250}>
                        {video.title}
                      </Text>
                    </Table.Td>
                    <Table.Td c="dimmed">{video.author}</Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        {(video.tags ?? []).map((tag) => (
                          <Badge 
                            key={tag.id} 
                            variant="light" 
                            tt="none"
                            rightSection={
                              <CloseButton 
                                size="xs" 
                                c="red"
                                variant="transparent" 
                                onClick={() => handleDetachTag(video, tag.id)} 
                              />
                            }
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Button size="xs" variant="outline" onClick={() => handleAttach(video)}>
                        Gán thẻ
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Card>

      {/* Pagination */}
      <Group justify="center">
        <Pagination 
          value={page} 
          onChange={setPage} 
          total={totalPages} 
          disabled={isLoading}
        />
      </Group>

      <Modal 
        opened={attachDialogOpen} 
        onClose={() => setAttachDialogOpen(false)} 
        title={<Title order={4}>Gán thẻ cho video</Title>}
        size="sm"
      >
        <Text size="sm" c="dimmed" mb="md" lineClamp={2}>
          {selectedVideo?.title}
        </Text>

        <Stack gap="md">
          {/* Assigned Tags - Top */}
          <Box>
            <Text size="xs" fw={500} c="dimmed" mb={4}>Thẻ đã gán</Text>
            <Group gap={4} align="flex-start" style={{ minHeight: 32 }}>
              {selectedVideo?.tags && selectedVideo.tags.length > 0 ? (
                selectedVideo.tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="light"
                    tt="none"
                    rightSection={
                      <CloseButton 
                        size="xs" 
                        c="red"
                        variant="transparent" 
                        onClick={() => handleDetachTag(selectedVideo, tag.id)}
                        disabled={detachMutation.isPending}
                      />
                    }
                  >
                    {tag.name}
                  </Badge>
                ))
              ) : (
                <Text size="sm" c="dimmed">Chưa có thẻ nào</Text>
              )}
            </Group>
          </Box>

          {/* Search Bar */}
          <TextInput
            label={<Text size="xs" fw={500} c="dimmed">Thêm thẻ mới</Text>}
            placeholder="Tìm thẻ..."
            value={tagSearch}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagSearch(e.currentTarget.value)}
          />

          {/* Available Tags List */}
          <ScrollArea h={200}>
            <Stack gap={4}>
              {filteredTags.length === 0 ? (
                <Text size="sm" c="dimmed" py="xs">
                  {availableTags.length === 0 ? "Tất cả thẻ đã được gán" : "Không tìm thấy thẻ"}
                </Text>
              ) : (
                filteredTags.map((tag) => (
                  <UnstyledButton
                    key={tag.id}
                    onClick={() => handleAttachTag(tag.id)}
                    disabled={attachMutation.isPending}
                    p="sm"
                    style={{ 
                      borderRadius: 'var(--mantine-radius-md)', 
                      opacity: attachMutation.isPending ? 0.5 : 1
                    }}
                    className="hover:bg-gray-100 dark:hover:bg-dark-6 transition-colors"
                  >
                    <Text size="sm">{tag.name}</Text>
                  </UnstyledButton>
                ))
              )}
            </Stack>
          </ScrollArea>
        </Stack>

        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={() => setAttachDialogOpen(false)}>
            {VI.cancel}
          </Button>
        </Group>
      </Modal>
    </Stack>
  )
}
