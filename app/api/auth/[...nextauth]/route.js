import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "../../../../lib/spotify";
async function refreshAccessToken(token) {
    try {
        spotifyApi.setAccessToken(token.accessToken);
        spotifyApi.setRefreshToken(token.refreshToken);

        const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

        return {
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
        };
    } catch (error) {
        return { ...token, error: "RefreshAccessTokenError" };
    }
}

export const authOptions = {
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_ID,
            clientSecret: process.env.SPOTIFY_SECRET,
            authorization: LOGIN_URL,
        }),
    ],
    secret: process.env.JWT_SECRET,
    pages: { signIn: "/login" },
    callbacks: {
        async jwt({ token, account, user }) {
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    username: account.providerAccountId,
                    accessTokenExpires: account.expires_at * 1000,
                };
            }

            if (Date.now() < token.accessTokenExpires) return token;
            return refreshAccessToken(token);
        },
        async session({ session, token }) {
            session.user.accessToken = token.accessToken;
            session.user.refreshToken = token.refreshToken;
            session.user.username = token.username;
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

// IMPORTANT: no default export in App Router routes
export { handler as GET, handler as POST };
