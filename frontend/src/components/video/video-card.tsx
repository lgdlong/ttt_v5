import type { Video } from "@/types";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { UnstyledButton, Box, Text, Image, Badge, Stack } from "@mantine/core";

interface VideoCardProps {
  video: Video;
  isSelected: boolean;
  onClick: () => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function VideoCard({ video, isSelected, onClick }: VideoCardProps) {
  return (
    <UnstyledButton
      w="100%"
      onClick={onClick}
      style={{
        opacity: isSelected ? 1 : 0.9,
        transition: "opacity 150ms ease, transform 150ms ease",
      }}
      className="hover:opacity-100"
    >
      <Box
        pos="relative"
        w="100%"
        style={{
          aspectRatio: "16/9",
          backgroundColor: "var(--mantine-color-gray-1)",
          overflow: "hidden",
          borderRadius: "var(--mantine-radius-md)",
          boxShadow: isSelected ? "0 0 0 2px var(--mantine-color-violet-filled)" : "none",
        }}
        className="dark:bg-dark-6"
      >
        {video.thumbnail_url ? (
          <Image
            src={video.thumbnail_url}
            alt={video.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Box w="100%" h="100%" display="flex" style={{ alignItems: "center", justifyContent: "center" }} bg="var(--mantine-color-gray-2)" className="dark:bg-dark-7">
            <IconPlayerPlayFilled size={32} className="text-gray-400" />
          </Box>
        )}
        <Badge
          color="dark"
          variant="filled"
          size="sm"
          radius="sm"
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
          }}
        >
          {formatDuration(video.duration_seconds)}
        </Badge>
      </Box>
      <Stack gap={2} mt="xs" px={4}>
        <Text
          size="sm"
          fw={500}
          lineClamp={2}
          c={isSelected ? "violet" : "inherit"}
          style={{ lineHeight: 1.3 }}
        >
          {video.title}
        </Text>
        <Text size="xs" c="dimmed">{video.author}</Text>
        <Text size="xs" c="dimmed" style={{ opacity: 0.7 }}>
          {formatDate(video.upload_date)}
        </Text>
      </Stack>
    </UnstyledButton>
  );
}
