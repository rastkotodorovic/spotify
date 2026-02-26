'use client'

import { SetStateAction, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import useSpotify from '../../hooks/useSpotify'
import Cards from '../shared/Cards'
import CurrentCard from '../shared/CurrentCard'

export default function SelectedArtist() {
    const spotifyApi = useSpotify()
    const params = useParams()
    const artistId = params?.artistId as string
    const [ albums, setAlbums ] = useState([])
    const [ artist, setArtist ] = useState([])

    useEffect(() => {
        if (spotifyApi.getAccessToken() && artistId) {
          spotifyApi.getArtist(artistId)
              .then(function(data: { body: SetStateAction<never[]> }) {
                setArtist(data.body)
              })
              .catch(function() {
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
        </div>
    )
}
