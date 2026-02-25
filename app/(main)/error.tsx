'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Something went wrong
      </h2>
      <button
        onClick={reset}
        className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-full hover:bg-green-600 transition"
      >
        Try again
      </button>
    </div>
  )
}
