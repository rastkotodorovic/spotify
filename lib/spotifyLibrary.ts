import spotifyFetch from './spotifyFetch'

type LibraryType = 'track' | 'album' | 'artist' | 'playlist' | 'user'

function idsToUris(type: LibraryType, ids: string[]): string[] {
  return ids.map((id) => `spotify:${type}:${id}`)
}

export async function libraryContains(
  accessToken: string,
  type: LibraryType,
  ids: string[]
): Promise<boolean[]> {
  const uris = idsToUris(type, ids)
  return spotifyFetch<boolean[]>(accessToken, '/me/library/contains', {
    params: { uris: uris.join(',') },
  })
}

export async function libraryAdd(
  accessToken: string,
  type: LibraryType,
  ids: string[]
): Promise<void> {
  const uris = idsToUris(type, ids)
  return spotifyFetch(accessToken, '/me/library', {
    method: 'PUT',
    body: { uris },
  })
}

export async function libraryRemove(
  accessToken: string,
  type: LibraryType,
  ids: string[]
): Promise<void> {
  const uris = idsToUris(type, ids)
  return spotifyFetch(accessToken, '/me/library', {
    method: 'DELETE',
    body: { uris },
  })
}

export async function getPlaylistItems(
  accessToken: string,
  playlistId: string,
  options: { offset?: number; limit?: number } = {}
): Promise<any> {
  return spotifyFetch(accessToken, `/playlists/${playlistId}/items`, {
    params: {
      offset: options.offset,
      limit: options.limit,
    },
  })
}

export async function getMyPlaylists(
  accessToken: string,
  options: { limit?: number } = {}
): Promise<any> {
  return spotifyFetch(accessToken, '/me/playlists', {
    params: {
      limit: options.limit,
    },
  })
}
