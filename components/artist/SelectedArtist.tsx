'use client'

import { SetStateAction, useEffect, useState } from "react"
import { useParams } from "next/navigation"

import useSpotify from "../../hooks/useSpotify"
import Cards from "../shared/Cards"
import Tracks from "../shared/Tracks"
import CurrentCard from "../shared/CurrentCard"

export default function SelectedArtist() {
    const spotifyApi = useSpotify()
    const params = useParams()
    const artistId = params?.artistId as string
    const [ tracks, setTracks ] = useState([])
    const [ albums, setAlbums ] = useState([])
    const [ artists, setArtists ] = useState([])
    const [ artist, setArtist ] = useState([])

    useEffect(() => {
        if (spotifyApi.getAccessToken() && artistId) {
          spotifyApi.getArtist(artistId)
              .then(function(data: { body: SetStateAction<never[]> }) {
                setArtist(data.body)
              })
              .catch(function() {
              })

          spotifyApi.getArtistTopTracks(artistId, 'GB')
              .then(function(data: { body: { tracks: SetStateAction<never[]> } }) {
                  setTracks(data.body.tracks)
              })
              .catch(function() {
              })

            spotifyApi.getArtistRelatedArtists(artistId)
                .then(function(data: { body: { artists: SetStateAction<never[]> } }) {
                  setArtists(data.body.artists)
                })

            spotifyApi.getArtistAlbums(artistId, { limit: 12 })
                .then(function(data: { body: { items: SetStateAction<never[]> } }) {
                  setAlbums(data.body.items)
                })
                .catch(function() {
                })
        }
    }, [spotifyApi.getAccessToken(), artistId])

    return (
        <div className="px-4 mt-6 mx-8 sm:px-6 lg:px-8">
            <CurrentCard type="artist" playlist={artist} />

            <div className="mt-10">
                <Cards playlists={albums} title="Albums" href="albums" />
            </div>
            <div className="my-20">
              <Tracks tracks={tracks} />
            </div>
            <div className="mb-40">
                <Cards playlists={artists} title="Related artists" href="artists" />
            </div>
        </div>
    )
}
