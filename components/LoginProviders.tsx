"use client";

import { signIn, type ClientSafeProvider } from "next-auth/react";

type Props = {
    providers: Record<string, ClientSafeProvider> | null;
};

export default function LoginProviders({ providers }: Props) {
    if (!providers) {
        return (
            <p className="text-center text-sm text-gray-600">
                No authentication providers configured.
            </p>
        );
    }

    return (
        <>
            {Object.values(providers).map((provider) => (
                <div key={provider.id}>
                    <button
                        type="button"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                    >
                        Sign in with {provider.name}
                    </button>
                </div>
            ))}
        </>
    );
}
