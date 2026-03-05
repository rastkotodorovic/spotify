'use client'

import { useEffect, useState } from 'react'
import {
  XMarkIcon,
  ArrowPathIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  SpeakerWaveIcon,
} from '@heroicons/react/24/solid'

import { useDeviceStore } from '../../../store/playerStore'
import useAccessToken from '../../../hooks/useAccessToken'
import {
  getMyDevices,
  transferPlayback,
  type Device,
} from '../../../lib/spotifyDevices'

function getDeviceIcon(deviceType: string) {
  switch (deviceType.toLowerCase()) {
    case 'smartphone':
      return <DevicePhoneMobileIcon className="h-5 w-5 flex-shrink-0" />
    case 'speaker':
      return <SpeakerWaveIcon className="h-5 w-5 flex-shrink-0" />
    default:
      return <ComputerDesktopIcon className="h-5 w-5 flex-shrink-0" />
  }
}

export default function DevicePanel() {
  const isDevicePanelOpen = useDeviceStore((state) => state.isDevicePanelOpen)
  const setIsDevicePanelOpen = useDeviceStore(
    (state) => state.setIsDevicePanelOpen
  )
  const accessToken = useAccessToken()
  const [devices, setDevices] = useState<Device[]>([])

  const fetchDevices = () => {
    if (accessToken) {
      getMyDevices(accessToken)
        .then(function (data) {
          setDevices(data.devices)
        })
        .catch(function () {})
    }
  }

  useEffect(() => {
    if (isDevicePanelOpen) {
      fetchDevices()
    }
  }, [isDevicePanelOpen, accessToken])

  const handleTransfer = (deviceId: string) => {
    if (!accessToken) return
    transferPlayback(accessToken, deviceId)
      .then(function () {
        fetchDevices()
      })
      .catch(function () {})
  }

  if (!isDevicePanelOpen) return null

  return (
    <div className="fixed bottom-24 right-0 w-80 bg-white rounded-tl-lg shadow-lg border border-gray-200 z-50 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Devices</h3>
        <div className="flex items-center space-x-2">
          <button onClick={fetchDevices}>
            <ArrowPathIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
          <button onClick={() => setIsDevicePanelOpen(false)}>
            <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 py-2">
        {devices.length > 0 ? (
          devices.map((device) => (
            <button
              key={device.id}
              onClick={() => handleTransfer(device.id)}
              className={`flex items-center space-x-3 w-full px-4 py-3 hover:bg-gray-100 text-left ${
                device.is_active ? 'text-green-500' : 'text-gray-700'
              }`}
            >
              {getDeviceIcon(device.type)}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{device.name}</p>
                <p className="text-xs text-gray-400">{device.type}</p>
              </div>
              {device.is_active && (
                <span className="text-xs font-medium text-green-500">
                  Active
                </span>
              )}
            </button>
          ))
        ) : (
          <div className="px-4 py-8 text-center text-sm text-gray-400">
            No devices found
          </div>
        )}
      </div>
    </div>
  )
}
