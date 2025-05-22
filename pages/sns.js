import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SNSPage() {
  const [activeBar, setActiveBar] = useState(2); // sns가 2번 버튼
  const [showAddBtn, setShowAddBtn] = useState(false);
  const [newFeed, setNewFeed] = useState(null);
  const [displayedText1, setDisplayedText1] = useState('');
  const [displayedText2, setDisplayedText2] = useState('');
  const router = useRouter();

  const text1 = "석관동 한국예술종합학교";
  const text2 = `햇살 좋은 한예종 마루 위, 수연이랑 말없이 고양이들을 바라봤어.\n그 조용한 순간이, 오늘 하루 중 가장 따뜻했어.\n\n#한예종고양이 #겨울햇살 #수연과함께`;

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

  // newFeed가 있을 때 하단으로 자동 스크롤
  useEffect(() => {
    if (newFeed && typeof window !== 'undefined') {
      // 이미지가 로드될 때까지 기다린 후 스크롤
      const timer = setTimeout(() => {
        const lastElement = document.querySelector('img[src="/sns/sns3.png"]');
        if (lastElement) {
          lastElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'end'
          });
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [newFeed]);

  useEffect(() => {
    if (!newFeed) return;
    setDisplayedText1('');
    setDisplayedText2('');
    let i = 0, j = 0;
    const type1 = () => {
      if (i < text1.length) {
        setDisplayedText1(prev => prev + text1[i]);
        i++;
        setTimeout(type1, 100);
      } else {
        // 1초 버퍼링 후 줄거리 타이핑 시작
        setTimeout(type2, 1000);
      }
    };
    const type2 = () => {
      if (j < text2.length) {
        setDisplayedText2(prev => prev + text2[j]);
        j++;
        setTimeout(type2, 40);
      }
    };
    type1();
  }, [newFeed]);

  return (
    <div style={{ minHeight: '100vh', background: '#fff', position: 'relative' }}>
      {/* 예시 사각형(저장된 사진)이 sns3.png 위에 겹쳐서 오버레이 */}
      <div style={{ width: '100vw', maxWidth: 480, margin: '0 auto', paddingTop: 0, paddingBottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        {/* 새로운 일기 작성 버튼 */}
        <button
          style={{
            position: 'absolute',
            top: 670,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '8px 20px',
            fontSize: 14,
            fontWeight: 600,
            boxShadow: '0 4px 16px #2563eb22',
            cursor: 'pointer',
            transition: 'background 0.2s',
            zIndex: 20,
          }}
          onClick={() => router.push('/map')}
        >
          새로운 일기 작성하기
        </button>

        {/* 날짜 텍스트 */}
        {newFeed && (
          <div style={{ position: 'absolute', top: '1865px', left: 'calc(50% - 170px)', transform: 'translateX(0, 0)', marginBottom: 10, fontWeight: 700, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontSize: 18, color: '#000', zIndex: 11, background: 'none', textAlign: 'center' }}>
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
        {/* AI 글 박스 */}
        {newFeed && (
          <div style={{ position: 'absolute', top: '2280px', left: '50%', transform: 'translate(-50%, 0)', width: 220, height: 'auto', borderRadius: 18, background: '#f3f3f3', padding: '12px', color: '#333', fontSize: 14, marginTop: 18, zIndex: 10, textAlign: 'center', minHeight: 60 }}>
            석관동 한국예술종합학교
          </div>
        )}
        {/* 줄거리 박스 */}
        {newFeed && (
          <div style={{ position: 'absolute', top: '2350px', left: '50%', transform: 'translate(-50%, 0)', width: 220, height: 'auto', borderRadius: 18, background: '#f3f3f3', padding: '12px', color: '#333', fontSize: 14, marginTop: 18, zIndex: 10, textAlign: 'left', lineHeight: 1.5, minHeight: 60, whiteSpace: 'pre-line' }}>
            {displayedText2}
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