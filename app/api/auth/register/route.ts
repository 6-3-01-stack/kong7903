import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { setSessionToken } from '@/lib/session';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const nickname = body?.nickname?.trim();
  const password = body?.password;

  if (
    typeof nickname !== 'string' ||
    nickname.length < 2 ||
    nickname.length > 20 ||
    typeof password !== 'string' ||
    password.length < 8
  ) {
    return NextResponse.json(
      { error: '닉네임은 2~20자, 비밀번호는 8자 이상이어야 합니다.' },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { nickname } });
  if (existing) {
    return NextResponse.json(
      { error: '이미 사용 중인 닉네임입니다.' },
      { status: 409 }
    );
  }

  const user = await prisma.user.create({
    data: {
      nickname,
      passwordHash: await hash(password, 12),
    },
    select: { id: true, nickname: true },
  });

  const response = NextResponse.json({ user });
  const cookieResponse = await setSessionToken(response, user.id);
  return cookieResponse;
}
