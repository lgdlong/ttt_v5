export interface Video {
  youtube_id: string
  title: string
  author: string
  thumbnail_url: string
  duration_seconds: number
  upload_date: string
  tags: Tag[]
}

export interface Tag {
  id: number
  name: string
}

export interface VideoApiResponse {
  data: Video[]
  meta: {
    page: number
    page_size: number
    total_count: number
    total_pages: number
  }
}
