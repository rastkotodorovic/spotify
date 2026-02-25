'use client'

import { useEffect, useState } from "react"

import Card from "./Card"
import useSpotify from "../../hooks/useSpotify"

export default function Cards({ playlists, title, href }) {
    const spotifyApi = useSpotify()
    const [ isFollowed, setIsFollowed ] = useState([])

    useEffect(() => {
        if (spotifyApi.getAccessToken() && playlists?.length) {
            let ids: string[] = []
            playlists
                .filter((playlist) => playlist && (playlist.album || playlist.id))
                .map((playlist) => {
                    ids.push(playlist.album ? playlist.album.id : playlist.id)
                })

            switch (href) {
                case 'artists':
                    spotifyApi.isFollowingArtists(ids)
                        .then(function(data) {
                            setIsFollowed(data.body)
                        })
                        .catch(function() {
                        })
                    break;
                case 'albums':
                    spotifyApi.containsMySavedAlbums(ids)
                        .then(function(data) {
                            setIsFollowed(data.body)
                        })
                        .catch(function() {
                        })
                    break;
            }
        }
    }, [spotifyApi.getAccessToken(), playlists])

    return (
        <>
            <h2 className="text-gray-600 text-md font-medium tracking-wide">{title}</h2>
            <ul
                role="list"
                className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 xl:grid-cols-6 mt-5 mb-16"
            >
                {playlists
                    ?.filter((playlist) => playlist && (playlist.album || playlist.id))
                    .map((playlist, index: Number) => (
                        <Card
                            key={playlist.album ? playlist.album.id : playlist.id}
                            playlist={playlist.album ? playlist.album : playlist}
                            href={href}
                            index={index}
                            isFollowed={isFollowed}
                            setIsFollowed={setIsFollowed}
                        />
                    ))}
            </ul>
        </>
    )
}
