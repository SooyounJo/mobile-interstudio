import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function IntroAnimation() {
  const [fadeIntro, setFadeIntro] = useState(false);
  const [showName, setShowName] = useState(false);
  const [userName, setUserName] = useState('');
  const [showInput, setShowInput] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // intro.png 페이드아웃 애니메이션
    const timer1 = setTimeout(() => {
      setFadeIntro(true);
    }, 2000);

    // name.png 표시
    const timer2 = setTimeout(() => {
      setShowName(true);
    }, 3000);

    return () => {
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
      // index 페이지로 이동
      router.push({
        pathname: '/',
        query: { from: 'intro' }
      }, '/');
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
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '480px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* intro.png 이미지 */}
        <div style={{
          position: 'relative',
          width: '100%',
          paddingTop: '100%', // 1:1 비율 유지
          overflow: 'hidden',
        }}>
          <img
            src="/app/intro.png"
            alt="인트로"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'top center',
              opacity: fadeIntro ? 0 : 1,
              transition: 'opacity 1s ease',
            }}
          />
        </div>
        
        {/* name.png 이미지와 입력 필드 */}
        {showName && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              paddingTop: '100%', // 1:1 비율 유지
              overflow: 'hidden',
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
                  objectFit: 'contain',
                  objectPosition: 'top center',
                }}
              />
              
              {/* 이름 입력 영역 */}
              <div 
                onClick={handleNameClick}
                style={{
                  position: 'absolute',
                  top: '50%',
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
            </div>
            
            {/* 다음 버튼 */}
            <button
              onClick={handleNext}
              style={{
                position: 'absolute',
                bottom: '40px',
                right: '40px',
                padding: '12px 24px',
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s ease',
                zIndex: 10,
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 