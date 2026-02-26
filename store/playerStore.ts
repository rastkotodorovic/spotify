import { create } from 'zustand'

interface TrackState {
  trackId: string | null
  isPlaying: boolean
  seek: number
  setTrackId: (id: string | null) => void
  setIsPlaying: (playing: boolean) => void
  setSeek: (seek: number | ((prev: number) => number)) => void
}

export const useTrackStore = create<TrackState>((set) => ({
  trackId: null,
  isPlaying: false,
  seek: 0,
  setTrackId: (id) => set({ trackId: id }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setSeek: (seek) =>
    set((state) => ({
      seek: typeof seek === 'function' ? seek(state.seek) : seek,
    })),
}))

interface PlaylistState {
  myPlaylists: any[]
  setMyPlaylists: (playlists: any[]) => void
}

export const usePlaylistStore = create<PlaylistState>((set) => ({
  myPlaylists: [],
  setMyPlaylists: (playlists) => set({ myPlaylists: playlists }),
}))

interface QueueState {
  isQueueOpen: boolean
  setIsQueueOpen: (open: boolean) => void
  toggleQueue: () => void
}

export const useQueueStore = create<QueueState>((set) => ({
  isQueueOpen: false,
  setIsQueueOpen: (open) => set({ isQueueOpen: open }),
  toggleQueue: () => set((state) => ({ isQueueOpen: !state.isQueueOpen })),
}))
