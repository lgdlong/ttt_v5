import type { Video } from "@/types"
import { VI } from "@/lib/constants"
import { Badge, Button, ScrollArea, Image, Text, Stack, Group, Box, Title } from "@mantine/core"
import { IconExternalLink, IconMovie } from "@tabler/icons-react"

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
      <Stack h="100%" align="center" justify="center" p="xl" style={{ textAlign: "center" }}>
        <Box bg="var(--mantine-color-gray-1)" className="dark:bg-dark-6" p="lg" style={{ borderRadius: '50%', marginBottom: 'var(--mantine-spacing-md)' }}>
          <IconMovie size={32} className="text-gray-400" />
        </Box>
        <Text c="dimmed">{VI.selectVideo}</Text>
      </Stack>
    )
  }

  return (
    <Stack h="100%" gap={0}>
      <Box w="100%" style={{ aspectRatio: "16/9", backgroundColor: "var(--mantine-color-gray-1)", overflow: "hidden" }} className="dark:bg-dark-6">
        {video.thumbnail_url ? (
          <Image
            src={video.thumbnail_url}
            alt={video.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Stack h="100%" align="center" justify="center" bg="var(--mantine-color-gray-2)" className="dark:bg-dark-7">
            <IconMovie size={64} className="text-gray-400" />
          </Stack>
        )}
      </Box>

      <ScrollArea style={{ flex: 1 }} p="xl" offsetScrollbars>
        <Stack gap="xl">
          <Title order={2} style={{ lineHeight: 1.2 }}>{video.title}</Title>

          <Stack gap="xs">
            <Group gap="sm" wrap="nowrap">
              <Text size="sm" c="dimmed" style={{ flexShrink: 0 }}>Tên kênh:</Text>
              <Text size="sm" fw={500}>{video.author}</Text>
            </Group>
            <Group gap="sm" wrap="nowrap">
              <Text size="sm" c="dimmed" style={{ flexShrink: 0 }}>Ngày đăng:</Text>
              <Text size="sm" fw={500}>{formatDate(video.upload_date)}</Text>
            </Group>
            <Group gap="sm" wrap="nowrap">
              <Text size="sm" c="dimmed" style={{ flexShrink: 0 }}>Thời lượng:</Text>
              <Text size="sm" fw={500}>{formatDuration(video.duration_seconds)}</Text>
            </Group>
          </Stack>

          {video.tags && video.tags.length > 0 && (
            <Group gap="xs">
              {video.tags.map((tag) => (
                <Badge key={tag.id} variant="light" size="sm">
                  {tag.name}
                </Badge>
              ))}
            </Group>
          )}

          <Group gap="xs" display={{ base: 'flex', xl: 'none' }}>
            <Button
              style={{ flex: 1 }}
              leftSection={<IconExternalLink size={16} />}
              onClick={() => window.open(`https://youtube.com/watch?v=${video.youtube_id}`, "_blank")}
            >
              {VI.watchOnYoutube}
            </Button>
            {onClose && (
              <Button
                variant="outline"
                style={{ flex: 0.5 }}
                onClick={onClose}
              >
                {VI.close}
              </Button>
            )}
          </Group>
          <Button
            display={{ base: 'none', xl: 'flex' }}
            fullWidth
            leftSection={<IconExternalLink size={16} />}
            onClick={() => window.open(`https://youtube.com/watch?v=${video.youtube_id}`, "_blank")}
          >
            {VI.watchOnYoutube}
          </Button>
        </Stack>
      </ScrollArea>
    </Stack>
  )
}