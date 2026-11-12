import { NextResponse } from 'next/server';
import { clearSessionToken } from '@/lib/session';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  return clearSessionToken(response);
}
