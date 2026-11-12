import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    ok: true,
    message: 'AI 기능은 OPENAI_API_KEY 설정 후 연결됩니다.',
  });
}
