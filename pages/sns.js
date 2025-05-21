import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SNSPage() {
  const [activeBar, setActiveBar] = useState(2); // sns가 2번 버튼
  const [showModal, setShowModal] = useState(true);
  const [showAddBtn, setShowAddBtn] = useState(false);
  const [newFeed, setNewFeed] = useState(null);
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

  // 저장된 newFeed 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const feed = localStorage.getItem('newFeed');
      if (feed) {
        setNewFeed(JSON.parse(feed));
        localStorage.removeItem('newFeed');
      }
    }
  }, []);

  // #new로 이동 시 하단 스크롤
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#new') {
      setTimeout(() => {
        const el = document.getElementById('new-feed-anchor');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 200);
    }
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
      {/* 예시 사각형(저장된 사진)이 sns3.png 위에 겹쳐서 오버레이 */}
      <div style={{ width: '100vw', maxWidth: 480, margin: '0 auto', paddingTop: 0, paddingBottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        {/* 날짜 텍스트 */}
        {newFeed && (
          <div style={{ position: 'absolute', top: '1865px', left: 'calc(50% - 120px)', transform: 'translateX(0, 0)', marginBottom: 10, fontWeight: 700, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontSize: 18, color: '#000', zIndex: 11, background: 'none', textAlign: 'center' }}>
            {newFeed.date}
          </div>
        )}
        <div style={{ position: 'absolute', top: '1950px', left: '50%', transform: 'translate(-50%, 0)', width: 240, height: 240, borderRadius: 32, background: '#eaeaea', boxShadow: '0 2px 8px #bbb6', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, overflow: 'hidden', padding: 0 }}>
          {newFeed && (
            <img
              src={newFeed.photo}
              alt="추가된 추억"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 32,
                objectFit: 'cover',
                margin: 0,
                padding: 0
              }}
            />
          )}
        </div>
        {/* AI 글 임시 박스 */}
        {newFeed && (
          <div style={{ position: 'absolute', top: '2230px', left: '50%', transform: 'translate(-50%, 0)', width: 220, height: 60, borderRadius: 18, background: '#f3f3f3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: 16, marginTop: 18, zIndex: 10, textAlign: 'center' }}>
            (AI 글 자리)
          </div>
        )}
        {/* 줄거리 임시 박스 */}
        {newFeed && (
          <div style={{ position: 'absolute', top: '2300px', left: '50%', transform: 'translate(-50%, 0)', width: 220, height: 60, borderRadius: 18, background: '#f3f3f3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: 16, marginTop: 18, zIndex: 10, textAlign: 'center' }}>
            (줄거리 자리)
          </div>
        )}
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
        <div style={{ width: '100vw', maxWidth: 480, margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px 0 16px 0', marginBottom: 0 }}>
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