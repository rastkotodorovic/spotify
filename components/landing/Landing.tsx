'use client'

import { SetStateAction, useEffect, useState } from "react"
import { useSession } from "next-auth/react"

import useSpotify from "../../hooks/useSpotify"
import Cards from "../shared/Cards"
import Tracks from "../shared/Tracks"

export default function Landing() {
    const { data: session } = useSession()
    const spotifyApi = useSpotify()
    const [ featuredPlaylists, setFeaturedPlaylists ] = useState([])
    const [ topArtists, setTopArtists ] = useState([])
    const [ newAlbums, setNewAlbums ] = useState([])
    const [ recentlyPlayed, setRecentlyPlayed ] = useState([])

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getUserPlaylists({ limit: 10 })
                .then((data: { body: { items: SetStateAction<never[]> } }) => {
                    setFeaturedPlaylists(data.body.items)
                })
                .catch(() => {})

            spotifyApi.getNewReleases({ limit : 10 })
                .then(function(data: { body: { albums: { items: SetStateAction<never[]> } } }) {
                    setNewAlbums(data.body.albums.items)
                  })
                .catch(function() {
                  })

            spotifyApi.getMyRecentlyPlayedTracks({ limit : 10 })
                    .then(function(data: { body: { items: SetStateAction<never[]> } }) {
                        setRecentlyPlayed(data.body.items)
                    })
                    .catch(function() {
                    })

            spotifyApi.getMyTopArtists()
                .then(function(data: { body: { items: SetStateAction<never[]> } }) {
                    setTopArtists(data.body.items)
                })
                .catch(function() {
                })
        }
    }, [session, spotifyApi])

    return (
        <div className="px-4 mt-6 mb-40 mx-8 sm:px-6 lg:px-8">
            <Cards playlists={featuredPlaylists} title="Featured playlists" href="playlist" />

            <Cards playlists={topArtists} title="My top artists" href="artists" />

            <Cards playlists={newAlbums} title="New realases" href="albums" />

            <h2 className="text-gray-600 text-md font-medium tracking-wide">Recently played</h2>
            <Tracks tracks={recentlyPlayed} />
        </div>
    )
}
