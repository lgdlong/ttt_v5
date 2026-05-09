import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Badge, Group } from "@mantine/core"

interface TagFiltersProps {
  selectedTags: number[]
  onTagSelect: (tagId: number) => void
}

export function TagFilters({ selectedTags, onTagSelect }: TagFiltersProps) {
  const { data: tags = [], isLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: () => api.getTags({ page: "1", limit: "100" }),
  })

  if (isLoading) {
    return <div className="h-10" />
  }

  return (
    <Group gap="xs" style={{ overflowX: 'auto', flexWrap: 'nowrap', paddingBottom: '8px' }}>
      {tags.map((tag) => (
        <Badge
          key={tag.id}
          variant={selectedTags.includes(tag.id) ? "light" : "default"}
          style={{ cursor: "pointer", flexShrink: 0 }}
          onClick={() => onTagSelect(tag.id)}
          tt="none"
        >
          {tag.name}
        </Badge>
      ))}
    </Group>
  )
}