'use client'

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import { useRouter, usePathname } from "next/navigation"
import Link from 'next/link'

interface LayoutProps {
    children: React.ReactNode;
 }

const Header = ({ children }: LayoutProps) => {
    const router = useRouter()
    const pathname = usePathname()

    return (
        <div className="lg:pl-64 flex flex-col">
            <main className="flex-1">
                <div className="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8 ">
                    <div className="flex justify-between">
                        <ChevronLeftIcon
                            className="w-8 h-8 mr-6 bg-gray-100 p-1 rounded-full cursor-pointer"
                            onClick={() => router.back()}
                        />
                        <ChevronRightIcon
                            className="w-8 h-8 bg-gray-100 p-1 rounded-full cursor-pointer"
                        />
                        {pathname === '/collection/playlists' || pathname === '/collection/albums' || pathname === '/collection/artists' ? (
                            <div className="flex justify-between ml-7 inline-block align-middle">
                                <Link href="/collection/playlists">
                                    <p className={`cursor-pointer text-sm text-gray-700 p-2 px-4 rounded-lg ${pathname === '/collection/playlists' ? 'bg-gray-100' : ''}`}>
                                        Playlists
                                    </p>
                                </Link>
                                <Link href="/collection/artists">
                                    <p className={`cursor-pointer text-sm text-gray-700 p-2 px-4 rounded-lg ${pathname === '/collection/artists' ? 'bg-gray-100' : ''}`}>
                                        Artists
                                    </p>
                                </Link>
                                <Link href="/collection/albums">
                                    <p className={`cursor-pointer text-sm text-gray-700 p-2 px-4 rounded-lg ${pathname === '/collection/albums' ? 'bg-gray-100' : ''}`}>
                                        Albums
                                    </p>
                                </Link>
                            </div>
                            ) : ''}
                    </div>
                    <div className="mt-4 flex sm:mt-0 sm:ml-4">
                        <button
                            type="button"
                            className="order-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:order-1 sm:ml-3"
                        >
                            Create playlist
                        </button>
                    </div>
                </div>
                {children}
            </main>
        </div>
    )
}

export default Header
