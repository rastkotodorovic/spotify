import spotifyFetch from './spotifyFetch'

type QueueResponse = {
  currently_playing: any
  queue: any[]
}

export async function getQueue(accessToken: string): Promise<QueueResponse> {
  return spotifyFetch<QueueResponse>(accessToken, '/me/player/queue')
}

export async function addToQueue(
  accessToken: string,
  trackUri: string
): Promise<void> {
  return spotifyFetch(accessToken, '/me/player/queue', {
    method: 'POST',
    params: { uri: trackUri },
  })
}
