import { compare } from 'bcryptjs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { setSessionToken } from '@/lib/session';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const nickname = body?.nickname?.trim();
  const password = body?.password;

  if (typeof nickname !== 'string' || typeof password !== 'string') {
    return NextResponse.json(
      { error: '닉네임과 비밀번호를 입력하세요.' },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { nickname } });
  if (!user || !(await compare(password, user.passwordHash))) {
    return NextResponse.json(
      { error: '닉네임 또는 비밀번호를 확인하세요.' },
      { status: 401 }
    );
  }

  const response = NextResponse.json({
    user: { id: user.id, nickname: user.nickname },
  });

  return setSessionToken(response, user.id);
}
