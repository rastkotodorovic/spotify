'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import useSpotify from '../../hooks/useSpotify'
import useAccessToken from '../../hooks/useAccessToken'
import { getMyPlaylists } from '../../lib/spotifyLibrary'
import Cards from '../shared/Cards'
import Tracks from '../shared/Tracks'

export default function Landing() {
    const { data: session } = useSession()
    const spotifyApi = useSpotify()
    const accessToken = useAccessToken()
    const [ featuredPlaylists, setFeaturedPlaylists ] = useState<any[]>([])
    const [ topArtists, setTopArtists ] = useState<any[]>([])
    const [ recentAlbums, setRecentAlbums ] = useState<any[]>([])
    const [ recentlyPlayed, setRecentlyPlayed ] = useState<any[]>([])

    useEffect(() => {
        if (spotifyApi.getAccessToken() && accessToken) {
            getMyPlaylists(accessToken, { limit: 10 })
                .then((data) => {
                    setFeaturedPlaylists(data.items)
                })
                .catch(() => {})

            spotifyApi.getMyRecentlyPlayedTracks({ limit : 50 })
                    .then(function(data: { body: { items: any[] } }) {
                        setRecentlyPlayed(data.body.items)

                        const seenAlbumIds = new Set<string>()
                        const uniqueAlbums: any[] = []
                        for (const item of data.body.items) {
                            const album = item.track?.album
                            if (album && !seenAlbumIds.has(album.id)) {
                                seenAlbumIds.add(album.id)
                                uniqueAlbums.push(album)
                                if (uniqueAlbums.length >= 10) break
                            }
                        }
                        setRecentAlbums(uniqueAlbums)
                    })
                    .catch(function() {
                    })

            spotifyApi.getMyTopArtists()
                .then(function(data) {
                    setTopArtists(data.body.items)
                })
                .catch(function() {
                })
        }
    }, [session, spotifyApi, accessToken])

    return (
        <div className="px-4 mt-6 mb-40 mx-8 sm:px-6 lg:px-8">
            <Cards playlists={featuredPlaylists} title="Featured playlists" href="playlist" />

            <Cards playlists={topArtists} title="My top artists" href="artists" />

            <Cards playlists={recentAlbums} title="Recently Played" href="albums" />

            <h2 className="text-gray-600 text-md font-medium tracking-wide">Recently played</h2>
            <Tracks tracks={recentlyPlayed} />
        </div>
    )
}
