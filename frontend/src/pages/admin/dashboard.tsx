import { useQuery } from "@tanstack/react-query"
import { Card, Skeleton, Badge, Title, Text, Group, SimpleGrid, Stack, Box } from "@mantine/core"
import { IconMovie, IconTags, IconCalendar, IconCalendarEvent } from "@tabler/icons-react"
import { api } from "@/lib/api"
import { VI } from "@/lib/constants"
import type { Video, Tag } from "@/types"

function StatCard({ icon: Icon, label, value, loading }: { icon: any; label: string; value: number; loading: boolean }) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Text size="sm" fw={500} c="dimmed">
          {label}
        </Text>
        <Icon size={20} className="text-gray-400" />
      </Group>
      {loading ? (
        <Skeleton height={32} width={80} />
      ) : (
        <Text size="xl" fw={700}>
          {value}
        </Text>
      )}
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

  const videos: Video[] = videosData?.data ?? []
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
      <Stack gap="xl">
        <Title order={2}>Dashboard</Title>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
          <StatCard icon={IconMovie} label={VI.totalVideos} value={totalVideos} loading={videosLoading} />
          <StatCard icon={IconTags} label={VI.totalTags} value={totalTags} loading={tagsLoading} />
          <StatCard icon={IconCalendar} label={VI.thisWeek} value={thisWeek} loading={videosLoading} />
          <StatCard icon={IconCalendarEvent} label={VI.thisMonth} value={thisMonth} loading={videosLoading} />
        </SimpleGrid>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs" mb="md">
            <Title order={4}>Top Tags</Title>
          </Card.Section>
          
          <Box>
            {tagsLoading ? (
              <Stack gap="sm">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} height={56} width="100%" />
                ))}
              </Stack>
            ) : topTags.length === 0 ? (
              <Stack align="center" justify="center" h={100} gap="xs">
                <IconTags size={24} className="text-gray-400" />
                <Text c="dimmed">{VI.noData}</Text>
              </Stack>
            ) : (
              <Stack gap="sm">
                {topTags.map(({ tag, count }) => (
                  <Group key={tag.id} justify="space-between" p="sm" style={{ border: '1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-4))', borderRadius: 'var(--mantine-radius-md)' }}>
                    <Text fw={500}>{tag.name}</Text>
                    <Badge variant="light">{count} videos</Badge>
                  </Group>
                ))}
              </Stack>
            )}
          </Box>
        </Card>
      </Stack>
    )
}
