const BASE_URL = 'https://api.spotify.com/v1'

type FetchOptions = {
  method?: string
  params?: Record<string, string | number | boolean | undefined>
  body?: unknown
}

export default async function spotifyFetch<T = any>(
  accessToken: string,
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { method = 'GET', params, body } = options

  const url = new URL(`${BASE_URL}${path}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    })
  }

  const response = await fetch(url.toString(), {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.status} ${response.statusText}`)
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as T
  }

  return response.json()
}
