'use client'

import {useSession} from "next-auth/react"
import {useParams} from "next/navigation"
import {useEffect, useState} from "react"

import useSpotify from "../../hooks/useSpotify"
import Cards from "../shared/Cards"
import CurrentCard from "../shared/CurrentCard"
import Tracks from "../shared/Tracks"

export default function SelectedUser() {
    const spotifyApi = useSpotify()
    const params = useParams()
    const { data: session } = useSession()
    const userId = params?.userId as string
    const [ user, setUser ] = useState({id: ''})
    const [ playlists, setPlaylists ] = useState([])
    const [ topTracks, setTopTracks ] = useState([])
    const [ topArtists, setTopArtists ] = useState([])

    useEffect(() => {
        if (spotifyApi.getAccessToken() && userId) {
            spotifyApi.getUser(userId)
                .then((data) => {
                    setUser(data.body)
                })
        }
    }, [spotifyApi.getAccessToken(), userId])

    useEffect(() => {
        if (user) {
            spotifyApi.getUserPlaylists(user.id)
                .then(function (data) {
                    setPlaylists(data.body.items)
                })
                .catch(function (err) {
                    console.log('Something went wrong!', err)
                })

            if (user.id === session?.user?.username) {
                spotifyApi.getMyTopTracks({ limit: 10 })
                    .then(function (data) {
                        setTopTracks(data.body.items)
                    })
                    .catch(function (err) {
                        console.log('Something went wrong!', err)
                    })

                spotifyApi.getMyTopArtists()
                    .then(function (data) {
                        setTopArtists(data.body.items)
                    })
                    .catch(function (err) {
                        console.log('Something went wrong!', err)
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

            {user?.id === session?.user?.username && (
                <>
                    <Cards playlists={topArtists} title="My top artists" href="artists"/>

                    <h2 className="text-gray-600 text-md font-medium tracking-wide">Top tracks</h2>
                    <Tracks tracks={topTracks} />
                </>
            )}
        </div>
    )
}
