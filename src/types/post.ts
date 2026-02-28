export interface PostMeta {
  title: string
  date: string
  summary: string
  tags: string[]
  draft?: boolean
  slug: string
}

export interface Post extends PostMeta {
  content: string
  html: string
}
