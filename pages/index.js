import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AppMainImage() {
  const [fadeout, setFadeout] = useState(false);
  const [hide, setHide] = useState(false);
  const [floatY, setFloatY] = useState(0);
  const [showSew, setShowSew] = useState(false);
  const [sewAppear, setSewAppear] = useState(false);
  const [cloOpacity, setCloOpacity] = useState(0);
  const [activeBar, setActiveBar] = useState(null);
  const [isFirstEntry, setIsFirstEntry] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 최초 진입 여부 체크 (sessionStorage 활용)
    if (typeof window !== 'undefined') {
      if (window.sessionStorage.getItem('closie_intro_shown')) {
        setIsFirstEntry(false);
        setFadeout(true);
        setHide(true);
        setCloOpacity(1);
      } else {
        setIsFirstEntry(true);
        window.sessionStorage.setItem('closie_intro_shown', '1');
      }
    }
  }, []);

  useEffect(() => {
    if (!isFirstEntry) return;
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
      setTimeout(() => {
        setSewAppear(true);
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem('closie_sew_shown', '1');
        }
      }, 10);
    }, 8000);
    // clo.png 페이드인
    const timer4 = setTimeout(() => {
      setCloOpacity(1);
    }, 100); // 마운트 후 바로 페이드인 시작
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      document.body.style.overflow = 'auto'; // 컴포넌트 언마운트 시 복구
    };
  }, [isFirstEntry]);

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
        {/* 공중에 떠있는 clo.png (인트로 중에도 페이드인) */}
        <img
          src="/app/clo.png"
          alt="clo"
          style={{
            position: 'absolute',
            top: 200 + floatY,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 320,
            height: 320,
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
        {isFirstEntry && showSew && (
          <img
            src="/app/sew.png"
            alt="sew"
            style={{
              position: 'absolute',
              top: 490,
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
        {/* 오버레이 이미지 (항상 가장 위) */}
        {isFirstEntry && !hide && (
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
        {/* 메인 이미지 */}
        <img
          src="/app/main4.png"
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
                margin: '0 20px',
                cursor: 'pointer',
                outline: 'none',
                width: 80,
                height: 80,
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
                style={{ width: 80, height: 80, objectFit: 'contain', userSelect: 'none', pointerEvents: 'none' }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
