import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Bar from '../../components/Bar';
import { useAnimations } from '../../hooks/useInteractions';

const images = [
  '/sns/sn.png',
  '/sns/day1.png',
  '/sns/sn2.png',
];

const SNS2 = () => {
  const router = useRouter();
  const [pageOpacity, setPageOpacity] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(0); // 0: sn.png, 1: sn2.png, 2: sn3.png
  const [fade, setFade] = React.useState(true); // 페이드 효과 상태
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

  // 좌/우 클릭 핸들러
  const handleZoneClick = (dir) => {
    if ((dir === 'left' && currentPage === 0) || (dir === 'right' && currentPage === images.length)) return;
    setFade(false);
    setTimeout(() => {
      setCurrentPage(prev => dir === 'left' ? prev - 1 : prev + 1);
      setFade(true);
    }, 220); // fade-out 후 이미지 변경
  };

  // 마지막 안내 문구 및 미니 모달
  const isLastPage = currentPage === images.length;

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
          style={{ width: '100%', maxWidth: 480, position: 'relative', height: '100vh' }}
        >
          {/* 좌/우 클릭 영역 */}
          {!isLastPage && (
            <>
              <div
                onClick={() => handleZoneClick('left')}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '32%',
                  height: '100%',
                  zIndex: 10,
                  cursor: currentPage > 0 ? 'pointer' : 'default',
                }}
              />
              <div
                onClick={() => handleZoneClick('right')}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  width: '32%',
                  height: '100%',
                  zIndex: 10,
                  cursor: currentPage < images.length - 1 ? 'pointer' : 'default',
                }}
              />
            </>
          )}
          {/* 이미지 or 안내문구 */}
          {!isLastPage ? (
            <img
              key={currentPage}
              src={images[currentPage]}
              alt={`SNS${currentPage + 1}`}
              loading="lazy"
              decoding="async"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '68vw',
                maxWidth: 325,
                height: 'auto',
                objectFit: 'contain',
                objectPosition: 'center',
                display: 'block',
                background: 'transparent',
                zIndex: 3,
                userSelect: 'none',
                opacity: fade ? 1 : 0,
                transition: 'opacity 0.22s cubic-bezier(0.33, 1, 0.68, 1)',
              }}
              onTransitionEnd={() => {}}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90vw',
                maxWidth: 340,
                background: 'rgba(255,255,255,0.97)',
                borderRadius: 18,
                boxShadow: '0 6px 32px #2563eb33',
                padding: '36px 18px 48px 18px',
                textAlign: 'center',
                fontSize: 18,
                fontWeight: 600,
                color: '#222',
                zIndex: 20,
                lineHeight: 1.7,
                opacity: fade ? 1 : 0,
                transition: 'opacity 0.22s cubic-bezier(0.33, 1, 0.68, 1)',
              }}
            >
              사진을 찍어 <span style={{ color: '#2563eb', fontWeight: 800 }}>클로지</span>와 함께한 기록을<br/>그의 SNS에 남겨보세요!<br/><br/>
              <span style={{ fontWeight: 400, color: '#444', fontSize: 15, display: 'block', margin: '0 0 0 0' }}>
                사진을 찍으면 <span style={{ color: '#2563eb', fontWeight: 700 }}>클로지</span>가 사진에 대한 일기를 써요!
              </span>
              {/* 미니 모달 */}
              <div
                style={{
                  marginTop: 44,
                  display: 'inline-block',
                  background: '#2563eb',
                  color: '#fff',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 700,
                  padding: '7px 18px',
                  boxShadow: '0 2px 8px #2563eb22',
                  opacity: 0.92,
                }}
              >
                추후 기능추가 예정입니다!
              </div>
            </div>
          )}
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