'use client';

import { FormEvent, useEffect, useState } from 'react';

const features = [
  '코드 생성',
  '이미지 생성',
  '동영상 생성',
  '상담',
  '지식 질문',
  '노래 생성',
] as const;

type TabType = 'chat' | 'code' | 'image';

export default function HomePage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<{ nickname: string } | null>(null);
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [tab, setTab] = useState<TabType>('chat');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage('');

    const response = await fetch(`/api/auth/${mode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error ?? '오류가 발생했습니다.');
      return;
    }

    setUser(data.user);
    setPassword('');
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  }

  async function runAi() {
    if (!prompt.trim()) {
      setResult('프롬프트를 입력해주세요.');
      return;
    }

    setLoading(true);
    setResult('');
    setImageUrl('');

    const endpoint = tab === 'chat' ? '/api/chat' : tab === 'code' ? '/api/code' : '/api/image';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setResult(data.error ?? 'AI 요청에 실패했습니다.');
      return;
    }

    if (tab === 'image') {
      setImageUrl(`data:image/png;base64,${data.imageBase64}`);
      return;
    }

    setResult(data.answer ?? '응답이 없습니다.');
  }

  if (user) {
    return (
      <main className="page-shell">
        <header className="topbar">
          <h1>AI Studio</h1>
          <div className="topbar-user">
            <span>{user.nickname}님</span>
            <button onClick={logout} className="text-button">
              로그아웃
            </button>
          </div>
        </header>

        <section className="hero-card">
          <p className="eyebrow">ALL-IN-ONE AI</p>
          <h2>코드, 이미지, 영상, 상담, 지식, 노래를 한 번에</h2>
          <p>
            OpenAI API 키를 설정하면 실제 AI 기능이 동작합니다.
          </p>
        </section>

        <section className="feature-grid">
          {features.map((feature) => (
            <div key={feature} className="feature-card">
              <div className="feature-badge">AI</div>
              <h3>{feature}</h3>
              <p>준비 완료</p>
            </div>
          ))}
        </section>

        <section className="ai-panel">
          <div className="ai-tabs">
            <button
              className={tab === 'chat' ? 'active' : ''}
              onClick={() => setTab('chat')}
            >
              상담/지식
            </button>
            <button
              className={tab === 'code' ? 'active' : ''}
              onClick={() => setTab('code')}
            >
              코드 생성
            </button>
            <button
              className={tab === 'image' ? 'active' : ''}
              onClick={() => setTab('image')}
            >
              이미지 생성
            </button>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              tab === 'chat'
                ? '질문을 입력하세요...'
                : tab === 'code'
                  ? '생성할 코드에 대해 설명하세요...'
                  : '이미지 구성을 설명하세요...'
            }
            rows={7}
          />

          <button className="ai-submit" onClick={runAi} disabled={loading}>
            {loading ? '생성 중...' : 'AI 실행'}
          </button>

          {result && <pre className="output-box">{result}</pre>}
          {imageUrl && <img src={imageUrl} alt="AI generated" className="generated-image" />}
        </section>
      </main>
    );
  }

  return (
    <main className="auth-shell">
      <div className="auth-box">
        <p className="eyebrow">WELCOME</p>
        <h1>AI 스튜디오</h1>
        <p className="subtitle">닉네임과 비밀번호로 로그인하세요.</p>

        <form onSubmit={submit} className="auth-form">
          <input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            minLength={2}
            maxLength={20}
            required
          />
          <input
            type="password"
            placeholder="비밀번호 (8자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
          <button type="submit">
            {mode === 'login' ? '로그인' : '회원가입'}
          </button>
        </form>

        {message && <p className="error-message">{message}</p>}

        <button
          type="button"
          className="switch-button"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setMessage('');
          }}
        >
          {mode === 'login' ? '처음이신가요? 회원가입' : '이미 계정이 있나요? 로그인'}
        </button>
      </div>
    </main>
  );
}
