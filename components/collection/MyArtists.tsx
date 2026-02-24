'use client'

import { SetStateAction, useEffect, useState } from "react"

import useSpotify from "../../hooks/useSpotify"
import Cards from "../shared/Cards"

export default function MyArtists() {
    const spotifyApi = useSpotify()
    const [ artists, setArtists ] = useState([])

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getFollowedArtists()
                .then(function(data: { body: { artists: { items: SetStateAction<never[]> } } }) {
                    setArtists(data.body.artists.items)
                })
                .catch(function(err: Error) {
                    console.log('Something went wrong!', err)
                })
        }
    }, [spotifyApi.getAccessToken()])

    return (
        <div className="px-4 mt-6 mx-8 sm:px-6 lg:px-8 mb-40">
            <Cards playlists={artists} title="Artists" href="artists" />
        </div>
    )
}
