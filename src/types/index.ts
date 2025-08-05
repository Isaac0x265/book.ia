export interface Chapter {
  title: string
  content: string
}

export interface ModelOption {
  id: string
  name: string
  displayName: string
  inputCost: number // per 1M tokens
  outputCost: number // per 1M tokens
  description: string
  dangerLevel: 'safe' | 'moderate' | 'expensive' | 'danger'
}

export type Mode = 'ebook' | 'chapter'
export type Theme = 'dark' | 'light'
export type ViewMode = 'input' | 'preview'

export interface Progress {
  current: number
  total: number
}

export interface CostEstimate {
  total: number
  description: string
  dangerLevel: ModelOption['dangerLevel']
}