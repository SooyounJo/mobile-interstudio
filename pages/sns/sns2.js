import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Bar from '../../components/Bar';
import { useAnimations } from '../../hooks/useInteractions';

export default function SNS2() {
  const router = useRouter();
  
  const { 
    activeBar, 
    setActiveBar, 
    animatingButton 
  } = useAnimations();

  // 슬라이딩 상태 관리
  const [currentPage, setCurrentPage] = React.useState(0); // 0: sn.png, 1: day1.png
  const [slideOffset, setSlideOffset] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState(null);

  // 터치/마우스 시작
  const handleStart = (clientX) => {
    setDragStart(clientX);
    setIsDragging(true);
  };

  // 터치/마우스 이동
  const handleMove = (clientX) => {
    if (!isDragging || !dragStart) return;
    
    const deltaX = clientX - dragStart;
    
    // 현재 페이지에 따라 드래그 제한
    if (currentPage === 0) {
      // sn.png 페이지에서는 좌측 드래그만 허용
      setSlideOffset(Math.min(0, deltaX));
    } else {
      // day1.png 페이지에서는 우측 드래그만 허용  
      setSlideOffset(Math.max(0, deltaX));
    }
  };

  // 터치/마우스 종료 - 스냅 애니메이션
  const handleEnd = () => {
    const threshold = 100; // 페이지 전환 임계값
    
    if (currentPage === 0 && slideOffset <= -threshold) {
      // 좌측으로 충분히 드래그 → day1 페이지로 전환
      setCurrentPage(1);
      setSlideOffset(-window.innerWidth);
      setTimeout(() => setSlideOffset(0), 300);
    } else if (currentPage === 1 && slideOffset >= threshold) {
      // 우측으로 충분히 드래그 → sn 페이지로 전환
      setCurrentPage(0);  
      setSlideOffset(window.innerWidth);
      setTimeout(() => setSlideOffset(0), 300);
    } else {
      // 임계값 미달 → 원래 위치로 복귀
      setSlideOffset(0);
    }
    
    setDragStart(null);
    setIsDragging(false);
  };

  // 화면 좌측/우측 터치로 페이지 전환
  const handleScreenTap = (e) => {
    // 드래그 중이면 무시
    if (isDragging) return;
    
    const screenWidth = window.innerWidth;
    const tapX = e.clientX;
    const leftZone = screenWidth * 0.3; // 좌측 30% 영역
    const rightZone = screenWidth * 0.7; // 우측 30% 영역
    
    if (tapX < leftZone && currentPage === 1) {
      // 좌측 터치 → sn 페이지로 전환
      setCurrentPage(0);
      setSlideOffset(window.innerWidth);
      setTimeout(() => setSlideOffset(0), 300);
    } else if (tapX > rightZone && currentPage === 0) {
      // 우측 터치 → day1 페이지로 전환
      setCurrentPage(1);
      setSlideOffset(-window.innerWidth);
      setTimeout(() => setSlideOffset(0), 300);
    }
  };

  return (
    <>
      <Head>
        <title>SNS2</title>
        <meta name="description" content="SNS2 페이지" />
      </Head>
      
      <div
        style={{
          width: '100vw',
          minHeight: '100vh',
          background: '#000',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          overflow: 'visible',
        }}
      >
        <div 
          style={{ width: '100%', maxWidth: 480, position: 'relative' }}
          onClick={handleScreenTap}
        >
          {/* 배경 이미지 - sns.png */}
          <img
            src="/sns/sns.png"
            alt="SNS 배경"
            style={{
              width: '100vw',
              maxWidth: 480,
              height: 'auto',
              objectFit: 'contain',
              objectPosition: 'top center',
              display: 'block',
              background: '#000',
              zIndex: 1,
            }}
          />

          {/* 화면 터치 영역 안내 */}
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '8px 16px',
            color: '#fff',
            fontSize: '12px',
            zIndex: 10,
            pointerEvents: 'none',
          }}>
            {currentPage === 0 ? '우측 터치 →' : '← 좌측 터치'}
          </div>
          
          {/* day1.png 페이지 */}
          <img
            src="/sns/day1.png"
            alt="Day 1"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(calc(-50% + ${slideOffset + (currentPage === 1 ? 0 : window.innerWidth || 480)}px), -50%)`,
              width: '72vw',
              maxWidth: 345,
              height: 'auto',
              objectFit: 'contain',
              objectPosition: 'center',
              display: 'block',
              background: 'transparent',
              zIndex: 2,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out',
            }}
          />
          
          {/* sn.png 페이지 */}
          <img
            src="/sns/sn.png"
            alt="SN"
            style={{
              position: 'absolute',
              top: 'calc(50% - 50px)',
              left: '50%',
              transform: `translate(calc(-50% + ${slideOffset + (currentPage === 0 ? 0 : -(window.innerWidth || 480))}px), -50%)`,
              width: '75vw',
              maxWidth: 360,
              height: 'auto',
              objectFit: 'contain',
              objectPosition: 'center',
              display: 'block',
              background: 'transparent',
              zIndex: 3,
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              transition: isDragging ? 'none' : 'transform 0.3s ease-out',
            }}
            // 터치 이벤트 (이벤트 전파 중단)
            onTouchStart={(e) => {
              e.stopPropagation();
              handleStart(e.touches[0].clientX);
            }}
            onTouchMove={(e) => {
              e.stopPropagation();
              handleMove(e.touches[0].clientX);
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              handleEnd();
            }}
            // 마우스 이벤트 (이벤트 전파 중단)
            onMouseDown={(e) => {
              e.stopPropagation();
              handleStart(e.clientX);
            }}
            onMouseMove={(e) => {
              e.stopPropagation();
              handleMove(e.clientX);
            }}
            onMouseUp={(e) => {
              e.stopPropagation();
              handleEnd();
            }}
            onMouseLeave={(e) => {
              e.stopPropagation();
              handleEnd();
            }}
          />
          
          {/* 미니바 - 최상위 레이어 */}
          <Bar 
            activeBar={activeBar}
            setActiveBar={setActiveBar}
            animatingButton={animatingButton}
            router={router}
          />
        </div>
      </div>
    </>
  );
} 