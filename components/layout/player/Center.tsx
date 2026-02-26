'use client'

import { useCallback, useEffect, useState } from 'react'
import {
    ForwardIcon,
    PauseIcon,
    PlayIcon,
    ArrowPathIcon,
    BackwardIcon,
    ArrowsRightLeftIcon
} from '@heroicons/react/24/solid'
import { debounce } from 'lodash'

import { useTrackStore } from '../../../store/playerStore'
import millisToMinutesAndSeconds from '../../../lib/time'

export default function Center({ spotifyApi, track, changeSong }) {
    const isPlaying = useTrackStore((state) => state.isPlaying)
    const setIsPlaying = useTrackStore((state) => state.setIsPlaying)
    const seek = useTrackStore((state) => state.seek)
    const setSeek = useTrackStore((state) => state.setSeek)
    const [ shuffle, setShuffle ] = useState(false)

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState()
            .then((data) => {
                if (data?.body?.is_playing) {
                    spotifyApi.pause()
                        .then(function() {
                            setIsPlaying(false)
                        }).catch(() => {})
                } else {
                    spotifyApi.play()
                        .then(function() {
                            setIsPlaying(true)
                        }).catch(() => {})
                }
            })
    }

    let interval
    useEffect(() => {
        if (isPlaying) {
            interval = setInterval(() => {
                setSeek((seek) => seek + 1000)
            }, 1000)
        } else {
            if (interval) {
                clearInterval(interval)
            }
        }

        return () => {
            clearInterval(interval)
        }
    }, [isPlaying])

    useEffect(() => {
        if (seek > track?.duration_ms) {
            clearInterval(interval)
            changeSong()
        }
    }, [seek])

    function changeTrackSeek(time) {
        debouncedChangeTrackSeek(time)
        setSeek(time)
    }

    const debouncedChangeTrackSeek = useCallback(
        debounce((seek) => {
            spotifyApi.seek(seek)
                .then(function() {}, function() {})
        }, 100),
        []
    )

    const handleSkipToNext = () => {
        spotifyApi.skipToNext()
            .then(function () {
                setSeek(0)
                setTimeout(() => changeSong(), 500)
            })
            .catch(() => {})
    }

    const handleSkipToPrevious = () => {
        spotifyApi.skipToPrevious()
            .then(function () {
                setSeek(0)
                setTimeout(() => changeSong(), 500)
            })
            .catch(() => {})
    }

    const handleShuffle = () => {
        spotifyApi.setShuffle(!shuffle)
        setShuffle(!shuffle)
    }

    return (
        <>
            <div className="flex flex-col mt-3">
                <div className="flex items-center justify-center">
                    <ArrowsRightLeftIcon
                        className={`btn-player ${shuffle ? 'fill-green-500' : ''}`}
                        onClick={handleShuffle}
                    />
                    <BackwardIcon
                        onClick={handleSkipToPrevious}
                        className="ml-10 btn-player"
                    />
                    {isPlaying ? (
                        <PauseIcon onClick={handlePlayPause} className="btn-play" />
                    ) : (
                        <PlayIcon onClick={handlePlayPause} className="btn-play" />
                    )}

                    <ForwardIcon
                        onClick={handleSkipToNext}
                        className="mr-10 btn-player"
                    />

                    <ArrowPathIcon
                        className="btn-player"
                        onClick={() => spotifyApi.setRepeat('track')}
                    />
                </div>
                <div className="flex">
                    <div className="flex-none w-14 text-center text-gray-500 text-sm mt-1">
                        {millisToMinutesAndSeconds(seek)}
                    </div>
                    <div className="grow">
                        <input
                            type="range"
                            className="w-full align-middle"
                            onChange={(event) => changeTrackSeek(Number(event.target.value))}
                            value={seek}
                            min={0}
                            max={track?.duration_ms}
                        />
                    </div>
                    <div className="flex-none w-14 text-center text-gray-500 text-sm mt-1">
                        {isNaN(track?.duration_ms) ? '0:00' : millisToMinutesAndSeconds(track?.duration_ms)}
                    </div>
                </div>
            </div>
        </>
    )
}
