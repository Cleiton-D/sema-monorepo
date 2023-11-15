import { redirect } from '@remix-run/node';
import { sealData, unsealData } from 'iron-session'

import type { User } from '@/models/user';

import createForeignCookie from './create-foreign-cookie.server';

export type Session = {
    token?: string
}

export const sessionOptions = {
    password: '5a0R8GsYz@!RblV4bRLQ1a1*Xpz^3OTL',
    cookieName: 'sema.3WGc5Lm3l9m',
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    secure: process.env.NODE_ENV === "production",
    ttl: 1200000,
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production'
    }
  };


export const authCookie = createForeignCookie(sessionOptions.cookieName, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: sessionOptions.ttl,
    sameSite: "lax",
    path: "/",
})

export async function getIronSession(request: Request): Promise<Session | null> {
    const cookieHeader = request.headers.get('Cookie');
    const cookieValue = await authCookie.parse(cookieHeader, {decode: (value) => value})
    if (!cookieValue) return null;

    return unsealData(cookieValue, sessionOptions)
}

export async function createUserSession(request: Request, token: string) {
    const session = await getIronSession(request) || {}
    session.token = token

    const cookieValue = await sealData(session, sessionOptions)

    const serialized = await authCookie.serialize(cookieValue)
    return redirect('/', ({
        headers: {
            'Set-Cookie': serialized
        }
    }))
}

function getUserSession(request: Request) {
    // return storage.getSession(request.headers.get('Cookie'))
}

export async function getUserId(request: Request) {
    // const session = await getUserSession(request);
    // const userId = session.get("userId");
    
    // if (!userId || typeof userId !== 'string') return null
    // return userId
}

export async function getUser(request: Request, token: string): Promise<User> {
    try {
        const user = await fetch(`${process.env.SERVER_API_URL}/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => response.json())

        return user
    } catch {
        throw logout(request)
    }
}

export async function requireUserId(request: Request, redirectTo: string = new URL(request.url).pathname) {
    // const session = await getUserSession(request);
    // const userId = session.get("userId")
    // if (!userId || typeof userId !== "string") {
    //     const searchParams = new URLSearchParams([
    //       ["redirectTo", redirectTo],
    //     ]);
    //     throw redirect(`/sign-in?${searchParams}`);
    // }

    // return userId
}

type LoginForm = {
    username: string;
    password: string;
}

export async function login({username, password}:LoginForm) {
    try {
        const response = await fetch(`${process.env.SERVER_API_URL}/sessions`, {
            method: 'POST',
            body: JSON.stringify({login: username, password}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())

        return response
    } catch {
        return null
    }
}


export async function logout(request: Request) {
    // const session = await getUserSession(request)

    // return redirect('/sign-in', {
    //     headers: {
    //         'Set-Cookie': await storage.destroySession(session)
    //     }
    // })
}