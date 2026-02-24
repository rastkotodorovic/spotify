'use client'

import { usePlaylistStore } from "../../store/playerStore"
import Cards from "../shared/Cards"

export default function MyPlaylists() {
    const playlists = usePlaylistStore((state) => state.myPlaylists)

    return (
        <div className="px-4 mt-6 mx-8 sm:px-6 lg:px-8 mb-40">
            <Cards playlists={playlists} title="Playlists" href="playlist" />
        </div>
    )
}
