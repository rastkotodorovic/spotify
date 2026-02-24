'use client'

import { useEffect } from "react"
import { useSession } from "next-auth/react"

import LeftSide from './LeftSide'
import RightSide from "./RightSide"
import Center from "./Center"
import {useTrackStore} from "../../../store/playerStore"
import useSpotify from "../../../hooks/useSpotify"
import useTrack from "../../../hooks/useTrack"

export default function Player() {
    const { data: session } = useSession()
    const spotifyApi = useSpotify()
    const trackId = useTrackStore((state) => state.trackId)
    const setTrackId = useTrackStore((state) => state.setTrackId)
    const setIsPlaying = useTrackStore((state) => state.setIsPlaying)
    const setSeek = useTrackStore((state) => state.setSeek)
    const track = useTrack()

    useEffect(() => {
        if (spotifyApi.getAccessToken() && ! trackId) {
            getCurrentTrack()
        }
    }, [trackId, spotifyApi, session])

    const getCurrentTrack = () => {
        spotifyApi.getMyCurrentPlayingTrack()
            .then((data) => setTrackId(data.body?.item?.id))

        spotifyApi.getMyCurrentPlaybackState()
            .then((data) => {
                setSeek(data.body?.progress_ms ?? 0)
                setIsPlaying(data.body?.is_playing ?? false)
            })
    }

    const changeSong = () => {
        getCurrentTrack()
    }

    return (
        <div className="h-24 bg-gray-100 border-t border-gray-200 text-black grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
            <LeftSide track={track} />

            <Center spotifyApi={spotifyApi} track={track} changeSong={changeSong} />

            <RightSide spotifyApi={spotifyApi} />
        </div>
    )
}
