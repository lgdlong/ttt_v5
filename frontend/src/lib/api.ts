import type { Tag, Video, VideoApiResponse } from "@/types"

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080"

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const json = await response.json()
  // Handle wrapped response format
  if (json && typeof json === "object" && "data" in json) {
    return json as T
  }
  return json as T
}

export const api = {
  getVideos: (params?: Record<string, string>): Promise<VideoApiResponse> => {
    const searchParams = params ? `?${new URLSearchParams(params)}` : ""
    return fetchApi<VideoApiResponse>(`/api/v1/videos${searchParams}`)
  },

  getTags: (params?: Record<string, string>): Promise<Tag[]> => {
    const searchParams = params ? `?${new URLSearchParams(params)}` : ""
    return fetchApi<Tag[]>(`/api/v1/tags${searchParams}`).then((res) => {
      // Handle wrapped response format for tags
      if (res && typeof res === "object" && "data" in res) {
        return (res as { data: Tag[] }).data
      }
      return res
    })
  },

  searchTags: (query: string): Promise<Tag[]> => {
    return fetchApi<Tag[]>(`/api/v1/tags/search?q=${encodeURIComponent(query)}`)
  },

  getVideosByTag: (tagId: number): Promise<Video[]> => {
    return fetchApi<Video[]>(`/api/v1/tags/${tagId}/videos`)
  },

  createTag: (data: { name: string }): Promise<Tag> => {
    return fetchApi<Tag>("/api/v1/admin/tags", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  updateTag: (id: number, data: { name: string }): Promise<Tag> => {
    return fetchApi<Tag>(`/api/v1/admin/tags/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  deleteTag: (id: number): Promise<void> => {
    return fetchApi<void>(`/api/v1/admin/tags/${id}`, {
      method: "DELETE",
    })
  },

  attachTag: (youtubeId: string, tagId: number): Promise<void> => {
    return fetchApi<void>(`/api/v1/admin/videos/${youtubeId}/tags/${tagId}`, {
      method: "POST",
    })
  },

  detachTag: (youtubeId: string, tagId: number): Promise<void> => {
    return fetchApi<void>(`/api/v1/admin/videos/${youtubeId}/tags/${tagId}`, {
      method: "DELETE",
    })
  },
}
