import React, { useState } from 'react';

export default function Intro({ onFinish }) {
  const [name, setName] = useState('');
  const [fade, setFade] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    localStorage.setItem('userName', name.trim());
    setFade(true);
    setTimeout(() => {
      onFinish(name.trim());
    }, 1200); // 애니메이션 시간
  };

  return (
    <div
      style={{
        position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 9999,
        background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'opacity 1.2s',
        opacity: fade ? 0 : 1,
        pointerEvents: fade ? 'none' : 'auto',
      }}
    >
      <div style={{ position: 'relative', width: '100vw', maxWidth: 480, height: '100vh', maxHeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src="/app/appmain.png"
          alt="인트로"
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100vw',
            maxWidth: 480,
            height: '100vh',
            maxHeight: 800,
            objectFit: 'cover',
            borderRadius: 0,
            boxShadow: '0 4px 24px #2563eb22',
            zIndex: 1,
          }}
        />
        <form
          onSubmit={handleSubmit}
          style={{
            position: 'absolute',
            left: 0,
            width: '100%',
            bottom: '12%', // 이미지 하단 20% 부근
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
            zIndex: 2,
            background: 'rgba(255,255,255,0.0)',
          }}
        >
          <input
            type="text"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{
              fontSize: 10, padding: '6px 12px', borderRadius: 8, border: '1px solid #ccc', marginBottom: 8,
              outline: 'none', textAlign: 'center', background: '#fff', boxShadow: '0 2px 8px #bbb6', width: 120
            }}
          />
          <button
            type="submit"
            style={{
              background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8,
              padding: '5px 16px', fontSize: 10, fontWeight: 600, cursor: 'pointer'
            }}
          >
            시작하기
          </button>
        </form>
      </div>
    </div>
  );
} 