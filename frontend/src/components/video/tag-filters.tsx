import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Badge } from "@/components/ui/badge"

interface TagFiltersProps {
  selectedTags: number[]
  onTagSelect: (tagId: number) => void
}

export function TagFilters({ selectedTags, onTagSelect }: TagFiltersProps) {
  const { data: tags = [], isLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: api.getTags,
  })

  if (isLoading) {
    return <div className="h-10" />
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {tags.map((tag) => (
        <Badge
          key={tag.id}
          variant={selectedTags.includes(tag.id) ? "default" : "outline"}
          className="cursor-pointer shrink-0"
          onClick={() => onTagSelect(tag.id)}
        >
          {tag.name}
        </Badge>
      ))}
    </div>
  )
}