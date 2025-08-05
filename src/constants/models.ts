import { ModelOption } from '../types'

export const MODELS: ModelOption[] = [
  {
    id: 'gpt-4o-mini',
    name: 'gpt-4o-mini',
    displayName: 'GPT-4o Mini',
    inputCost: 0.15,
    outputCost: 0.60,
    description: 'Best value - Excellent quality, very cheap',
    dangerLevel: 'safe'
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'gpt-3.5-turbo',
    displayName: 'GPT-3.5 Turbo',
    inputCost: 0.50,
    outputCost: 1.50,
    description: 'Fast & cost-effective - Great for basic tasks',
    dangerLevel: 'safe'
  },
  {
    id: 'gpt-4o',
    name: 'gpt-4o',
    displayName: 'GPT-4o',
    inputCost: 5.00,
    outputCost: 15.00,
    description: 'Multimodal powerhouse - Text, images & audio',
    dangerLevel: 'moderate'
  },
  {
    id: 'gpt-4-turbo',
    name: 'gpt-4-turbo',
    displayName: 'GPT-4 Turbo',
    inputCost: 10.00,
    outputCost: 30.00,
    description: 'Advanced reasoning - 128K context window',
    dangerLevel: 'expensive'
  },
  {
    id: 'gpt-4',
    name: 'gpt-4',
    displayName: 'GPT-4 (128K Context)',
    inputCost: 60.00,
    outputCost: 120.00,
    description: 'Extended context - Handle very long documents',
    dangerLevel: 'danger'
  }
]