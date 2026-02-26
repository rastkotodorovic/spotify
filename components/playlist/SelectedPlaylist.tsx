'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import Tracks from '../shared/Tracks'
import useSpotify from '../../hooks/useSpotify'
import useAccessToken from '../../hooks/useAccessToken'
import { getPlaylistItems } from '../../lib/spotifyLibrary'
import CurrentCard from '../shared/CurrentCard'

interface Playlist {
    tracks: { items: any[] };
    id: string;
    owner: any[];
}

export default function SelectedPlaylist() {
    const spotifyApi = useSpotify()
    const accessToken = useAccessToken()
    const params = useParams()
    const playlistId = params?.playlistId as string
    const [ playlist, setPlaylist ] = useState(null as unknown as Playlist)
    const [ tracks, setTracks ] = useState<string[]>([])
    const [ offset, setOffset ] = useState(0)

    useEffect(() => {
        setTracks([])
        setOffset(0)
    }, [playlistId])

    useEffect(() => {
        if (spotifyApi.getAccessToken() && accessToken && playlistId) {
            spotifyApi.getPlaylist(playlistId)
                .then((data) => {
                    setPlaylist(data.body)
                })

            getPlaylistItems(accessToken, playlistId, { offset: offset, limit: 20 })
                .then((data) => {
                    if (tracks.length) {
                        setTracks((oldArray) => [...oldArray, ...data.items])
                    } else {
                        setTracks(data.items)
                    }
                })
        }
    }, [spotifyApi.getAccessToken(), accessToken, playlistId, offset])

    return (
        <>
            <div className="px-4 mt-6 sm:px-6 lg:px-8">
                <CurrentCard type="playlist" playlist={playlist} />
            </div>

            <Tracks tracks={tracks} setOffset={setOffset} playlist={playlist} />
        </>
    )
}
