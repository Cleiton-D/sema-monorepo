import { NextRequest } from 'next/server';

export async function getMiddlewareSession<T = any>(
  req: NextRequest
): Promise<T | null> {
  try {
    const cookie = req.headers.get('cookie');

    const options = cookie ? { headers: { cookie } } : {};

    const baseUrl = `${process.env.NEXTAUTH_URL_INTERNAL}/api/auth`;
    const res = await fetch(`${baseUrl}/session`, options);

    const data = await res.json();
    if (!res.ok) throw data;
    return Object.keys(data).length > 0 ? data : null; // Return null if data empty
  } catch (error) {
    return null;
  }
}
