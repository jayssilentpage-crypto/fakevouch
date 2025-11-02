'use client'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  type?: 'danger' | 'warning' | 'info'
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'warning',
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const colors = {
    danger: {
      button: 'bg-red-600 hover:bg-red-700',
      border: 'border-red-500',
    },
    warning: {
      button: 'bg-yellow-600 hover:bg-yellow-700',
      border: 'border-yellow-500',
    },
    info: {
      button: 'bg-blue-600 hover:bg-blue-700',
      border: 'border-blue-500',
    },
  }

  const currentColor = colors[type]

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/90 border-2 border-purple-500/50 rounded-2xl p-8 max-w-md w-full">
        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors font-semibold"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-6 py-3 ${currentColor.button} text-white rounded-xl transition-colors font-semibold`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

