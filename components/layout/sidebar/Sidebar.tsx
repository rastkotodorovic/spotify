'use client'

import Link from 'next/link'
import { useSession } from "next-auth/react"

import Profile from "./Profile"
import SearchInput from "./SearchInput"
import Navigation from "./Navigation"
import MyPlaylists from "./MyPlaylists"

export default function Sidebar() {
    const { data: session } = useSession()

    return (
        <>
            <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:pt-5 lg:pb-4 lg:bg-gray-100">
                <Link href="/">
                    <div className="flex items-center flex-shrink-0 px-6 cursor-pointer ml-1">
                        <img
                            className="h-9 w-auto"
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/1024px-Spotify_logo_without_text.svg.png"
                            alt="Workflow"
                        />
                        <p className="ml-4 text-lg">Spotify</p>
                    </div>
                </Link>

                <div className="mt-6 h-0 flex-1 flex flex-col">
                    <Profile session={session} />

                    <SearchInput />

                    <div className="px-3 mt-6">
                        <Navigation />
                        <hr className="mt-3" />
                    </div>

                    <div className="px-3 mb-24 overflow-y-auto">
                        <MyPlaylists session={session} />
                    </div>
                </div>
            </div>
        </>
    )
}
