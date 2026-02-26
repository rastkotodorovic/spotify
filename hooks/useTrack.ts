'use client'

import { useEffect, useState } from 'react'
import useSpotify from './useSpotify'
import { useTrackStore } from '../store/playerStore'

export default function useTrack() {
    const trackId = useTrackStore((state) => state.trackId)
    const spotifyApi = useSpotify()
    const [ track, setTrack ] = useState(null)

    useEffect(() => {
        if (trackId && spotifyApi.getAccessToken()) {
            spotifyApi.getTrack(trackId)
                .then((data) => {
                    setTrack(data.body)
                })
                .catch(() => {})
        }
    }, [trackId, spotifyApi])

    return track
}
