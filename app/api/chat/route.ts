import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';

  if (!prompt) {
    return NextResponse.json(
      { error: '질문 내용을 입력해주세요.' },
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
            'You are a helpful AI assistant. Answer clearly in Korean unless the user asks otherwise.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      {
        error: data?.error?.message ?? 'AI 응답 생성 중 오류가 발생했습니다.',
      },
      { status: response.status }
    );
  }

  const answer = data?.choices?.[0]?.message?.content ?? '응답을 생성하지 못했습니다.';
  return NextResponse.json({ answer });
}
