import { Loader2 } from 'lucide-react'
import type { Progress as ProgressType } from '../types'

interface ProgressProps {
  progress: ProgressType
}

export const Progress = ({ progress }: ProgressProps) => {
  const getProgressMessage = () => {
    switch (progress.current) {
      case 1:
        return 'Creating subtopics...'
      case 2:
        return 'Generating all chapters simultaneously...'
      case 3:
        return 'Finalizing content...'
      default:
        return 'Starting generation...'
    }
  }

  return (
    <div className="progress">
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${(progress.current / progress.total) * 100}%` }}
        />
      </div>
      <p>
        <Loader2 className="spinner" />
        {getProgressMessage()}
        {' '}({progress.current}/{progress.total})
      </p>
    </div>
  )
}