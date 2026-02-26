'use client'

import { useEffect, useState } from 'react'

import useAccessToken from '../../hooks/useAccessToken'
import spotifyFetch from '../../lib/spotifyFetch'
import Cards from '../shared/Cards'

export default function MyArtists() {
    const accessToken = useAccessToken()
    const [ artists, setArtists ] = useState([])

    useEffect(() => {
        if (accessToken) {
            spotifyFetch(accessToken, '/me/following', { params: { type: 'artist' } })
                .then(function(data) {
                    setArtists(data.artists.items)
                })
                .catch(function() {
                })
        }
    }, [accessToken])

    return (
        <div className="px-4 mt-6 mx-8 sm:px-6 lg:px-8 mb-40">
            <Cards playlists={artists} title="Artists" href="artists" />
        </div>
    )
}
