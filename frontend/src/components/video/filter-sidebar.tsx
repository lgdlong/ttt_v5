import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  IconArrowsSort,
  IconArrowUp,
  IconArrowDown,
  IconSearch,
  IconX,
  IconCheck,
  IconAdjustmentsHorizontal,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { VI } from "@/lib/constants";
import { Button, TextInput, Badge, Group, Stack, Text, Divider, ScrollArea, Box, UnstyledButton, ActionIcon } from "@mantine/core";

export interface VideoFilters {
  sortOrder?: "newest" | "oldest" | "alphabetical";
  tagIds?: number[];
}

interface FilterSidebarProps {
  onApply: (filters: VideoFilters) => void;
  onClearAll?: () => void;
  selectedTagIds?: number[];
  isOpen?: boolean;
  className?: string;
}

const sortOptions = [
  { value: "newest", label: "Mới nhất", Icon: IconArrowDown },
  { value: "oldest", label: "Cũ nhất", Icon: IconArrowUp },
  { value: "alphabetical", label: "A-Z", Icon: IconArrowsSort },
] as const;

export function FilterSidebar({
  onApply,
  onClearAll,
  selectedTagIds = [],
  isOpen = true,
  className,
}: FilterSidebarProps) {
  const [filters, setFilters] = useState<VideoFilters>({});
  const [tagSearch, setTagSearch] = useState("");

  useEffect(() => {
    if (isOpen && selectedTagIds.length > 0) {
      setFilters((prev) => ({ ...prev, tagIds: selectedTagIds }));
    }
  }, [isOpen, selectedTagIds]);

  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: () => api.getTags({ page: "1", limit: "100" }),
  });

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase()),
  );

  const handleReset = () => {
    setFilters({});
    setTagSearch("");
    onApply({});
    onClearAll?.();
  };

  const handleApply = () => {
    onApply(filters);
  };

  const selectedTags = filters.tagIds || [];

  return (
    <Box
      bg="light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))"
      className={cn(
        "w-full lg:w-64 flex-none flex flex-col rounded-lg overflow-hidden h-full",
        className,
      )}
      style={{ border: '1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-4))' }}
    >
      <Group justify="space-between" px="md" py="sm" style={{ borderBottom: '1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-4))' }} className="shrink-0">
        <Group gap="xs">
          <IconAdjustmentsHorizontal size={18} className="text-gray-500" />
          <Text fw={600} size="sm">{VI.filter}</Text>
        </Group>
      </Group>

      <ScrollArea className="flex-1 px-md py-sm mb-xs">
        <Stack gap="md" p="md">
          <Box>
            <Text size="xs" fw={500} tt="uppercase" c="dimmed" mb="xs">Sắp xếp</Text>
            <Stack gap="xs">
              {sortOptions.map((option) => {
                const isSelected = filters.sortOrder === option.value;
                return (
                  <UnstyledButton
                    key={option.value}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        sortOrder: isSelected ? undefined : option.value,
                      })
                    }
                    p="xs"
                    style={{ borderRadius: 'var(--mantine-radius-md)' }}
                    bg={isSelected ? 'var(--mantine-color-violet-light)' : 'transparent'}
                    className="transition-colors"
                    style={{
                      borderRadius: 'var(--mantine-radius-md)',
                      backgroundColor: isSelected ? 'var(--mantine-color-violet-light)' : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--mantine-color-default-hover)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Group justify="space-between" wrap="nowrap">
                      <Group gap="sm" wrap="nowrap">
                        <option.Icon size={16} className={isSelected ? 'text-violet-600' : 'text-gray-500'} />
                        <Text size="sm" fw={isSelected ? 500 : 400} c={isSelected ? 'violet' : 'inherit'}>{option.label}</Text>
                      </Group>
                      {isSelected && <IconCheck size={16} className="text-violet-600" />}
                    </Group>
                  </UnstyledButton>
                );
              })}
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Group mb="xs" justify="space-between">
              <Text size="xs" fw={500} tt="uppercase" c="dimmed">Bộ lọc theo thẻ</Text>
              {selectedTags.length > 0 && (
                <Badge variant="light" size="xs">{selectedTags.length}</Badge>
              )}
            </Group>

            <TextInput
              placeholder="Tìm thẻ..."
              value={tagSearch}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagSearch(e.currentTarget.value)}
              leftSection={<IconSearch size={14} className="text-gray-500" />}
              size="sm"
              mb="sm"
            />

            {selectedTags.length > 0 && (
              <Box mb="sm" p="xs" bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))" style={{ borderRadius: 'var(--mantine-radius-md)' }}>
                <Group gap="xs" mb="xs">
                  {selectedTags
                    .map((id) => tags.find((t) => t.id === id))
                    .filter(Boolean)
                    .map((tag) => (
                      <Badge
                        key={tag!.id}
                        variant="filled"
                        tt="none"
                        rightSection={
                          <ActionIcon size="xs" color="blue" radius="xl" variant="transparent" onClick={() => {
                            const current = filters.tagIds || [];
                            setFilters({
                              ...filters,
                              tagIds: current.filter((id) => id !== tag!.id),
                            });
                          }}>
                            <IconX size={10} />
                          </ActionIcon>
                        }
                      >
                        {tag!.name}
                      </Badge>
                    ))}
                </Group>
                <UnstyledButton
                  onClick={handleReset}
                >
                  <Text size="xs" c="dimmed">Xóa tất cả</Text>
                </UnstyledButton>
              </Box>
            )}

            <ScrollArea h={300} type="always" offsetScrollbars>
              <Stack gap={4}>
                {filteredTags.length === 0 ? (
                  <Text size="sm" c="dimmed" ta="center" py="xl">
                    Không tìm thấy thẻ
                  </Text>
                ) : (
                  filteredTags.map((tag) => {
                    const isSelected = filters.tagIds?.includes(tag.id);
                    return (
                      <UnstyledButton
                        key={tag.id}
                        onClick={() => {
                          const current = filters.tagIds || [];
                          const updated = current.includes(tag.id)
                            ? current.filter((id) => id !== tag.id)
                            : [...current, tag.id];
                          setFilters({ ...filters, tagIds: updated });
                        }}
                        p="xs"
                        style={{ borderRadius: 'var(--mantine-radius-md)' }}
                        bg={isSelected ? 'var(--mantine-color-violet-light)' : 'transparent'}
                        className="transition-colors"
                        style={{
                          borderRadius: 'var(--mantine-radius-md)',
                          backgroundColor: isSelected ? 'var(--mantine-color-violet-light)' : 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--mantine-color-default-hover)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <Group wrap="nowrap" gap="sm">
                          <Box
                            w={16} h={16}
                            style={{ 
                              borderRadius: 4, 
                              border: isSelected ? '1px solid var(--mantine-color-violet-filled)' : '1px solid var(--mantine-color-gray-4)',
                              backgroundColor: isSelected ? 'var(--mantine-color-violet-filled)' : 'transparent',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                          >
                            {isSelected && <IconCheck size={12} color="white" />}
                          </Box>
                          <Text size="sm" c={isSelected ? 'violet' : 'inherit'}>{tag.name}</Text>
                        </Group>
                      </UnstyledButton>
                    );
                  })
                )}
              </Stack>
            </ScrollArea>
          </Box>
        </Stack>
      </ScrollArea>

      <Group p="sm" grow style={{ borderTop: '1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-4))' }} className="shrink-0">
        <Button variant="default" onClick={handleReset} size="sm">
          Đặt lại
        </Button>
        <Button onClick={handleApply} size="sm">
          Áp dụng
        </Button>
      </Group>
    </Box>
  );
}
