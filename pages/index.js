import React, { useEffect, useState } from 'react';

export default function AppMainImage() {
  const [fadeout, setFadeout] = useState(false);
  const [hide, setHide] = useState(false);
  const [floatY, setFloatY] = useState(0);
  const [showSew, setShowSew] = useState(false);
  const [sewAppear, setSewAppear] = useState(false);

  useEffect(() => {
    // 5초간 스크롤 금지
    document.body.style.overflow = 'hidden';
    const timer1 = setTimeout(() => {
      setFadeout(true);
    }, 5000); // 5초 후 fadeout 시작
    const timer2 = setTimeout(() => {
      setHide(true);
      document.body.style.overflow = 'auto'; // 스크롤 허용
    }, 6000); // fadeout 후 완전히 제거
    // 8초 뒤 sew.png 애니메이션 시작
    const timer3 = setTimeout(() => {
      setShowSew(true);
      setTimeout(() => setSewAppear(true), 10);
    }, 8000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      document.body.style.overflow = 'auto'; // 컴포넌트 언마운트 시 복구
    };
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
        {/* 오버레이 이미지 (항상 가장 위) */}
        {!hide && (
          <img
            src="/app/appmain.png"
            alt="앱 메인"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'top center',
              background: 'transparent',
              pointerEvents: 'none',
              opacity: fadeout ? 0 : 1,
              transition: 'opacity 1s ease',
              zIndex: 100,
            }}
          />
        )}
        {/* 공중에 떠있는 clo.png (appmain.png가 사라진 후에만 보임) */}
        {hide && (
          <img
            src="/app/clo.png"
            alt="clo"
            style={{
              position: 'absolute',
              top: 250 + floatY,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 320,
              height: 320,
              objectFit: 'contain',
              zIndex: 20,
              pointerEvents: 'none',
              userSelect: 'none',
              filter: 'drop-shadow(0 8px 16px rgba(37,99,235,0.18))',
              transition: 'filter 0.2s',
            }}
          />
        )}
        {/* 8초 뒤 자동 등장하는 sew.png */}
        {showSew && (
          <img
            src="/app/sew.png"
            alt="sew"
            style={{
              position: 'absolute',
              top: 540,
              left: '50%',
              width: 480,
              height: 480,
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
          src="/app/main2.png"
          alt="앱 메인2"
          style={{
            width: '100%',
            minHeight: '100vh',
            objectFit: 'contain',
            objectPosition: 'top center',
            display: 'block',
            background: '#000',
          }}
        />
        {/* 하단 minibar.png 네비게이션 */}
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
            pointerEvents: 'auto',
            userSelect: 'none',
          }}
        />
      </div>
    </div>
  );
}
