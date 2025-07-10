import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Bar from '../../components/Bar';
import { useAnimations } from '../../hooks/useInteractions';

const images = [
  '/sns/sn.png',
  '/sns/sn2.png',
  '/sns/sn3.png',
];

const SNS2 = () => {
  const router = useRouter();
  const [pageOpacity, setPageOpacity] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(0); // 0: sn.png, 1: sn2.png, 2: sn3.png
  const [slideOffset, setSlideOffset] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState(null);
  const [screenWidth, setScreenWidth] = React.useState(480);

  // Bar 관련 상태 복구
  const { activeBar, setActiveBar, animatingButton } = useAnimations();

  React.useEffect(() => {
    const fadeInTimer = setTimeout(() => {
      setPageOpacity(1);
    }, 100);
    return () => clearTimeout(fadeInTimer);
  }, []);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateScreenWidth = () => {
        setScreenWidth(window.innerWidth);
      };
      updateScreenWidth();
      window.addEventListener('resize', updateScreenWidth);
      return () => window.removeEventListener('resize', updateScreenWidth);
    }
  }, []);

  // 최적화: 현재, 이전, 다음 이미지만 렌더링
  const getVisibleImages = () => {
    const visible = [];
    if (currentPage > 0) visible.push(currentPage - 1);
    visible.push(currentPage);
    if (currentPage < images.length - 1) visible.push(currentPage + 1);
    return visible;
  };

  const handleStart = (clientX) => {
    setDragStart(clientX);
    setIsDragging(true);
  };

  const handleMove = (clientX) => {
    if (!isDragging || dragStart === null) return;
    const deltaX = clientX - dragStart;
    if (currentPage === 0) {
      setSlideOffset(Math.min(0, deltaX));
    } else if (currentPage === images.length - 1) {
      setSlideOffset(Math.max(0, deltaX));
    } else {
      setSlideOffset(deltaX);
    }
  };

  const handleEnd = () => {
    const threshold = 100;
    if (slideOffset <= -threshold && currentPage < images.length - 1) {
      setCurrentPage(currentPage + 1);
      setSlideOffset(0);
    } else if (slideOffset >= threshold && currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setSlideOffset(0);
    } else {
      setSlideOffset(0);
    }
    setDragStart(null);
    setIsDragging(false);
  };

  const handleScreenTap = (e) => {
    if (isDragging) return;
    const tapX = e.clientX;
    const leftZone = screenWidth * 0.3;
    const rightZone = screenWidth * 0.7;
    if (tapX < leftZone && currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setSlideOffset(0);
    } else if (tapX > rightZone && currentPage < images.length - 1) {
      setCurrentPage(currentPage + 1);
      setSlideOffset(0);
    }
  };

  const SLIDE_TRANSITION = 'transform 0.3s cubic-bezier(0.33, 1, 0.68, 1)';

  // 최적화: 현재, 이전, 다음 이미지만 렌더링
  const visibleImages = getVisibleImages();

  return (
    <>
      <Head>
        <title>SNS2</title>
        <meta name="description" content="SNS2 페이지" />
      </Head>
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: '#000',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          overflow: 'hidden',
          opacity: pageOpacity,
          transition: 'opacity 0.8s ease-out',
        }}
      >
        <div
          style={{ width: '100%', maxWidth: 480, position: 'relative' }}
          onClick={handleScreenTap}
        >
          {visibleImages.map((idx) => (
            <img
              key={images[idx]}
              src={images[idx]}
              alt={`SNS${idx + 1}`}
              loading="lazy"
              decoding="async"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) translateX(${(idx - currentPage) * screenWidth + (idx === currentPage ? slideOffset : 0)}px)` ,
                width: '68vw',
                maxWidth: 325,
                height: 'auto',
                objectFit: 'contain',
                objectPosition: 'center',
                display: 'block',
                background: 'transparent',
                zIndex: 3,
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                transition: isDragging ? 'none' : SLIDE_TRANSITION,
              }}
              onTouchStart={e => {
                e.stopPropagation();
                handleStart(e.touches[0].clientX);
              }}
              onTouchMove={e => {
                e.stopPropagation();
                handleMove(e.touches[0].clientX);
              }}
              onTouchEnd={e => {
                e.stopPropagation();
                handleEnd();
              }}
              onMouseDown={e => {
                e.stopPropagation();
                handleStart(e.clientX);
              }}
              onMouseMove={e => {
                e.stopPropagation();
                handleMove(e.clientX);
              }}
              onMouseUp={e => {
                e.stopPropagation();
                handleEnd();
              }}
              onMouseLeave={e => {
                e.stopPropagation();
                handleEnd();
              }}
            />
          ))}
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
};

export default React.memo(SNS2); 