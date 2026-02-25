'use client'

import { SetStateAction, useEffect, useState } from "react"

import useSpotify from "../../hooks/useSpotify"
import Cards from "../shared/Cards";

export default function MyAlbums() {
    const spotifyApi = useSpotify()
    const [ albums, setAlbums ] = useState([])

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getMySavedAlbums()
                .then(function(data: { body: { items: SetStateAction<never[]>; }; }) {
                    setAlbums(data.body.items)
                })
                .catch(function() {
                })
        }
    }, [spotifyApi.getAccessToken()])

    return (
        <div className="px-4 mt-6 mx-8 sm:px-6 lg:px-8 mb-40">
            <Cards playlists={albums} title="Albums" href="albums" />
        </div>
    )
}
