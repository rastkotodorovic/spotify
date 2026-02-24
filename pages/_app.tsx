import '../styles/globals.css'
import type {AppProps} from 'next/app'
import { SessionProvider } from "next-auth/react"
import Layout from "../components/layout/Layout"

function MyApp({ Component, pageProps: { session, ...pageProps }, ...appProps }: AppProps) {
    if (appProps.router.pathname === '/login') {
        return (
            <SessionProvider session={session}>
                <Component {...pageProps} />
            </SessionProvider>
        )
    }

    return (
        <SessionProvider session={session}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </SessionProvider>
    )
}

export default MyApp
