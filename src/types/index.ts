export interface Chapter {
  title: string
  content: string
}

export interface Model {
  id: string
  name: string
  description: string
}

export type Mode = 'ebook' | 'chapter'
export type Theme = 'dark' | 'light'
export type ViewMode = 'input' | 'preview'

export interface Progress {
  current: number
  total: number
}