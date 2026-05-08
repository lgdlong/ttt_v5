import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { IconSearch, IconAdjustmentsHorizontal } from "@tabler/icons-react";
import type { Video } from "@/types";
import { api } from "@/lib/api";
import { FilterSidebar } from "@/components/video/filter-sidebar";
import type { VideoFilters } from "@/components/video/filter-sidebar";
import { VideoGrid } from "@/components/video/video-grid";
import { VideoDetailPanel } from "@/components/video/video-detail-panel";
import { ErrorBoundary } from "@/components/error-boundary";
import { Drawer, ActionIcon, TextInput, Box, Group, Indicator } from "@mantine/core";

const PAGE_SIZE = 20;

export function VideoBrowserPage() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [filters, setFilters] = useState<VideoFilters>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const buildQueryParams = (page: number) => {
    const params: Record<string, string> = {
      page: String(page),
      limit: String(PAGE_SIZE),
    };
    if (searchTerm) params.q = searchTerm;
    if (selectedTags.length > 0) params.tag_ids = selectedTags.join("-");
    if (filters.sortOrder) {
      if (filters.sortOrder === "newest") {
        params.sort = "upload_date";
        params.order = "desc";
      } else if (filters.sortOrder === "oldest") {
        params.sort = "upload_date";
        params.order = "asc";
      } else if (filters.sortOrder === "alphabetical") {
        params.sort = "title";
        params.order = "asc";
      }
    }
    return params;
  };

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["videos", searchTerm, filters, selectedTags],
      queryFn: ({ pageParam }) => api.getVideos(buildQueryParams(pageParam)),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const nextPage = lastPage.meta.page + 1;
        return nextPage <= lastPage.meta.total_pages ? nextPage : undefined;
      },
    });

  const videos = data?.pages.flatMap((page) => page.data) ?? [];

  const handleFilterApply = (newFilters: VideoFilters) => {
    if (newFilters.tagIds) {
      setSelectedTags(newFilters.tagIds);
    }
    setFilters(newFilters);
  };

  const hasActiveFilters =
    searchTerm || selectedTags.length > 0 || filters.sortOrder;

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedTags([]);
    setFilters({});
  };

  return (
    <ErrorBoundary>
      <Box style={{ display: "flex", height: "100vh", width: "100%", overflow: "hidden", gap: "var(--mantine-spacing-md)", padding: "var(--mantine-spacing-md)" }}>
        <Box display={{ base: "none", lg: "block" }} style={{ flexShrink: 0 }}>
          <FilterSidebar
            onApply={handleFilterApply}
            onClearAll={handleClearFilters}
            selectedTagIds={selectedTags}
          />
        </Box>

        <Drawer
          opened={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          position="left"
          size="sm"
          title="Filters"
          withCloseButton={false}
          styles={{ header: { display: "none" }, body: { padding: 0, height: "100%" } }}
        >
          <FilterSidebar
            onApply={(opts) => {
              handleFilterApply(opts);
              setIsFilterOpen(false);
            }}
            onClearAll={handleClearFilters}
            selectedTagIds={selectedTags}
            isOpen={isFilterOpen}
            className="w-full h-full border-none rounded-none"
          />
        </Drawer>

        <Box style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", borderRadius: "var(--mantine-radius-md)" }}>
          {/* Search Header */}
          <Box style={{ flexShrink: 0, height: 64, display: "flex", alignItems: "center", borderBottom: "1px solid var(--mantine-color-gray-2)" }} className="dark:border-dark-4 lg:border-none">
            <Group w="100%" gap="md" wrap="nowrap">
              <Box display={{ base: "block", lg: "none" }} style={{ flexShrink: 0 }}>
                <Indicator disabled={!hasActiveFilters} color="var(--mantine-primary-color-filled)">
                  <ActionIcon
                    variant="default"
                    size="lg"
                    onClick={() => setIsFilterOpen(true)}
                  >
                    <IconAdjustmentsHorizontal size={20} />
                  </ActionIcon>
                </Indicator>
              </Box>
              
              <TextInput
                placeholder="Tìm kiếm video..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.currentTarget.value)}
                leftSection={<IconSearch size={18} className="text-gray-400" />}
                w="100%"
                size="md"
              />
            </Group>
          </Box>

          {/* Main Content */}
          <Box style={{ display: "flex", flex: 1, height: "100%", overflow: "hidden", position: "relative", marginTop: "var(--mantine-spacing-md)" }} className="lg:mt-0">
            <Box style={{ flex: 1, height: "100%", overflow: "hidden" }}>
              <VideoGrid
                videos={videos}
                selectedVideo={selectedVideo}
                onSelectVideo={(video) => {
                  setSelectedVideo(video);
                  setIsDetailOpen(true);
                }}
                isLoading={isLoading}
                onLoadMore={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
              />
            </Box>

            {/* Video Detail Panel - Right Side Desktop */}
            <Box
              display={{ base: "none", xl: "block" }}
              style={{
                width: selectedVideo ? 420 : 0,
                flexShrink: 0,
                borderLeft: selectedVideo ? "1px solid var(--mantine-color-gray-2)" : "none",
                backgroundColor: "var(--mantine-color-body)",
                overflow: "hidden",
                transition: "width 300ms ease, visibility 300ms ease",
                visibility: selectedVideo ? "visible" : "hidden",
              }}
              className="dark:border-dark-4"
            >
              {selectedVideo && <VideoDetailPanel video={selectedVideo} onClose={() => setIsDetailOpen(false)} />}
            </Box>

            {/* Video Detail Sheet for Mobile / Tablet */}
            <Drawer
              opened={isDetailOpen && !!selectedVideo}
              onClose={() => {
                setIsDetailOpen(false);
                setSelectedVideo(null);
              }}
              position="bottom"
              size="65%"
              withCloseButton={false}
              styles={{ body: { padding: 0, height: "100%" } }}
            >
              {selectedVideo && <VideoDetailPanel video={selectedVideo} onClose={() => setIsDetailOpen(false)} />}
            </Drawer>
          </Box>
        </Box>
      </Box>
    </ErrorBoundary>
  );
}
