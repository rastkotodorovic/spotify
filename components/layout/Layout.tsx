'use client'

import Sidebar from "./sidebar/Sidebar"
import Player from "./player/Player"
import QueuePanel from "./player/QueuePanel"
import Header from "./Header"

interface LayoutProps {
    children: React.ReactNode;
 }

export default function Layout({ children }: LayoutProps) {
    return (
      <>
          <div className="min-h-full">
              <Sidebar/>
              <Header>
                  {children}
              </Header>
          </div>
          <QueuePanel />
          <div className="fixed w-full bottom-0 ">
              <Player />
          </div>
      </>
    )
}
