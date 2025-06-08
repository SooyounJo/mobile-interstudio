import React from 'react';

// MouseFollower 컴포넌트 제거됨 - CPU 최적화를 위해

export const WelcomeMessage = ({ userName }) => {
  if (!userName) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '20px',
      padding: '8px 16px',
      color: '#fff',
      fontSize: '14px',
      fontWeight: '500',
      zIndex: 45,
      animation: 'slideDown 0.5s ease-out',
    }}>
      안녕하세요, {userName}님! 👋
    </div>
  );
};

export const ScrollIndicator = ({ showScrollIndicator }) => {
  if (!showScrollIndicator) return null;
  
  return (
    <div 
      className="shake-down slow-blink"
      style={{
        position: 'fixed',
        bottom: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 40,
        transition: 'opacity 0.5s ease-out',
      }}>
      <div style={{
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: '12px',
        fontWeight: '500',
        marginBottom: '8px',
        textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
        letterSpacing: '0.5px',
      }}>
        아래로 슬라이드
      </div>
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="rgba(255, 255, 255, 0.9)"
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
      </svg>
    </div>
  );
};

export const BackButton = ({ router }) => (
  <button
    onClick={() => router.back()}
    style={{
      position: 'fixed',
      top: '20px',
      left: '20px',
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      zIndex: 50,
      backdropFilter: 'blur(4px)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      transition: 'transform 0.2s ease, background-color 0.2s ease',
    }}
    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
  >
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="white"
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  </button>
);

// ScrollBar 컴포넌트 제거됨 - 성능 최적화를 위해 