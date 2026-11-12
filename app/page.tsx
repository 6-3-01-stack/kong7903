'use client';

import { FormEvent, useEffect, useState } from 'react';

const features = [
  '코드 생성',
  '이미지 생성',
  '동영상 생성',
  '상담',
  '지식 질문',
  '노래 생성',
];

export default function HomePage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<{ nickname: string } | null>(null);
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

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
            로그인 완료 상태입니다. 아래 기능 카드들을 확장해
            실제 AI 생성 API를 연결할 수 있습니다.
          </p>
        </section>

        <section className="feature-grid">
          {features.map((feature) => (
            <div key={feature} className="feature-card">
              <div className="feature-badge">AI</div>
              <h3>{feature}</h3>
              <p>준비 중 / 연결 가능</p>
            </div>
          ))}
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
