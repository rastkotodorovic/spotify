import spotifyFetch from './spotifyFetch'

export type Device = {
  id: string
  name: string
  type: string
  is_active: boolean
  volume_percent: number
}

type DevicesResponse = {
  devices: Device[]
}

export async function getMyDevices(
  accessToken: string
): Promise<DevicesResponse> {
  return spotifyFetch<DevicesResponse>(accessToken, '/me/player/devices')
}

export async function transferPlayback(
  accessToken: string,
  deviceId: string
): Promise<void> {
  return spotifyFetch(accessToken, '/me/player', {
    method: 'PUT',
    body: { device_ids: [deviceId] },
  })
}
