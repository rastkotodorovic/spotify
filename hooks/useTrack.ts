'use client'

import {useEffect, useState} from "react"
import useSpotify from "./useSpotify"
import {useTrackStore} from "../store/playerStore"

export default function useTrack() {
    const trackId = useTrackStore((state) => state.trackId)
    const spotifyApi = useSpotify()
    const [ track, setTrack ] = useState(null)

    useEffect(() => {
        const getSong = async () => {
            if (trackId) {
                const trackInfo = await fetch(
                    `https://api.spotify.com/v1/tracks/${trackId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
                        }
                    }
                ).then((res) => res.json())

                setTrack(trackInfo)
            }
        }

        getSong()
    }, [trackId])

    return track
}
