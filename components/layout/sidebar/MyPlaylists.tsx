'use client'

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

import useSpotify from "../../../hooks/useSpotify"
import { usePlaylistStore } from "../../../store/playerStore"

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function MyPlaylists({ session }) {
    const playlists = usePlaylistStore((state) => state.myPlaylists)
    const setPlaylists = usePlaylistStore((state) => state.setMyPlaylists)
    const spotifyApi = useSpotify()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getUserPlaylists()
                .then((data) => {
                    setPlaylists(data.body.items)
                })
        }
    }, [session, spotifyApi])

    return (
        <div className="mt-3 space-y-1" role="group" aria-labelledby="desktop-teams-headline">
            {playlists.map((playlist) => (
                <p
                    key={playlist?.id}
                    className={classNames(
                        pathname === `/collection/playlists/${playlist?.id}` ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50',
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer'
                    )}
                    onClick={() => router.push(`/collection/playlists/${playlist?.id}`)}
                >
                    <span className="truncate">{playlist?.name}</span>
                </p>
            ))}
        </div>
    )
}
