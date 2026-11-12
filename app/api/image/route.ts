import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';

  if (!prompt) {
    return NextResponse.json(
      { error: '이미지 생성 프롬프트를 입력해주세요.' },
      { status: 400 }
    );
  }

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt,
      size: '1024x1024',
      quality: 'medium',
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      {
        error: data?.error?.message ?? '이미지 생성 중 오류가 발생했습니다.',
      },
      { status: response.status }
    );
  }

  const imageBase64 = data?.data?.[0]?.b64_json ?? null;
  if (!imageBase64) {
    return NextResponse.json(
      { error: '이미지 데이터를 받지 못했습니다.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ imageBase64 });
}
