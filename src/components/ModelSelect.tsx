import { ModelOption } from '../types'
import { calculateEstimatedCost } from '../utils/costCalculator'

interface ModelSelectProps {
  selectedModel: string
  onModelChange: (model: string) => void
  models: ModelOption[]
  disabled?: boolean
}

export const ModelSelect = ({ selectedModel, onModelChange, models, disabled }: ModelSelectProps) => {
  const costEstimate = calculateEstimatedCost(selectedModel)

  return (
    <div className="form-group">
      <label htmlFor="model">AI Model</label>
      <select
        id="model"
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value)}
        disabled={disabled}
        className="model-select"
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.displayName} - {model.description}
          </option>
        ))}
      </select>
      <div className={`cost-estimate ${costEstimate.dangerLevel}`}>
        <span className="cost-text">
          Estimated cost: {costEstimate.description}
        </span>
        {costEstimate.dangerLevel === 'danger' && (
          <span className="warning-text">⚠️ HIGH COST WARNING</span>
        )}
        {costEstimate.dangerLevel === 'expensive' && (
          <span className="warning-text">💰 Expensive model</span>
        )}
      </div>
    </div>
  )
}