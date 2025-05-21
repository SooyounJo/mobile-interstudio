import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function SNSPage() {
  const [activeBar, setActiveBar] = useState(2); // sns가 2번 버튼
  const router = useRouter();
  return (
    <div style={{ minHeight: '100vh', background: '#fff', position: 'relative' }}>
      <div style={{ width: '100%', maxWidth: 480, margin: '0 auto', paddingTop: 0, paddingBottom: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
        <img src="/sns/sns1.png" alt="sns1" style={{ width: '100%', maxWidth: 480, height: '100vh', objectFit: 'cover', marginBottom: 48, display: 'block' }} />
        <img src="/sns/sns2.png" alt="sns2" style={{ width: '100%', maxWidth: 480, height: '100vh', objectFit: 'cover', marginTop: 0, paddingTop: 120, display: 'block' }} />
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
  );
} 