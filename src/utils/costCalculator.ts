import { CostEstimate } from '../types'
import { MODELS } from '../constants/models'

export const calculateEstimatedCost = (selectedModel: string): CostEstimate => {
  const model = MODELS.find(m => m.id === selectedModel)
  if (!model) return { total: 0, description: '', dangerLevel: 'safe' as const }

  // Updated estimate: ~1800 words per chapter * 10 chapters = 18k words
  // More accurate estimate: 1 word ≈ 1.3 tokens
  const estimatedInputTokens = 2500 // prompts + context
  const estimatedOutputTokens = 25000 // ~18k words output (better quality, longer content)
  
  const inputCost = (estimatedInputTokens / 1000000) * model.inputCost
  const outputCost = (estimatedOutputTokens / 1000000) * model.outputCost
  const total = inputCost + outputCost

  let description = ''
  if (total < 0.05) {
    description = 'Ultra-cheap - Under 5¢'
  } else if (total < 0.15) {
    description = 'Very affordable - Under 15¢'
  } else if (total < 0.50) {
    description = 'Reasonable cost - Under 50¢'
  } else if (total < 1.50) {
    description = 'Moderate cost - $' + total.toFixed(2)
  } else if (total < 4.00) {
    description = 'Expensive - $' + total.toFixed(2)
  } else {
    description = 'VERY EXPENSIVE - $' + total.toFixed(2)
  }

  return { total, description, dangerLevel: model.dangerLevel }
}