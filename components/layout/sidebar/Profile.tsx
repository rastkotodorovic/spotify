'use client'

import { Menu, Transition } from "@headlessui/react"
import { HomeIcon } from "@heroicons/react/24/outline"
import { Fragment } from "react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Profile({ session }) {
    return (
        <Menu as="div" className="px-3 relative inline-block text-left">
            <div>
                <Menu.Button className="group w-full bg-gray-100 rounded-md px-3.5 py-2 text-sm text-left font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-green-500">
                          <span className="flex w-full justify-between items-center">
                            <span className="flex min-w-0 items-center justify-between space-x-3">
                              <img
                                  className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"
                                  src={session?.user.image}
                                  alt={session?.user.name}
                              />
                              <span className="flex-1 flex flex-col min-w-0">
                                    <span className="text-gray-900 text-sm font-medium truncate">{session?.user.name}</span>
                                  <span className="text-gray-500 text-sm truncate">@{session?.user.email}</span>
                              </span>
                            </span>
                            <HomeIcon
                                className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                            />
                          </span>
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="z-10 mx-3 origin-top absolute right-0 left-0 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none">
                    <div className="py-1">
                        <Menu.Item>
                            {({ active }) => (
                                <Link href={`/users/${session.user.username}`}>
                                    <p
                                        className={classNames(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'block px-4 py-2 text-sm'
                                        )}
                                    >
                                        View profile
                                    </p>
                                </Link>
                            )}
                        </Menu.Item>
                    </div>
                    <div className="py-1">
                        <Menu.Item>
                            {({ active }) => (
                                <p
                                    className={classNames(
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                        'block px-4 py-2 text-sm'
                                    )}
                                    onClick={() => signOut()}
                                >
                                    Logout
                                </p>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
