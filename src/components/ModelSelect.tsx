import { Model } from '../types'

interface ModelSelectProps {
  selectedModel: string
  onModelChange: (model: string) => void
  models: Model[]
  disabled?: boolean
}

export const ModelSelect = ({ selectedModel, onModelChange, models, disabled }: ModelSelectProps) => {
  return (
    <div className="form-group">
      <label htmlFor="model">AI Model</label>
      <select
        id="model"
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value)}
        disabled={disabled}
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name} - {model.description}
          </option>
        ))}
      </select>
    </div>
  )
}