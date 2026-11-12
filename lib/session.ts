import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret');

export async function setSessionToken(response: Response, userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);

  const headers = new Headers(response.headers);
  headers.set(
    'Set-Cookie',
    `session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}` +
      (process.env.NODE_ENV === 'production' ? '; Secure' : '')
  );

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export async function clearSessionToken(response: Response) {
  const headers = new Headers(response.headers);
  headers.set(
    'Set-Cookie',
    'session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0' +
      (process.env.NODE_ENV === 'production' ? '; Secure' : '')
  );

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export async function getSessionUserId(request: NextRequest) {
  const token = request.cookies.get('session')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return typeof payload.userId === 'string' ? payload.userId : null;
  } catch {
    return null;
  }
}
