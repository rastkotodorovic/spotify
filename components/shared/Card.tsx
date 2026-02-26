'use client'

import { useRouter } from "next/navigation"

import useSpotify from "../../hooks/useSpotify"

export default function Card({ playlist, href, isFollowed, index, setIsFollowed }) {
    const router = useRouter()
    const spotifyApi = useSpotify()

    const handleFollow = (e: { stopPropagation: () => void }) => {
        e.stopPropagation()
        switch (href) {
            case 'artists':
                if (isFollowed[index]) {
                    spotifyApi.unfollowArtists([playlist.id])
                        .then(function () {
                            let newArr = [...isFollowed]
                            newArr[index] = false

                            setIsFollowed(newArr)
                        })
                        .catch(function () {
                        })
                } else {
                    spotifyApi.followArtists([playlist.id])
                        .then(function () {
                            let newArr = [...isFollowed]
                            newArr[index] = true

                            setIsFollowed(newArr)
                        })
                        .catch(function () {
                        })
                }
                break
            case 'albums':
                if (isFollowed[index]) {
                    spotifyApi.removeFromMySavedAlbums([playlist.id])
                        .then(function() {
                            let newArr = [...isFollowed]
                            newArr[index] = false

                            setIsFollowed(newArr)
                        })
                        .catch(function() {
                        })
                } else {
                    spotifyApi.addToMySavedAlbums([playlist.id])
                        .then(function() {
                            let newArr = [...isFollowed]
                            newArr[index] = true

                            setIsFollowed(newArr)
                        })
                        .catch(function() {
                        })
                }
                break
        }
    }

    return (
        <div className="w-48 shrink-0 rounded group cursor-pointer" onClick={() => router.push(`/collection/${href === 'playlist' ? 'playlists' : href}/${playlist?.id}`)}>
            <div className="relative">
                <img alt="Placeholder" className="rounded aspect-square" src={playlist?.images[0]?.url} />
                <div className="absolute bg-black rounded bg-opacity-0 group-hover:bg-opacity-60 w-full h-full top-0 flex items-center group-hover:opacity-100 duration-700 transition justify-evenly">
                    {href !== 'playlist' ? (
                        <button
                            className="hover:scale-110 text-white outline-none opacity-0 transform translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 transition"
                            onClick={handleFollow}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                                {isFollowed[index] ? (
                                    <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                                ) : (
                                    <path d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                                )}
                            </svg>
                        </button>
                    ) : (
                        <button className="hover:scale-110 text-white outline-none opacity-0 transform translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
                            </svg>
                        </button>
                    )}

                    <button className="hover:scale-110 text-white outline-none opacity-0 transform translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-play-circle-fill" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
                        </svg>
                    </button>

                    <button className="hover:scale-110 text-white outline-none opacity-0 transform translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
                        </svg>
                    </button>
                </div>
            </div>
            <div className="p-2">
                <h3 className="text-gray-600 py-1 text-base justify-center">{playlist?.name}</h3>
                {playlist?.followers?.total && (
                    <p className="text-gray-400 text-sm mt-1">{playlist?.followers?.total} followers</p>
                )}

                {playlist?.owner?.display_name && (
                    <p className="text-gray-400 text-sm mt-1">By @{playlist?.owner?.display_name}</p>
                )}

                {playlist?.artists && (
                    <p className="text-gray-400 text-sm mt-1">
                        {playlist?.artists.map((artist) => (
                            <span key={artist.id}>{`${artist.name} `}</span>
                        ))}
                    </p>
                )}
            </div>
        </div>
    )
}
