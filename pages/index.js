import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import IntroAnimation from '../public/app/intro';

export default function AppMainImage() {
  const [floatY, setFloatY] = useState(0);
  const [showSew, setShowSew] = useState(false);
  const [sewAppear, setSewAppear] = useState(false);
  const [cloOpacity, setCloOpacity] = useState(1);
  const [activeBar, setActiveBar] = useState(null);
  const [isFirstEntry, setIsFirstEntry] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // sew가 이미 보여졌다면 리로드해도 보이도록 설정
    if (typeof window !== 'undefined' && window.sessionStorage.getItem('closie_sew_shown')) {
      setShowSew(true);
      setSewAppear(true);
    }
  }, []);

  // clo.png 위아래 부드러운 애니메이션
  useEffect(() => {
    let raf;
    const animate = () => {
      setFloatY(Math.sin(Date.now() * 0.002) * 12); // -12~+12px
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      {isFirstEntry && <IntroAnimation />}
      <div
        style={{
          width: '100vw',
          minHeight: '100vh',
          background: '#000',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          overflowY: 'auto',
        }}
      >
        <div style={{ width: '100%', maxWidth: 480, position: 'relative' }}>
          {/* 공중에 떠있는 clo.png */}
          <img
            src="/app/clo.png"
            alt="clo"
            style={{
              position: 'absolute',
              top: 200 + floatY,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '64vw',
              maxWidth: 310,
              height: 'auto',
              objectFit: 'contain',
              zIndex: 20,
              pointerEvents: 'none',
              userSelect: 'none',
              filter: 'drop-shadow(0 8px 16px rgba(37,99,235,0.18))',
              transition: 'filter 0.2s, opacity 2s',
              opacity: cloOpacity,
            }}
          />
          {/* 8초 뒤 자동 등장하는 sew.png */}
          {showSew && (
            <img
              src="/app/sew.png"
              alt="sew"
              style={{
                position: 'absolute',
                top: 550,
                left: '50%',
                width: '100vw',
                maxWidth: 480,
                height: 'auto',
                objectFit: 'contain',
                transform: `translate(-50%, 0) scaleX(${sewAppear ? 1 : 0})`,
                transformOrigin: 'right center',
                opacity: sewAppear ? 1 : 0,
                zIndex: 21,
                pointerEvents: 'none',
                userSelect: 'none',
                transition: 'transform 0.7s cubic-bezier(.4,0,.2,1), opacity 0.5s',
                boxShadow: '0 8px 24px 0 #2563eb22',
              }}
            />
          )}
          {/* 메인 이미지 */}
          <img
            src="/app/main4.png"
            alt="앱 메인2"
            style={{
              width: '100vw',
              maxWidth: 480,
              minHeight: '100vh',
              height: 'auto',
              objectFit: 'contain',
              objectPosition: 'top center',
              display: 'block',
              background: '#000',
            }}
          />
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
        </div>
      </div>
    </>
  );
}
