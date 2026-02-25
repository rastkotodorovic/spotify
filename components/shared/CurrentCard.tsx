'use client'

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import useSpotify from "../../hooks/useSpotify"

export default function CurrentCard({ type, playlist }) {
    const spotifyApi = useSpotify()
    const [ isFollowing, setIsFollowing ] = useState(false)
    const { data: session } = useSession()

    useEffect(() => {
      if (spotifyApi.getAccessToken() && playlist?.id) {
          switch(type) {
              case 'playlist':
                  spotifyApi.areFollowingPlaylist(playlist.owner.id, playlist.id, [session?.user?.username])
                      .then(function(data) {
                          setIsFollowing(data.body[0])
                      })
                      .catch(function() {})
                  break;
              case 'artist':
                  spotifyApi.isFollowingArtists([playlist.id])
                      .then(function(data) {
                          setIsFollowing(data.body[0])
                      })
                      .catch(function() {})
                  break;
              case 'user':
                  spotifyApi.isFollowingUsers([playlist.id])
                      .then(function(data) {
                          setIsFollowing(data.body[0])
                      })
                      .catch(function() {})
                  break;
              case 'album':
                  spotifyApi.containsMySavedAlbums([playlist.id])
                      .then(function(data) {
                          setIsFollowing(data.body[0])
                      })
                      .catch(function() {})
                  break;
          }
      }
    }, [spotifyApi.getAccessToken(), playlist])

    const handleFollow = () => {
        switch(type) {
            case 'playlist':
                if (isFollowing) {
                    spotifyApi.unfollowPlaylist(playlist.id)
                        .then(function() {
                            setIsFollowing(false)
                        })
                        .catch(function() {})
                } else {
                    spotifyApi.followPlaylist(playlist.id)
                        .then(function() {
                            setIsFollowing(true)
                        })
                        .catch(function() {})
                }
                break;
            case 'artist':
                if (isFollowing) {
                    spotifyApi.unfollowArtists([playlist.id])
                        .then(function() {
                            setIsFollowing(false)
                        })
                        .catch(function() {})
                } else {
                    spotifyApi.followArtists([playlist.id])
                        .then(function() {
                            setIsFollowing(true)
                        })
                        .catch(function() {})
                }
                break;
            case 'user':
                if (isFollowing) {
                    spotifyApi.unfollowUsers([playlist.id])
                        .then(function() {
                            setIsFollowing(false)
                        })
                        .catch(function() {})
                } else {
                    spotifyApi.followUsers([playlist.id])
                        .then(function() {
                            setIsFollowing(true)
                        })
                        .catch(function() {})
                }
                break;
            case 'album':
                if (isFollowing) {
                    spotifyApi.removeFromMySavedAlbums([playlist.id])
                        .then(function() {
                            setIsFollowing(false)
                        })
                        .catch(function() {})
                } else {
                    spotifyApi.addToMySavedAlbums([playlist.id])
                        .then(function() {
                            setIsFollowing(true)
                        })
                        .catch(function() {})
                }
                break;
        }
    }

    return (
      <>
          <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-3">{type}</h2>
          <div className="flex flex-col items-center bg-white rounded-lg border shadow-md md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
              {playlist?.images?.[0]?.url && (
                  <img
                      className="object-cover w-full rounded-t-lg md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
                      src={playlist.images[0].url}
                      alt=""
                  />
              )}
              <div className="flex flex-col justify-between px-8 py-4 leading-normal w-full">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {playlist?.name ? playlist?.name : playlist?.username}
                  </h5>
                  <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">{playlist?.description}</p>
                  <div className="flex justify-between">
                      <div>
                          {playlist?.followers && (
                              <p className="mb-2 font-normal text-gray-600 dark:text-gray-400">
                                  {playlist?.followers?.total?.toLocaleString()} followers
                              </p>
                          )}

                          {playlist?.total_tracks && (
                              <p className="mb-2 font-normal text-gray-600 dark:text-gray-400">
                                  {playlist?.total_tracks} tracks
                              </p>
                          )}

                          {playlist?.owner?.display_name && (
                              <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                                  {playlist?.owner?.display_name} - {playlist?.tracks?.items?.length} tracks
                              </p>
                          )}
                      </div>
                      <div>
                          <button onClick={handleFollow}>
                              {isFollowing ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-heart mt-1 fill-green-500" viewBox="0 0 16 16">
                                      <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                                  </svg>
                              ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-heart mt-1" viewBox="0 0 16 16">
                                      <path d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                                  </svg>
                              )}
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </>
    )
}
