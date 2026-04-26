import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Video } from "@/types";
import { api } from "@/lib/api";
import { FilterSidebar } from "@/components/video/filter-sidebar";
import type { VideoFilters } from "@/components/video/filter-sidebar";
import { VideoGrid } from "@/components/video/video-grid";
import { VideoDetailPanel } from "@/components/video/video-detail-panel";
import { ErrorBoundary } from "@/components/error-boundary";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const PAGE_SIZE = 20;

export function VideoBrowserPage() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [filters, setFilters] = useState<VideoFilters>({});
  const [isSearchFocused, setIsSearchFocused] = useState(false);
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
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-full overflow-hidden p-4 md:p-6 gap-4">
          <div className="hidden lg:block shrink-0">
            <FilterSidebar
              onApply={handleFilterApply}
              onClearAll={handleClearFilters}
              selectedTagIds={selectedTags}
            />
          </div>

          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetContent
              side="left"
              className="p-0 border-r w-[280px] sm:w-[320px]"
            >
              <div className="sr-only">
                <SheetTitle>Filters</SheetTitle>
              </div>
              <FilterSidebar
                onApply={(opts) => {
                  handleFilterApply(opts);
                  setIsFilterOpen(false);
                }}
                onClearAll={handleClearFilters}
                selectedTagIds={selectedTags}
                isOpen={isFilterOpen}
                className="w-full border-none rounded-none"
              />
            </SheetContent>
          </Sheet>

          <SidebarInset className="flex flex-col flex-1 overflow-hidden rounded-lg">
            {/* Search Header - Full Width */}
            <div className="flex-none bg-transparent backdrop-blur h-14 sm:h-16 flex items-center shrink-0 border-b lg:border-none">
              <div className="flex h-full w-full items-center gap-3 px-0 lg:px-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden shrink-0 h-10 w-10 relative cursor-pointer"
                  onClick={() => setIsFilterOpen(true)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {hasActiveFilters && (
                    <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-primary" />
                  )}
                </Button>
                <div
                  className={cn(
                    "flex-1 flex items-center gap-2 rounded-lg border bg-background px-4 py-2.5 transition-colors h-10",
                    isSearchFocused && "border-primary",
                  )}
                >
                  <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm video..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground w-full min-w-0"
                  />
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 h-full overflow-hidden relative mt-4 lg:mt-0">
              <div className="flex-1 h-full overflow-hidden">
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
              </div>

              {/* Video Detail Panel - Right Side Desktop */}
              <div
                className={cn(
                  "hidden 2xl:block w-[420px] flex-none border-l bg-card overflow-hidden transition-all duration-300",
                  !selectedVideo && "invisible w-0",
                )}
              >
                {selectedVideo && <VideoDetailPanel video={selectedVideo} />}
              </div>

              {/* Video Detail Sheet for Mobile / Tablet */}
              <Sheet
                open={isDetailOpen && !!selectedVideo}
                modal={false}
                onOpenChange={(open) => {
                  setIsDetailOpen(open);
                  if (!open) setSelectedVideo(null);
                }}
              >
                <SheetContent
                  side="bottom"
                  className="h-[65vh] p-0 w-full xl:hidden"
                >
                  <div className="sr-only">
                    <SheetTitle>Detail</SheetTitle>
                  </div>
                  {selectedVideo && <VideoDetailPanel video={selectedVideo} />}
                </SheetContent>
              </Sheet>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ErrorBoundary>
  );
}
