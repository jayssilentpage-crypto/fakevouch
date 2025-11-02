'use client'

interface Step {
  id: string
  label: string
  status: 'pending' | 'active' | 'completed' | 'error'
}

interface MultiStepProgressProps {
  steps: Step[]
  currentStep: number
}

export default function MultiStepProgress({ steps, currentStep }: MultiStepProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex-1 flex flex-col items-center">
            <div className="flex items-center w-full">
              {/* Step Circle */}
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all
                  ${
                    step.status === 'completed'
                      ? 'bg-green-600 text-white'
                      : step.status === 'active'
                      ? 'bg-purple-600 text-white animate-pulse'
                      : step.status === 'error'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-400'
                  }
                `}
              >
                {step.status === 'completed' ? '✓' : step.status === 'error' ? '✗' : index + 1}
              </div>
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-1 mx-2 transition-all
                    ${step.status === 'completed' ? 'bg-green-600' : 'bg-gray-700'}
                  `}
                />
              )}
            </div>
            {/* Step Label */}
            <div className="mt-2 text-center">
              <div
                className={`
                  text-xs font-medium
                  ${
                    step.status === 'completed'
                      ? 'text-green-400'
                      : step.status === 'active'
                      ? 'text-purple-400'
                      : step.status === 'error'
                      ? 'text-red-400'
                      : 'text-gray-400'
                  }
                `}
              >
                {step.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

