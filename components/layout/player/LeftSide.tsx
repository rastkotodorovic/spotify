'use client'

import { useEffect, useState } from "react";

import useSpotify from "../../../hooks/useSpotify";

export default function LeftSide({ track }) {
    const spotifyApi = useSpotify()
    const [ isFollowed, setIsFollowed ] = useState(false)

    useEffect(() => {
        if (spotifyApi.getAccessToken() && track) {
            spotifyApi.containsMySavedTracks([track.id])
                .then(function(data) {
                    setIsFollowed(data.body[0])
                })
                .catch(function(err: Error) {
                    console.log('Something went wrong!', err)
                })
        }
    }, [spotifyApi.getAccessToken(), track])

    const handleFollow = () => {
        if (isFollowed) {
            spotifyApi.removeFromMySavedTracks([track.id])
                .then(function () {
                    setIsFollowed(false)
                })
                .catch(function (err: Error) {
                    console.log('Something went wrong!', err)
                })
        } else {
            spotifyApi.addToMySavedTracks([track.id])
                .then(function () {
                    setIsFollowed(true)
                })
                .catch(function (err: Error) {
                    console.log('Something went wrong!', err)
                })
        }
    }

    return (
        <div className="flex items-center space-x-4">
            <img
                className="hidden md:inline h-16 w-16 rounded"
                src={track?.album?.images?.[0]?.url}
                alt={track?.album?.name}
            />
            <div className="flex justify-between">
                <div>
                    <h3 className="text-sm text-gray-800">{ track?.name }</h3>
                    <p className="text-sm text-gray-500">{ track?.artists?.[0]?.name }</p>
                </div>
                <div>
                    <button onClick={handleFollow}>
                        {isFollowed ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" className="bi bi-heart mt-2 ml-7 fill-green-500" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" className="bi bi-heart mt-2 ml-7" viewBox="0 0 16 16">
                                <path d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
