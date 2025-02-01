'use server';

import { createUserSession } from 'teste/session/session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const schema = z.object({
  username: z
    .string({ required_error: 'Campo obrigatório' })
    .min(1, { message: 'Campo obrigatório' }),
  password: z
    .string({ required_error: 'Campo obrigatório' })
    .min(1, { message: 'Campo obrigatório' })
});

export async function createUser(_prevState: any, formData: FormData) {
  const values = {
    username: formData.get('username') as string,
    password: formData.get('password') as string
  };

  const validatedFields = schema.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      values: { username: values.username }
    };
  }

  try {
    const response = await fetch(`${process.env.SERVER_API_URL}/sessions`, {
      method: 'POST',
      body: JSON.stringify({
        login: values.username,
        password: values.password
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => response.json());

    if (!response.token) {
      return {
        error: 'Usuario ou senha invalidos',
        values: { username: values.username }
      };
    }

    const { sessionCookie, cookieName, ttl } = await createUserSession(
      response.token
    );

    const cookieStore = (await cookies()) || {};
    cookieStore.set(cookieName, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: ttl,
      sameSite: 'lax',
      path: '/'
    });
  } catch {
    return {
      error: 'Usuario ou senha invalidos',
      values: { username: values.username }
    };
  }

  redirect(`/`);
}
