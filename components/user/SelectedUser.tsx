'use client'

import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import useSpotify from '../../hooks/useSpotify'
import useAccessToken from '../../hooks/useAccessToken'
import { getMyPlaylists } from '../../lib/spotifyLibrary'
import Cards from '../shared/Cards'
import CurrentCard from '../shared/CurrentCard'
import Tracks from '../shared/Tracks'

export default function SelectedUser() {
    const spotifyApi = useSpotify()
    const accessToken = useAccessToken()
    const params = useParams()
    const { data: session } = useSession()
    const userId = params?.userId as string
    const [ user, setUser ] = useState({ id: '' })
    const [ playlists, setPlaylists ] = useState([])
    const [ topTracks, setTopTracks ] = useState([])
    const [ topArtists, setTopArtists ] = useState([])

    useEffect(() => {
        const username = (session as any)?.user?.username
        if (accessToken && userId && username) {
            if (userId === username) {
                setUser({
                    id: username,
                    ...(session?.user?.image ? { images: [{ url: session.user.image }] } : {}),
                } as any)
            }
        }
    }, [accessToken, userId, session])

    useEffect(() => {
        if (user?.id && accessToken) {
            getMyPlaylists(accessToken)
                .then(function (data) {
                    setPlaylists(data.items)
                })
                .catch(function () {
                })

            if (user.id === (session as any)?.user?.username) {
                spotifyApi.getMyTopTracks({ limit: 10 })
                    .then(function (data) {
                        setTopTracks(data.body.items)
                    })
                    .catch(function () {
                    })

                spotifyApi.getMyTopArtists()
                    .then(function (data) {
                        setTopArtists(data.body.items)
                    })
                    .catch(function () {
                    })
            }
        }
    }, [user])


    return (
        <div className="px-4 mt-6 mx-8 sm:px-6 lg:px-8">
            <CurrentCard playlist={user} type="user"/>

            <div className="mt-10">
                <Cards playlists={playlists} title="Playlists" href="playlist"/>
            </div>

            {user?.id === (session as any)?.user?.username && (
                <>
                    <Cards playlists={topArtists} title="My top artists" href="artists"/>

                    <h2 className="text-gray-600 text-md font-medium tracking-wide">Top tracks</h2>
                    <Tracks tracks={topTracks} />
                </>
            )}
        </div>
    )
}
