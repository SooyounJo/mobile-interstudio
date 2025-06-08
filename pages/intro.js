import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function IntroAnimation() {
  const [fadeIntro, setFadeIntro] = useState(false);
  const [showName, setShowName] = useState(false);
  const [nameOpacity, setNameOpacity] = useState(0);
  const [userName, setUserName] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [isPreloading, setIsPreloading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const router = useRouter();

  // 백그라운드에서 메인 페이지 리소스 프리로딩
  useEffect(() => {
    // 메인 페이지 프리로드
    router.prefetch('/');
    
    // 주요 이미지들 프리로드
    const preloadImages = [
      '/app/fir.png',
      '/app/fir2.png', 
      '/app/clo.png',
      '/bar/bar.png',
      '/bar/4.png',
      '/bar/5.png',
      '/bar/6.png'
    ];

    let loadedCount = 0;
    const totalImages = preloadImages.length;

    preloadImages.forEach(src => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setIsPreloading(false);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setIsPreloading(false);
        }
      };
      img.src = src;
    });

    // 백업: 최대 3초 후에는 강제로 프리로딩 완료 처리
    const backupTimer = setTimeout(() => {
      setIsPreloading(false);
    }, 3000);

    return () => clearTimeout(backupTimer);
  }, [router]);

  useEffect(() => {
    // name.png 먼저 렌더링 (투명하게)
    const timer0 = setTimeout(() => {
      setShowName(true);
    }, 1800);

    // intro.png 페이드아웃 시작
    const timer1 = setTimeout(() => {
      setFadeIntro(true);
    }, 2000);

    // name.png 페이드인 시작 (intro 페이드아웃과 동시에)
    const timer2 = setTimeout(() => {
      setNameOpacity(1);
    }, 2000);

    return () => {
      clearTimeout(timer0);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleNext = () => {
    if (userName.trim()) {
      // 쿠키 설정
      document.cookie = 'visited=true; path=/';
      // 로컬스토리지에 이름 저장
      localStorage.setItem('userName', userName.trim());
      
      // 전환 애니메이션 시작
      setTransitioning(true);
      
      // 부드러운 그라데이션 페이드아웃 후 페이지 전환
      setTimeout(() => {
        router.push({
          pathname: '/',
          query: { from: 'intro' }
        }, '/');
      }, 800); // 페이드아웃 애니메이션 시간
    } else {
      alert('이름을 입력해주세요');
    }
  };

  const handleNameClick = () => {
    setShowInput(true);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
      zIndex: 9999,
      overflow: 'hidden',
      opacity: transitioning ? 0 : 1,
      transition: 'opacity 0.8s ease-out',
    }}>
      {/* 프리로딩 인디케이터 */}
      {isPreloading && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '8px 16px',
          color: '#fff',
          fontSize: '12px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderTop: '2px solid #fff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}></div>
          리소스 준비 중...
        </div>
      )}
      
      {/* 로딩 애니메이션을 위한 CSS */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '480px',
        height: '100%',
      }}>
        {/* intro.png 이미지 */}
        <img
          src="/app/intro.png"
          alt="인트로"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top center',
            opacity: fadeIntro ? 0 : 1,
            transition: 'opacity 1s ease',
          }}
        />
        
        {/* name.png 이미지와 입력 필드 */}
        {showName && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}>
            <img
              src="/app/name.png"
              alt="이름"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top center',
                opacity: nameOpacity,
                transition: 'opacity 1.2s ease',
              }}
            />
            
            {/* 이름 입력 영역 */}
            <div 
              onClick={handleNameClick}
              style={{
                position: 'absolute',
                top: '65%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(-3deg)',
                width: '45%',
                maxWidth: '160px',
                padding: '8px',
                textAlign: 'center',
                cursor: 'text',
              }}
            >
              {showInput ? (
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="이름을 입력하세요"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '16px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    textAlign: 'center',
                    outline: 'none',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                    transform: 'rotate(0deg)',
                  }}
                />
              ) : (
                <div style={{
                  color: '#fff',
                  fontSize: '14px',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  transform: 'rotate(0deg)',
                }}>
                  터치하여 이름 입력
                </div>
              )}
            </div>
            
            {/* 다음 버튼 */}
            <button
              onClick={handleNext}
              disabled={isPreloading || transitioning}
              style={{
                position: 'absolute',
                bottom: '40px',
                right: '40px',
                padding: '12px 24px',
                background: isPreloading ? '#94a3b8' : '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isPreloading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                zIndex: 10,
                opacity: transitioning ? 0.5 : 1,
              }}
              onMouseDown={e => !isPreloading && (e.currentTarget.style.transform = 'scale(0.98)')}
              onMouseUp={e => !isPreloading && (e.currentTarget.style.transform = 'scale(1)')}
              onMouseLeave={e => !isPreloading && (e.currentTarget.style.transform = 'scale(1)')}
            >
              {isPreloading ? '준비 중...' : transitioning ? '이동 중...' : '다음'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 