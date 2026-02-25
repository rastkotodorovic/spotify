import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function proxy(req: NextRequest) {
    // @ts-ignore
    const token = await getToken({req, secret: process.env.JWT_SECRET })

    const { pathname } = req.nextUrl

    if (token || pathname.includes('/api/auth') ||  pathname === '/login') {
        return NextResponse.next()
    }

    // Use URL API to construct absolute redirect target compatible with Next 15
    const url = new URL('/login', req.url)
    return NextResponse.redirect(url);
}

export const config = {
    matcher: [
        // Protect all routes except the listed ones
        '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/auth).*)',
    ],
}
