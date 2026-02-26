'use client'

import { useEffect, useState } from 'react'

import useAccessToken from '../../hooks/useAccessToken'
import spotifyFetch from '../../lib/spotifyFetch'
import Cards from '../shared/Cards'

export default function MyAlbums() {
    const accessToken = useAccessToken()
    const [ albums, setAlbums ] = useState([])

    useEffect(() => {
        if (accessToken) {
            spotifyFetch(accessToken, '/me/albums')
                .then(function(data) {
                    setAlbums(data.items)
                })
                .catch(function() {
                })
        }
    }, [accessToken])

    return (
        <div className="px-4 mt-6 mx-8 sm:px-6 lg:px-8 mb-40">
            <Cards playlists={albums} title="Albums" href="albums" />
        </div>
    )
}
