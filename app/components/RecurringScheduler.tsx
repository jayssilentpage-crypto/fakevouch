'use client'

import { useState } from 'react'

interface RecurringSchedulerProps {
  onSchedule: (schedule: any) => void
}

export default function RecurringScheduler({ onSchedule }: RecurringSchedulerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [schedule, setSchedule] = useState({
    enabled: false,
    interval: 'hourly', // hourly, daily, weekly
    intervalValue: 1,
    startTime: '',
    endTime: '',
  })

  const handleSave = () => {
    onSchedule(schedule)
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-purple-700/50 hover:bg-purple-700/70 border border-purple-600/50 text-white rounded-lg transition-colors text-sm font-medium"
      >
        ⏰ Schedule Recurring
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-black border-2 border-purple-500/50 rounded-2xl p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Recurring Generation</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white text-3xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={schedule.enabled}
              onChange={(e) => setSchedule({ ...schedule, enabled: e.target.checked })}
              className="w-5 h-5 rounded"
            />
            <label className="text-white">Enable recurring generation</label>
          </div>

          {schedule.enabled && (
            <>
              <div>
                <label className="block text-white mb-2">Interval</label>
                <select
                  value={schedule.interval}
                  onChange={(e) => setSchedule({ ...schedule, interval: e.target.value })}
                  className="w-full px-4 py-2 bg-black/60 border border-purple-800/50 rounded-xl text-white"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-2">Every</label>
                <input
                  type="number"
                  value={schedule.intervalValue}
                  onChange={(e) => setSchedule({ ...schedule, intervalValue: parseInt(e.target.value) || 1 })}
                  min="1"
                  className="w-full px-4 py-2 bg-black/60 border border-purple-800/50 rounded-xl text-white"
                />
              </div>
            </>
          )}

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-colors font-semibold"
            >
              Save Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

