import MarkdownIt from 'markdown-it'
import { computed } from 'vue'
import { resolvePhoto } from './photos'
import type { Post } from '../types/post'

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
})

const defaultImageRenderer = markdown.renderer.rules.image
markdown.renderer.rules.image = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  if (!token) {
    return ''
  }

  const source = token.attrGet('src')
  if (source && source.startsWith('photo:')) {
    const photo = resolvePhoto(source)
    if (photo) {
      token.attrSet('src', photo.src)

      if (photo.width) {
        token.attrSet('width', String(photo.width))
      }

      if (photo.height) {
        token.attrSet('height', String(photo.height))
      }
    }
  }

  token.attrSet('loading', 'lazy')
  token.attrSet('decoding', 'async')
  token.attrJoin('class', 'post-photo')

  if (defaultImageRenderer) {
    return defaultImageRenderer(tokens, idx, options, env, self)
  }

  return self.renderToken(tokens, idx, options)
}

const rawModules = import.meta.glob('../content/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

function toSlug(path: string): string {
  const match = path.match(/\/([^/]+)\.md$/)
  return match?.[1] ?? path
}

function normalizeTags(tags: unknown): string[] {
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean)
  }

  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
  }

  return []
}

function toTimestamp(date: string): number {
  const timestamp = new Date(date).getTime()
  return Number.isNaN(timestamp) ? 0 : timestamp
}

function parseScalar(value: string): unknown {
  const trimmed = value.trim()

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }

  if (trimmed === 'true') {
    return true
  }

  if (trimmed === 'false') {
    return false
  }

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed
      .slice(1, -1)
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return trimmed
}

function parseFrontmatter(rawContent: string): {
  data: Record<string, unknown>
  content: string
} {
  const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)

  if (!match) {
    return { data: {}, content: rawContent }
  }

  const frontmatterBlock = match[1] ?? ''
  const content = match[2] ?? ''
  const data: Record<string, unknown> = {}
  const lines = frontmatterBlock.split(/\r?\n/)

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]

    if (line === undefined || !line.trim()) {
      continue
    }

    const keyMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!keyMatch) {
      continue
    }

    const key = keyMatch[1]
    const rawValue = keyMatch[2] ?? ''

    if (!key) {
      continue
    }

    if (rawValue === '') {
      const listItems: string[] = []

      for (let childIndex = index + 1; childIndex < lines.length; childIndex += 1) {
        const childLine = lines[childIndex]
        if (childLine === undefined) {
          break
        }

        const listMatch = childLine.match(/^\s*-\s+(.*)$/)

        if (!listMatch) {
          break
        }

        const listValue = listMatch[1]
        if (listValue === undefined) {
          continue
        }

        listItems.push(String(parseScalar(listValue)))
        index = childIndex
      }

      data[key] = listItems
      continue
    }

    data[key] = parseScalar(rawValue)
  }

  return { data, content }
}

function parsePosts(): Post[] {
  return Object.entries(rawModules)
    .map(([path, content]) => {
      const { data, content: markdownContent } = parseFrontmatter(content)
      const slug = toSlug(path)
      const title = typeof data.title === 'string' ? data.title : slug
      const date = typeof data.date === 'string' ? data.date : '1970-01-01'
      const summary = typeof data.summary === 'string' ? data.summary : ''
      const draft = Boolean(data.draft)
      const tags = normalizeTags(data.tags)

      return {
        title,
        date,
        summary,
        tags,
        draft,
        slug,
        content: markdownContent,
        html: markdown.render(markdownContent),
      }
    })
    .sort((a, b) => toTimestamp(b.date) - toTimestamp(a.date))
}

const allPostsSource = parsePosts()

export function usePosts() {
  const allPosts = computed(() => allPostsSource)

  const publishedPosts = computed(() =>
    allPosts.value.filter((post) => !post.draft),
  )

  function getPostBySlug(slug: string): Post | undefined {
    return allPosts.value.find((post) => post.slug === slug && !post.draft)
  }

  function getPostsByTag(tag: string): Post[] {
    return publishedPosts.value.filter((post) => post.tags.includes(tag))
  }

  return {
    allPosts,
    publishedPosts,
    getPostBySlug,
    getPostsByTag,
  }
}
