import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Bar from '../../components/Bar';
import { useAnimations } from '../../hooks/useInteractions';

const SNS2 = () => {
  const router = useRouter();
  const [pageOpacity, setPageOpacity] = React.useState(0);
  
  const { 
    activeBar, 
    setActiveBar, 
    animatingButton 
  } = useAnimations();

  // 페이지 진입 시 부드러운 페이드인 효과
  React.useEffect(() => {
    const fadeInTimer = setTimeout(() => {
      setPageOpacity(1);
    }, 100);

    return () => clearTimeout(fadeInTimer);
  }, []);

  // 슬라이딩 상태 관리 - 4개 페이지로 확장
  const [currentPage, setCurrentPage] = React.useState(0); // 0: sn.png, 1: day1.png, 2: sn2.png, 3: sn3.png
  const [slideOffset, setSlideOffset] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState(null);
  const [screenWidth, setScreenWidth] = React.useState(480); // 기본값 설정
  
  // 새로 추가된 상태들
  const [hasInteracted, setHasInteracted] = React.useState(false); // 첫번째 슬라이드 인터랙션 여부
  const [showMmap, setShowMmap] = React.useState(false); // mmap.png 표시 여부
  const [capturedImage, setCapturedImage] = React.useState(null); // 촬영된 이미지
  const [showSnsTool, setShowSnsTool] = React.useState(false); // sns tool.png 표시 여부

  // 화면 크기 감지 (클라이언트에서만 실행)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateScreenWidth = () => {
        setScreenWidth(window.innerWidth);
      };
      
      updateScreenWidth(); // 초기값 설정
      window.addEventListener('resize', updateScreenWidth);
      
      return () => window.removeEventListener('resize', updateScreenWidth);
    }
  }, []);

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
      // 첫 페이지에서는 좌측 드래그만 허용
      setSlideOffset(Math.min(0, deltaX));
    } else if (currentPage === 3) {
      // 마지막 페이지에서는 우측 드래그만 허용
      setSlideOffset(Math.max(0, deltaX));
    } else {
      // 중간 페이지들은 양방향 드래그 허용
      setSlideOffset(deltaX);
    }
  };

  // 터치/마우스 종료 - 스냅 애니메이션
  const handleEnd = () => {
    const threshold = 100; // 페이지 전환 임계값
    
    if (slideOffset <= -threshold && currentPage < 3) {
      // 좌측으로 충분히 드래그 → 다음 페이지로 전환
      setCurrentPage(currentPage + 1);
      setSlideOffset(-screenWidth);
      setTimeout(() => setSlideOffset(0), 500);
      if (currentPage === 0) setHasInteracted(true); // 첫번째 인터랙션 완료
    } else if (slideOffset >= threshold && currentPage > 0) {
      // 우측으로 충분히 드래그 → 이전 페이지로 전환
      setCurrentPage(currentPage - 1);  
      setSlideOffset(screenWidth);
      setTimeout(() => setSlideOffset(0), 500);
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
    
    const tapX = e.clientX;
    const leftZone = screenWidth * 0.3; // 좌측 30% 영역
    const rightZone = screenWidth * 0.7; // 우측 30% 영역
    
    if (tapX < leftZone && currentPage > 0) {
      // 좌측 터치 → 이전 페이지로 전환
      setCurrentPage(currentPage - 1);
      setSlideOffset(screenWidth);
      setTimeout(() => setSlideOffset(0), 500);
    } else if (tapX > rightZone && currentPage < 3) {
      // 우측 터치 → 다음 페이지로 전환
      setCurrentPage(currentPage + 1);
      setSlideOffset(-screenWidth);
      setTimeout(() => setSlideOffset(0), 500);
      if (currentPage === 0) setHasInteracted(true); // 첫번째 인터랙션 완료
    }
  };

  // to.png 클릭 핸들러
  const handleToClick = (e) => {
    e.stopPropagation();
    setShowMmap(true);
  };

  // mmap.png 클릭 핸들러 (닫기)
  const handleMmapClick = (e) => {
    e.stopPropagation();
    setShowMmap(false);
  };

  // 카메라 촬영 핸들러
  const handleCameraClick = async (e) => {
    e.stopPropagation();
    
    try {
      // 카메라 접근 권한 요청
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user', // 전면 카메라 우선
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      // 비디오 엘리먼트 생성
      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;
      
      // 카메라 UI 오버레이 생성
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #000;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      `;
      
      video.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
      `;
      
      // 촬영 버튼
      const captureBtn = document.createElement('button');
      captureBtn.innerText = '📸 촬영';
      captureBtn.style.cssText = `
        position: absolute;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: #fff;
        border: none;
        border-radius: 50px;
        padding: 15px 30px;
        font-size: 18px;
        cursor: pointer;
        z-index: 10000;
      `;
      
      // 닫기 버튼
      const closeBtn = document.createElement('button');
      closeBtn.innerText = '✕';
      closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(255,255,255,0.8);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 20px;
        cursor: pointer;
        z-index: 10000;
      `;
      
      overlay.appendChild(video);
      overlay.appendChild(captureBtn);
      overlay.appendChild(closeBtn);
      document.body.appendChild(overlay);
      
      // 비디오 준비 완료 후 재생
      video.onloadedmetadata = () => {
        video.play();
      };
      
      // 촬영 버튼 클릭
      captureBtn.onclick = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        
        // 이미지 데이터 저장
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        
        // 스트림 정지 및 UI 제거
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(overlay);
      };
      
      // 닫기 버튼 클릭
      closeBtn.onclick = () => {
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(overlay);
      };
      
    } catch (error) {
      console.error('카메라 접근 오류:', error);
      alert('카메라에 접근할 수 없습니다. 브라우저 설정에서 카메라 권한을 확인해주세요.');
    }
  };

  // 현재 페이지에 따른 안내 텍스트
  const getGuideText = () => {
    if (currentPage === 0) return '우측 터치 →';
    if (currentPage === 3) return '← 좌측 터치';
    return '← 좌측 터치 | 우측 터치 →';
  };

  // 슬라이드 애니메이션 시간 및 이징 변경
  const SLIDE_ANIMATION_DURATION = 500; // ms
  const SLIDE_TRANSITION = 'transform 0.5s cubic-bezier(0.33, 1, 0.68, 1)'; // 더 부드럽고 튀지 않게

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

          {/* sn.png 페이지 (0) */}
          <img
            src="/sns/sn.png"
            alt="SN"
            loading="lazy"
            decoding="async"
            style={{
              position: 'absolute',
              top: 'calc(50% - 90px)',
              left: '50%',
              transform: `translate(calc(-50% + ${slideOffset + (currentPage === 0 ? 0 : -screenWidth)}px), -50%)`,
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

          {/* day1.png 페이지 (1) */}
          <img
            src="/sns/day1.png"
            alt="Day 1"
            loading="lazy"
            decoding="async"
            style={{
              position: 'absolute',
              top: 'calc(50% - 40px)',
              left: '50%',
              transform: `translate(calc(-50% + ${slideOffset + (currentPage === 1 ? 0 : currentPage < 1 ? screenWidth : -screenWidth)}px), -50%)`,
              width: '65vw',
              maxWidth: 310,
              height: 'auto',
              objectFit: 'contain',
              objectPosition: 'center',
              display: 'block',
              background: 'transparent',
              zIndex: 2,
              transition: isDragging ? 'none' : SLIDE_TRANSITION,
            }}
          />

          {/* sn2.png 페이지 (2) */}
          <img
            src="/sns/sn2.png"
            alt="SN2"
            loading="lazy"
            decoding="async"
            style={{
              position: 'absolute',
              top: 'calc(50% - 90px)',
              left: '50%',
              transform: `translate(calc(-50% + ${slideOffset + (currentPage === 2 ? 0 : currentPage < 2 ? screenWidth : -screenWidth)}px), -50%)`,
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

          {/* sn3.png 페이지 (3) */}
          <img
            src="/sns/sn3.png"
            alt="SN3"
            loading="lazy"
            decoding="async"
            style={{
              position: 'absolute',
              top: 'calc(50% - 90px)',
              left: '50%',
              transform: `translate(calc(-50% + ${slideOffset + (currentPage === 3 ? 0 : screenWidth)}px), -50%)`,
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

          {/* to.png - sn2.png(2페이지)에서만 표시 */}
          {currentPage === 2 && (
            <img
              src="/sns/to.png"
              alt="To"
              loading="lazy"
              decoding="async"
              style={{
                position: 'absolute',
                top: 'calc(50% - 90px)',
                left: '50%',
                transform: `translate(calc(-50% + ${slideOffset}px), -50%)`,
                width: '68vw',
                maxWidth: 325,
                height: 'auto',
                objectFit: 'contain',
                objectPosition: 'center',
                display: 'block',
                background: 'transparent',
                zIndex: 4,
                cursor: 'pointer',
                userSelect: 'none',
                opacity: showMmap ? 0 : 1,
                transition: isDragging ? 'none' : SLIDE_TRANSITION,
              }}
              onClick={handleToClick}
            />
          )}

          {/* sns tool.png - save.png 클릭 시 표시 */}
          {showSnsTool && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(50% - 90px)',
                left: '50%',
                transform: `translate(calc(-50% + ${slideOffset}px), -50%)`,
                width: '68vw',
                maxWidth: 325,
                height: 'auto',
                zIndex: 6,
                transition: isDragging ? 'none' : SLIDE_TRANSITION,
              }}
            >
              {/* sns tool.png 배경 */}
              <img
                src="/sns/sns tool.png"
                alt="SNS Tool"
                loading="lazy"
                decoding="async"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  display: 'block',
                  background: 'transparent',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSnsTool(false);
                }}
              />
              {/* 저장된 이미지가 있으면 sns tool.png 위에 겹쳐서 표시 */}
              {capturedImage && (
                <>
                  {/* 날짜 텍스트 */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(18% - 90px)',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      textShadow: '0 2px 8px rgba(0,0,0,0.45)',
                      background: 'rgba(0,0,0,0.28)',
                      borderRadius: '8px',
                      padding: '4px 16px',
                      zIndex: 9,
                      pointerEvents: 'none',
                    }}
                  >
                    {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\./g, '.').replace(/\s/g, '')}
                  </div>
                  <img
                    src={capturedImage}
                    alt="저장된 이미지"
                    loading="lazy"
                    decoding="async"
                    style={{
                      position: 'absolute',
                      top: 'calc(50% - 70px)',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '48vw',
                      height: '48vw',
                      minWidth: '48vw',
                      minHeight: '48vw',
                      maxWidth: '48vw',
                      maxHeight: '48vw',
                      objectFit: 'cover',
                      aspectRatio: '1/1',
                      borderRadius: '10px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                      zIndex: 8,
                      border: '2px solid #fff',
                    }}
                  />
                </>
              )}
              {/* plane.png - sns tool 위에서 80픽셀 아래 */}
              <img
                src="/sns/plane.png"
                alt="Plane"
                loading="lazy"
                decoding="async"
                style={{
                  position: 'absolute',
                  top: '80px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 'auto',
                  height: 'auto',
                  maxWidth: '60%',
                  objectFit: 'contain',
                  userSelect: 'none',
                  zIndex: 7,
                }}
              />
            </div>
          )}

          {/* mmap.png - to.png 클릭 시 표시 */}
          {showMmap && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(50% - 90px)',
                left: '50%',
                transform: `translate(calc(-50% + ${slideOffset}px), -50%)`,
                width: '68vw',
                maxWidth: 325,
                height: 'auto',
                zIndex: 5,
                transition: isDragging ? 'none' : SLIDE_TRANSITION,
              }}
            >
              {/* mmap.png 배경 */}
              <img
                src="/sns/mmap.png"
                alt="Mmap"
                loading="lazy"
                decoding="async"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  display: 'block',
                  background: 'transparent',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
                onClick={handleMmapClick}
              />
              
              {/* cam.png - 상단에 그라데이션으로 겹침 */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '40%',
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  paddingTop: '10px',
                  zIndex: 6,
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '60px',
                    height: '60px',
                    cursor: 'pointer',
                  }}
                  onClick={handleCameraClick}
                >
                  {/* cam.png 배경 */}
                  <img
                    src="/sns/cam.png"
                    alt="Camera"
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      userSelect: 'none',
                    }}
                  />
                  
                  {/* 촬영된 이미지가 있으면 하단으로 50px 이동하여 말풍선 안에 표시 */}
                  {capturedImage && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 50px)',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 7,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      {/* 말풍선 배경 */}
                      <div
                        style={{
                          position: 'relative',
                          background: '#fff',
                          borderRadius: '15px',
                          padding: '6px',
                          boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
                          border: '1.5px solid #e0e0e0',
                        }}
                      >
                        {/* 촬영된 이미지 */}
                        <div
                          style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: '1px solid #ddd',
                          }}
                        >
                          <img
                            src={capturedImage}
                            alt="Captured"
                            loading="lazy"
                            decoding="async"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </div>
                        
                        {/* 말풍선 꼬리 (아래쪽 화살표) */}
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '-8px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 0,
                            height: 0,
                            borderLeft: '8px solid transparent',
                            borderRight: '8px solid transparent',
                            borderTop: '8px solid #fff',
                            zIndex: 8,
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '-10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 0,
                            height: 0,
                            borderLeft: '10px solid transparent',
                            borderRight: '10px solid transparent',
                            borderTop: '10px solid #e0e0e0',
                            zIndex: 7,
                          }}
                        />
                      </div>
                      
                      {/* save.png 버튼 */}
                      <div
                        style={{
                          width: '80px',
                          height: '80px',
                          cursor: 'pointer',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowSnsTool(true);
                          // 이미지 다운로드 로직
                          const link = document.createElement('a');
                          link.href = capturedImage;
                          link.download = `photo_${new Date().getTime()}.jpg`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        <img
                          src="/sns/save.png"
                          alt="Save"
                          loading="lazy"
                          decoding="async"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            userSelect: 'none',
                          }}
                        />
                      </div>
                      
                      {/* 재촬영하기 버튼 */}
                      <button
                        style={{
                          background: '#fff',
                          border: '1px solid #ddd',
                          borderRadius: '12px',
                          padding: '4px 12px',
                          fontSize: '10px',
                          fontWeight: '400',
                          color: '#666',
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          transition: 'all 0.2s ease',
                          width: '80px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          whiteSpace: 'nowrap',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCapturedImage(null);
                          handleCameraClick(e);
                        }}
                        onMouseDown={(e) => {
                          e.target.style.transform = 'scale(0.95)';
                        }}
                        onMouseUp={(e) => {
                          e.target.style.transform = 'scale(1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        재촬영
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
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

export default React.memo(SNS2); 