import { useRef, useState, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { IconMovie } from "@tabler/icons-react";
import type { Video } from "@/types";
import { VideoCard } from "./video-card";
import { Loader, Stack, Title, Text, Center, Box } from "@mantine/core";
import { VI } from "@/lib/constants";

interface VideoGridProps {
  videos: Video[];
  selectedVideo: Video | null;
  onSelectVideo: (video: Video) => void;
  isLoading: boolean;
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}

const CARD_GAP = 16;

function getGridColumns(width: number): number {
  if (width === 0) return 1;
  if (width >= 2000) return 8;
  if (width >= 1600) return 6;
  if (width >= 1280) return 5;
  if (width >= 1024) return 4;
  if (width >= 500) return 3;
  if (width >= 450) return 2;
  return 1;
}

export function VideoGrid({
  videos,
  selectedVideo,
  onSelectVideo,
  isLoading,
  onLoadMore,
  hasNextPage,
  isFetchingNextPage,
}: VideoGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!parentRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(parentRef.current);
    return () => observer.disconnect();
  }, []);

  const columns = getGridColumns(containerWidth);
  // Approximate height: (width without gaps and paddings) / columns * (9/16 for aspect ratio) + 90px for text
  const cardWidth =
    containerWidth > 0
      ? (containerWidth - 24 - CARD_GAP * (columns - 1)) / columns
      : 300;
  const estimatedCardHeight =
    containerWidth > 0 ? (cardWidth * 9) / 16 + 96 : 280;

  const rowCount = Math.ceil(videos.length / columns);
  const totalRows = hasNextPage ? rowCount + 1 : rowCount;

  const rowVirtualizer = useVirtualizer({
    count: totalRows,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimatedCardHeight + CARD_GAP,
    overscan: 4,
  });

  // Detect when to load more
  const lastItem = rowVirtualizer.getVirtualItems().at(-1);
  if (
    lastItem &&
    lastItem.index >= rowCount - 1 &&
    hasNextPage &&
    !isFetchingNextPage
  ) {
    onLoadMore?.();
  }

  return (
    <Box ref={parentRef} h="100%" style={{ overflowY: 'auto' }} p="md" pb={32}>
      {isLoading && videos.length === 0 ? (
        <Center h="100%">
          <Loader size="lg" />
        </Center>
      ) : videos.length === 0 ? (
        <Center h="100%">
          <Stack align="center" gap="sm">
            <Box bg="var(--mantine-color-gray-1)" className="dark:bg-dark-6" p="lg" style={{ borderRadius: '50%' }}>
              <IconMovie size={40} className="text-gray-400" />
            </Box>
            <Title order={3}>{VI.noResults}</Title>
            <Text c="dimmed">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </Text>
          </Stack>
        </Center>
      ) : (
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const rowStart = virtualRow.index * columns;
            const rowVideos = videos.slice(rowStart, rowStart + columns);
            const isLoaderRow = virtualRow.index >= rowCount;

            return (
              <div
                key={virtualRow.key}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div
                  className="grid gap-4 items-start"
                  style={{
                    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                  }}
                >
                  {isLoaderRow ? (
                    <div
                      className="flex items-center justify-center"
                      style={{
                        gridColumn: `span ${columns} / span ${columns}`,
                      }}
                    >
                      {isFetchingNextPage ? (
                        <Loader size="sm" />
                      ) : hasNextPage ? (
                        <Text c="dimmed" size="sm">
                          Đang tải...
                        </Text>
                      ) : (
                        <Text c="dimmed" size="sm">
                          Không còn video
                        </Text>
                      )}
                    </div>
                  ) : (
                    rowVideos.map((video) => (
                      <VideoCard
                        key={video.youtube_id}
                        video={video}
                        isSelected={
                          selectedVideo?.youtube_id === video.youtube_id
                        }
                        onClick={() => onSelectVideo(video)}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Box>
  );
}
