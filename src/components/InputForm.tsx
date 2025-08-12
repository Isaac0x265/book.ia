import { Loader2 } from 'lucide-react'
import type { Mode, Progress as ProgressType } from '../types'
import { MODELS } from '../constants/models'
import { ModelSelect } from './ModelSelect'
import { Progress } from './Progress'

interface InputFormProps {
  mode: Mode
  topic: string
  setTopic: (topic: string) => void
  apiKey: string
  setApiKey: (apiKey: string) => void
  selectedModel: string
  setSelectedModel: (model: string) => void
  isGenerating: boolean
  progress: ProgressType
  onGenerate: () => void
}

export const InputForm = ({
  mode,
  topic,
  setTopic,
  apiKey,
  setApiKey,
  selectedModel,
  setSelectedModel,
  isGenerating,
  progress,
  onGenerate
}: InputFormProps) => {
  return (
    <div className="input-section">
      <div className="form-container">
        <h2>Create your {mode === 'ebook' ? 'Ebook' : 'Chapter Expansion'}</h2>
        
        <div className="form-group">
          <label htmlFor="topic">Topic</label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={mode === 'ebook' ? 'e.g., Boxing' : 'e.g., Advanced Boxing Techniques'}
            disabled={isGenerating}
          />
        </div>

        <div className="form-group">
          <label htmlFor="apikey">OpenAI API Key</label>
          <input
            id="apikey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            disabled={isGenerating}
          />
        </div>

        <ModelSelect
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          models={MODELS}
          disabled={isGenerating}
        />

        {isGenerating && <Progress progress={progress} />}

        <button
          className="generate-btn"
          onClick={onGenerate}
          disabled={isGenerating || !topic.trim() || !apiKey.trim()}
        >
          {isGenerating ? (
            <>
              <Loader2 className="spinner" />
              Generating...
            </>
          ) : (
            `Generate ${mode === 'ebook' ? 'Ebook' : 'Chapter'}`
          )}
        </button>
      </div>
    </div>
  )
}