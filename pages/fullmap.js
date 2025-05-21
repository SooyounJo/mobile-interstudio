import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

const FullMapWrap = styled.div`
  min-height: 100vh;
  background: #fafdff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 0;
`;

const MapTitle = styled.h2`
  color: #2563eb;
  font-size: 22px;
  font-weight: 700;
  margin: 32px 0 18px 0;
`;

const BigMap = styled.img`
  width: 100vw;
  max-width: 600px;
  height: 60vw;
  max-height: 480px;
  object-fit: cover;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 #2563eb18;
  margin-bottom: 32px;
`;

const Info = styled.div`
  color: #2563eb;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 24px;
`;

export default function FullMap() {
  const [activeBar, setActiveBar] = useState(3); // fullmap이 3번 버튼
  const router = useRouter();
  return (
    <FullMapWrap>
      <MapTitle>지나온 위치 전체 보기</MapTitle>
      <BigMap src="/fullmap.png" alt="전체 지도" />
      <Info>지나온 위치와 기록을 한눈에 볼 수 있습니다.</Info>
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
              if(num === 2) router.push('/map');
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
    </FullMapWrap>
  );
} 