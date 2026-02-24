export const dynamic = 'force-dynamic'

import LoginProviders from "../../components/LoginProviders";

async function getAuthProviders() {
  // Fetch providers from NextAuth API at runtime to support App Router
  const res = await fetch("http://localhost:3000/api/auth/providers", { cache: "no-store" });
  console.log(res)
  if (!res.ok) return null;
  return res.json();
}

export default async function LoginPage() {
  const providers = await getAuthProviders();

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          {/*<img*/}
          {/*  className="mx-auto h-12 w-auto"*/}
          {/*  src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/1024px-Spotify_logo_without_text.svg.png"*/}
          {/*  alt="Spotify"*/}
          {/*/>*/}
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <LoginProviders providers={providers} />
      </div>
    </div>
  );
}
