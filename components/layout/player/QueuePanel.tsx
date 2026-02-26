'use client'

import { useEffect, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'

import { useQueueStore } from '../../../store/playerStore'
import useAccessToken from '../../../hooks/useAccessToken'
import { getQueue } from '../../../lib/spotifyQueue'
import millisToMinutesAndSeconds from '../../../lib/time'

function QueueTrackRow({ track }: { track: any }) {
  return (
    <div className="flex items-center space-x-3 py-2 px-3 hover:bg-gray-100 rounded">
      <img
        className="h-10 w-10 rounded flex-shrink-0"
        src={track?.album?.images?.[0]?.url}
        alt=""
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900 truncate">
          {track.name}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {track.artists?.map((artist: any) => artist.name).join(', ')}
        </p>
      </div>
      <span className="text-xs text-gray-400 flex-shrink-0">
        {millisToMinutesAndSeconds(track.duration_ms)}
      </span>
    </div>
  )
}

export default function QueuePanel() {
  const isQueueOpen = useQueueStore((state) => state.isQueueOpen)
  const setIsQueueOpen = useQueueStore((state) => state.setIsQueueOpen)
  const accessToken = useAccessToken()
  const [currentlyPlaying, setCurrentlyPlaying] = useState<any>(null)
  const [queue, setQueue] = useState<any[]>([])

  useEffect(() => {
    if (isQueueOpen && accessToken) {
      getQueue(accessToken)
        .then(function (data) {
          setCurrentlyPlaying(data.currently_playing)
          setQueue(data.queue)
        })
        .catch(function () {})
    }
  }, [isQueueOpen, accessToken])

  if (!isQueueOpen) return null

  return (
    <div className="fixed bottom-24 right-0 w-96 max-h-[60vh] bg-white rounded-tl-lg shadow-lg border border-gray-200 z-50 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Queue</h3>
        <button onClick={() => setIsQueueOpen(false)}>
          <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        </button>
      </div>

      <div className="overflow-y-auto flex-1">
        {currentlyPlaying && (
          <div className="px-4 pt-3 pb-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Now playing
            </p>
            <QueueTrackRow track={currentlyPlaying} />
          </div>
        )}

        {queue.length > 0 && (
          <div className="px-4 pt-3 pb-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Next up
            </p>
            {queue.map((track, index) => (
              <QueueTrackRow key={`${track.id}-${index}`} track={track} />
            ))}
          </div>
        )}

        {!currentlyPlaying && queue.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-gray-400">
            Queue is empty
          </div>
        )}
      </div>
    </div>
  )
}
