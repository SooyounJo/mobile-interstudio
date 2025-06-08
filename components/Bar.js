import React, { memo, useState } from 'react';

const Bar = memo(({ activeBar, setActiveBar, animatingButton, router }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 부드러운 페이지 전환 함수
  const handleNavigation = (num, path) => {
    if (isTransitioning) return; // 전환 중이면 무시
    
    setActiveBar(num);
    setIsTransitioning(true);
    
    // 현재 페이지와 같으면 전환하지 않음
    if (router.asPath === path) {
      setIsTransitioning(false);
      return;
    }
    
    // 페이지 전환 애니메이션
    document.body.style.opacity = '0.7';
    document.body.style.transition = 'opacity 0.4s ease-out';
    
    setTimeout(() => {
      router.push(path).then(() => {
        setTimeout(() => {
          document.body.style.opacity = '1';
          setIsTransitioning(false);
        }, 200);
      });
    }, 400);
  };
  return (
    <>
      {/* 하단 bar.png 배경 */}
      <img
        src="/bar/bar.png"
        alt="bar"
        style={{
          position: 'fixed',
          left: '50%',
          bottom: -10,
          width: '100vw',
          height: 'auto',
          zIndex: 30,
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />
      
      {/* 버튼들 */}
      <div
        style={{
          position: 'fixed',
          left: '50%',
          bottom: 5,
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
        {[4, 5, 6].map(num => (
          <button
            key={num}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              margin: '0 47px',
              width: 50,
              height: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.18s cubic-bezier(.4,0,.2,1), opacity 0.2s ease',
              transform: activeBar === num ? 'scale(1.18)' : 
                        animatingButton === num ? 'scale(1.15)' : 'scale(1.0)',
              cursor: isTransitioning ? 'not-allowed' : 'pointer',
              opacity: isTransitioning ? 0.6 : 1,
            }}
            onClick={() => {
              if (num === 4) handleNavigation(4, '/');
              if (num === 5) handleNavigation(5, '/sns/sns2');
              if (num === 6) handleNavigation(6, '/fullmap');
            }}
            onMouseEnter={e => {
              if (activeBar !== num) e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={e => {
              if (activeBar !== num) e.currentTarget.style.transform = 'scale(1.0)';
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={e => {
              if (activeBar === num) {
                e.currentTarget.style.transform = 'scale(1.18)';
              } else {
                e.currentTarget.style.transform = 'scale(1.1)';
              }
            }}
          >
            <img
              src={`/bar/${num}.png`}
              alt={`버튼${num}`}
              style={{ 
                width: 50, 
                height: 50, 
                objectFit: 'contain', 
                userSelect: 'none', 
                pointerEvents: 'none' 
              }}
            />
          </button>
        ))}
      </div>
    </>
  );
});

Bar.displayName = 'Bar';

export default Bar; 