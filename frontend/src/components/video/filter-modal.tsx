import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { IconFilter, IconX } from "@tabler/icons-react"
import { VI } from "@/lib/constants"
import { api } from "@/lib/api"
import { Modal, Button, TextInput, Badge, Group, Stack, ScrollArea, Text, ActionIcon } from "@mantine/core"

export interface VideoFilters {
  sortOrder?: "newest" | "oldest" | "alphabetical"
  tagIds?: number[]
}

interface FilterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApply: (filters: VideoFilters) => void
  selectedTagIds?: number[]
}

export function FilterModal({ open, onOpenChange, onApply, selectedTagIds = [] }: FilterModalProps) {
  const [filters, setFilters] = useState<VideoFilters>({ tagIds: selectedTagIds })
  const [tagSearch, setTagSearch] = useState("")
  const [prevOpen, setPrevOpen] = useState(open)

  if (open && !prevOpen) {
    setFilters((prev) => ({ ...prev, tagIds: selectedTagIds }))
    setPrevOpen(true)
  } else if (!open && prevOpen) {
    setPrevOpen(false)
  }

  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: () => api.getTags({ page: "1", limit: "100" }),
  })

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  )

  const handleReset = () => {
    setFilters({})
    setTagSearch("")
  }

  const handleApply = () => {
    onApply(filters)
    onOpenChange(false)
    setTagSearch("")
  }

  return (
    <Modal 
      opened={open} 
      onClose={() => onOpenChange(false)} 
      title={
        <Group gap="xs">
          <IconFilter size={18} />
          <Text fw={500}>{VI.filter}</Text>
        </Group>
      }
    >
      <Stack gap="md">
        <div>
          <Text size="sm" fw={500} mb="xs">Sắp xếp theo ngày đăng</Text>
          <Group gap="xs">
            {(["newest", "oldest", "alphabetical"] as const).map((sort) => (
              <Badge
                key={sort}
                variant={filters.sortOrder === sort ? "filled" : "outline"}
                style={{ cursor: "pointer" }}
                onClick={() => setFilters({ ...filters, sortOrder: sort })}
              >
                {sort === "newest" ? "Mới nhất" : sort === "oldest" ? "Cũ nhất" : "A-Z"}
              </Badge>
            ))}
          </Group>
        </div>

        <div>
          <Text size="sm" fw={500} mb="xs">Thẻ</Text>
          <TextInput
            placeholder="Tìm kiếm thẻ..."
            value={tagSearch}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagSearch(e.currentTarget.value)}
            mb="sm"
          />
          {filters.tagIds && filters.tagIds.length > 0 && (
            <Group gap="xs" mb="sm">
              {filters.tagIds
                .map((id) => tags.find((t) => t.id === id))
                .filter(Boolean)
                .map((tag) => (
                  <Badge
                    key={tag!.id}
                    variant="filled"
                    rightSection={
                      <ActionIcon size="xs" color="blue" radius="xl" variant="transparent" onClick={() => {
                        const current = filters.tagIds || []
                        setFilters({ ...filters, tagIds: current.filter((id) => id !== tag!.id) })
                      }}>
                        <IconX size={10} />
                      </ActionIcon>
                    }
                  >
                    {tag!.name}
                  </Badge>
                ))}
            </Group>
          )}
          <ScrollArea h={150} type="always" offsetScrollbars>
            <Group gap="xs">
              {filteredTags.length === 0 ? (
                <Text size="sm" c="dimmed" w="100%" ta="center" py="sm">
                  Không tìm thấy thẻ
                </Text>
              ) : (
                filteredTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={filters.tagIds?.includes(tag.id) ? "filled" : "outline"}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      const current = filters.tagIds || []
                      const updated = current.includes(tag.id)
                        ? current.filter((id) => id !== tag.id)
                        : [...current, tag.id]
                      setFilters({ ...filters, tagIds: updated })
                    }}
                  >
                    {tag.name}
                  </Badge>
                ))
              )}
            </Group>
          </ScrollArea>
        </div>
      </Stack>

      <Group justify="flex-end" mt="xl">
        <Button variant="default" onClick={handleReset}>
          {VI.reset}
        </Button>
        <Button onClick={handleApply}>{VI.apply}</Button>
      </Group>
    </Modal>
  )
}

