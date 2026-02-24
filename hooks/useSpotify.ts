'use client'

import { useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import spotify from '../lib/spotify'

export default function useSpotify() {
    const { data: session, status } = useSession()

    useEffect(() => {
        if (session) {
            if ((session as any)?.error === 'RefreshAccessTokenError') {
                signIn()
            }

            const accessToken = (session as any)?.user?.accessToken
            if (accessToken) {
                spotify.setAccessToken(accessToken)
            }
        }
    }, [session])

    return spotify
}
