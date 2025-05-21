import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SNSPage() {
  const [activeBar, setActiveBar] = useState(2); // sns가 2번 버튼
  const [showModal, setShowModal] = useState(true);
  const [showAddBtn, setShowAddBtn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      const scrollY = window.scrollY || window.pageYOffset;
      const winH = window.innerHeight;
      const docH = document.body.scrollHeight;
      // 진짜 맨 아래까지 도달해야만 버튼 노출
      if (scrollY + winH >= docH - 2) setShowAddBtn(true);
      else setShowAddBtn(false);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#fff', position: 'relative' }}>
      {/* 새로운 일기 생성 질문 모달 */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.18)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 18,
            boxShadow: '0 4px 24px 0 #2563eb22',
            padding: '32px 24px 20px 24px',
            minWidth: 260,
            maxWidth: 320,
            textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 18 }}>새로운 일기 생성</div>
            <div style={{ fontSize: 15, color: '#444', marginBottom: 24 }}>새로운 일기를 작성하시겠습니까?</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                style={{
                  background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 500, fontSize: 15, cursor: 'pointer',
                  boxShadow: '0 2px 8px #2563eb22',
                }}
                onClick={() => router.push('/map')}
              >수락</button>
              <button
                style={{
                  background: '#eee', color: '#333', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 500, fontSize: 15, cursor: 'pointer',
                }}
                onClick={() => setShowModal(false)}
              >취소</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ width: '100vw', maxWidth: 480, margin: '0 auto', paddingTop: 0, paddingBottom: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
        <img src="/sns/sns3.png" alt="sns3" style={{ width: '100vw', maxWidth: 480, height: 'auto', objectFit: 'contain', display: 'block' }} />
      </div>
      {/* 하단 minibar.png 배경 + 선택 바 버튼 3개 */}
      <img
        src="/app/minibar.png"
        alt="minibar"
        style={{
          position: 'fixed',
          left: '50%',
          bottom: -10,
          width: '100%',
          maxWidth: 480,
          minWidth: 0,
          zIndex: 30,
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />
      <div
        style={{
          position: 'fixed',
          left: '50%',
          bottom: -10,
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          zIndex: 31,
          width: '100%',
          maxWidth: 480,
          justifyContent: 'center',
          pointerEvents: 'auto',
        }}
      >
        {[1,2,3].map(num => (
          <button
            key={num}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              margin: '0 27px',
              width: 72,
              height: 72,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.18s cubic-bezier(.4,0,.2,1)',
              transform: activeBar === num ? 'scale(1.18)' : 'scale(1.0)',
            }}
            onClick={() => {
              setActiveBar(num);
              if(num === 1) router.push('/');
              if(num === 2) router.push('/sns');
              if(num === 3) router.push('/fullmap');
            }}
          >
            <img
              src={`/bar/${num}.png`}
              alt={`버튼${num}`}
              style={{ width: 72, height: 72, objectFit: 'contain', userSelect: 'none', pointerEvents: 'none' }}
            />
          </button>
        ))}
      </div>
      {/* 추억 추가하기 버튼 (맨 아래에서 300px 위, 스크롤이 끝까지 내려가야만 노출) */}
      {showAddBtn && (
        <div style={{ width: '100vw', maxWidth: 480, margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '32px 0 32px 0', marginBottom: 300 }}>
          <button
            style={{
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: 24,
              padding: '16px 38px',
              fontSize: 18,
              fontWeight: 600,
              boxShadow: '0 4px 16px #2563eb22',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onClick={() => router.push('/map')}
          >
            추억 추가하기
          </button>
        </div>
      )}
    </div>
  );
} 