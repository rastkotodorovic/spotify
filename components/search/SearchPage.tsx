'use client'

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import useSpotify from "../../hooks/useSpotify"
import Cards from "../shared/Cards"
import Tracks from "../shared/Tracks"

export default function SearchPage() {
    const spotifyApi = useSpotify()
    const searchParams = useSearchParams()
    const query = searchParams.get('query')
    const [ tracks, setTracks ] = useState([])
    const [ playlists, setPlaylists ] = useState([])
    const [ artists, setArtists ] = useState([])

    useEffect(() => {
        if (spotifyApi.getAccessToken() && query) {
            spotifyApi.searchPlaylists(query, {limit: 5})
                .then(function(data) {
                   setPlaylists(data.body.playlists.items)
                }, function() {
                })

            spotifyApi.searchArtists(query)
                .then(function(data) {
                    setArtists(data.body.artists.items)
                }, function() {
                })

            spotifyApi.searchTracks(query, { limit: 10 })
                .then(function(data) {
                    setTracks(data.body.tracks.items)
                }, function() {
                })
        }
    }, [spotifyApi.getAccessToken(), query])


    return (
        <div className="px-4 mt-6 sm:px-6 lg:px-8">
            <Cards playlists={playlists} title="Playlists" href="playlist" />

            <Cards playlists={artists} title="Artists" href="artists" />

            <div className="mb-36">
                <Tracks tracks={tracks} />
            </div>
        </div>
    )
}
