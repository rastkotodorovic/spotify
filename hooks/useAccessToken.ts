'use client'

import { useSession } from 'next-auth/react'

export default function useAccessToken(): string | undefined {
  const { data: session } = useSession()
  return (session as any)?.user?.accessToken
}
