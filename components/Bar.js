import React, { memo } from 'react';

const Bar = memo(({ activeBar, setActiveBar, animatingButton, router }) => {
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
              cursor: 'pointer',
            }}
            onClick={() => {
              setActiveBar(num);
              if (num === 4) router.push('/');
              if (num === 5) router.push('/sns/sns2');
              if (num === 6) router.push('/fullmap');
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