import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';

  if (!prompt) {
    return NextResponse.json(
      { error: '코드 생성 요청 내용을 입력해주세요.' },
      { status: 400 }
    );
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert software engineer. Write clear code, explain it briefly, and provide a useful example in Korean.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.5,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      {
        error: data?.error?.message ?? '코드 생성 중 오류가 발생했습니다.',
      },
      { status: response.status }
    );
  }

  const answer = data?.choices?.[0]?.message?.content ?? '코드를 생성하지 못했습니다.';
  return NextResponse.json({ answer });
}
