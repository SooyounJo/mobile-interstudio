import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Bar from '../components/Bar';
import { useAnimations } from '../hooks/useInteractions';

export default function FullMap() {
  const [pageOpacity, setPageOpacity] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1); // 1.0 = 기본, 1.5 = move2 전환, 2.25 = 최대
  const [zipPosition, setZipPosition] = useState(0); // 0 = 왼쪽, 100 = 오른쪽
  const [isDraggingZip, setIsDraggingZip] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('/map/move.mp4'); // 현재 영상 소스
  const [videoTransition, setVideoTransition] = useState(false); // 비디오 전환 상태
  const router = useRouter();
  const [showGuideModal, setShowGuideModal] = useState(false);

  // useAnimations 훅에서 activeBar와 관련 상태들 가져오기
  const { 
    activeBar, 
    setActiveBar, 
    animatingButton 
  } = useAnimations();

  // 페이지 진입 시 부드러운 페이드인 효과 및 activeBar 설정
  React.useEffect(() => {
    // fullmap 페이지에서는 6번 버튼이 활성화되어야 함
    setActiveBar(6);
    
    // zip 초기 위치를 15%로 설정 (왼쪽 경계)
    setZipPosition(15);
    
    const fadeInTimer = setTimeout(() => {
      setPageOpacity(1);
    }, 100);

    return () => clearTimeout(fadeInTimer);
  }, [setActiveBar]);

  // zip 위치에 따른 줌 레벨 계산 (zipper 중앙에서 전환)
  React.useEffect(() => {
    if (currentVideo === '/map/move.mp4') {
      // move.mp4: zip 15% → 50% 구간에서 1.0x → 1.5x
      if (zipPosition <= 50) {
        const normalizedPosition = (zipPosition - 15) / (50 - 15) * 100;
        const newZoomLevel = 1 + (normalizedPosition / 100) * 0.5;
        setZoomLevel(Math.max(1, newZoomLevel));
        
        // zip이 50%에 도달하면 move2.mp4로 전환
        if (zipPosition >= 49 && !videoTransition) {
          setVideoTransition(true);
          setTimeout(() => {
            setCurrentVideo('/map/move2.mp4');
            setVideoTransition(false);
          }, 200);
        }
      }
    } else {
      // move2.mp4: zip 50% → 85% 구간에서 1.0x → 1.5x
      if (zipPosition >= 50) {
        const normalizedPosition = (zipPosition - 50) / (85 - 50) * 100;
        const newZoomLevel = 1 + (normalizedPosition / 100) * 0.5;
        setZoomLevel(Math.max(1, newZoomLevel));
      }
      
      // 역방향으로 드래그할 때 move.mp4로 돌아가기
      if (zipPosition < 49 && !videoTransition) {
        setVideoTransition(true);
        setTimeout(() => {
          setCurrentVideo('/map/move.mp4');
          setVideoTransition(false);
        }, 200);
      }
    }
  }, [zipPosition, currentVideo, videoTransition]);

  // zip 드래그 핸들러 (영상 영역 내로 제한)
  const handleZipStart = (e) => {
    setIsDraggingZip(true);
    e.preventDefault();
  };

  const handleZipMove = (e) => {
    if (!isDraggingZip) return;
    
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const newPosition = ((clientX - rect.left) / rect.width) * 100;
    
    // 15-85% 범위로 제한 (영상 영역 내로 제한)
    setZipPosition(Math.max(15, Math.min(85, newPosition)));
  };

  const handleZipEnd = () => {
    setIsDraggingZip(false);
  };

  // 한국 지도용 말풍선 데이터 (move2.mp4용)
  const getKoreaBalloons = (zoom) => {
    if (zoom <= 1.6) {
      // 기본 줌 - 주요 광역시
      return [
        { left: '48%', top: '35%', size: 45, region: '서울', city: '강남', description: '민수와 놀러 갔는데 진짜 번화가더라! 코엑스몰에서 쇼핑하고 선릉역 맛집에서 삼겹살 먹었는데 최고였어.' },
        { left: '52%', top: '32%', size: 40, region: '경기', city: '수원', description: '수빈이와 화성 구경하러 갔어. 성곽 따라 걷는데 날씨도 좋고 분위기도 좋더라고! 수원갈비도 진짜 맛있었어.' },
        { left: '65%', top: '60%', size: 45, region: '부산', city: '해운대', description: '지훈이와 바다 보러 갔는데 파도 소리 들으면서 회 먹는 게 진짜 힐링이었어! 광안대교 야경도 정말 예뻤지.' },
        { left: '32%', top: '58%', size: 40, region: '광주', city: '충장로', description: '예지와 맛집 투어로 갔어. 광주 양꼬치가 이렇게 맛있는 줄 몰랐어! 무등산도 올라가 봤는데 전망이 끝내줬지.' },
      ];
    } else if (zoom <= 1.8) {
      // 중간 줌 - 더 많은 지역들
      return [
        { left: '46%', top: '33%', size: 40, region: '서울', city: '홍대', description: '소현이와 클럽 갔다 왔어! 새벽까지 놀고 해장국 먹고... 진짜 젊음을 느꼈지 ㅋㅋ' },
        { left: '50%', top: '36%', size: 35, region: '서울', city: '명동', description: '엄마랑 쇼핑하러 갔는데 사람이 진짜 많더라고! 그래도 화장품 엄청 샀어.' },
        { left: '55%', top: '30%', size: 35, region: '인천', city: '송도', description: '태현이와 드라이브로 갔어. 센트럴파크에서 산책하고 커피 마셨는데 정말 깔끔한 도시더라!' },
        { left: '45%', top: '45%', size: 35, region: '대전', city: '유성', description: '현지와 온천 가려고 갔는데 족욕하면서 수다 떠는 게 너무 좋았어! 과학관도 구경했지.' },
        { left: '60%', top: '58%', size: 40, region: '부산', city: '서면', description: '은지와 쇼핑하러 갔어. 지하상가가 진짜 크더라고! 부산 어묵도 맛있고.' },
        { left: '68%', top: '62%', size: 35, region: '부산', city: '감천마을', description: '다희와 사진 찍으러 갔어. 알록달록한 집들이 진짜 예뻤어! 인스타 감성 제대로였지.' },
        { left: '70%', top: '45%', size: 35, region: '대구', city: '동성로', description: '준호와 야식 먹으러 갔어. 찜갈비 골목에서 진짜 맛있게 먹었는데 양이 어마어마하더라고!' },
        { left: '25%', top: '50%', size: 35, region: '전주', city: '한옥마을', description: '슬기와 한복 입고 구경했어! 비빔밥도 먹고 전통차도 마시면서 힐링했지.' },
      ];
    } else {
      // 최대 줌 - 세부 지역까지
      return [
        { left: '44%', top: '31%', size: 35, region: '서울', city: '이태원', description: '재민이와 이국적인 분위기 느끼러 갔어. 터키 음식 먹고 루프탑바에서 야경 보는데 정말 멋있었어!' },
        { left: '46%', top: '34%', size: 30, region: '서울', city: '강남', description: '민수와 놀러 갔는데 진짜 번화가더라! 코엑스몰에서 쇼핑하고 선릉역 맛집에서 삼겹살 먹었는데 최고였어.' },
        { left: '48%', top: '37%', size: 30, region: '서울', city: '홍대', description: '소현이와 클럽 갔다 왔어! 새벽까지 놀고 해장국 먹고... 진짜 젊음을 느꼈지 ㅋㅋ' },
        { left: '51%', top: '35%', size: 30, region: '서울', city: '명동', description: '엄마랑 쇼핑하러 갔는데 사람이 진짜 많더라고! 그래도 화장품 엄청 샀어.' },
        { left: '49%', top: '39%', size: 30, region: '서울', city: '한강', description: '친구들이랑 치킨 먹으러 갔어! 다리 보면서 맥주 마시는 게 진짜 낭만적이었지.' },
        { left: '54%', top: '29%', size: 30, region: '인천', city: '송도', description: '태현이와 드라이브로 갔어. 센트럴파크에서 산책하고 커피 마셨는데 정말 깔끔한 도시더라!' },
        { left: '57%', top: '27%', size: 25, region: '인천', city: '차이나타운', description: '가족이랑 짜장면 먹으러 갔어! 원조 맛집에서 먹는 짜장면이 진짜 다르더라고.' },
        { left: '52%', top: '31%', size: 30, region: '경기', city: '수원', description: '수빈이와 화성 구경하러 갔어. 성곽 따라 걷는데 날씨도 좋고 분위기도 좋더라고! 수원갈비도 진짜 맛있었어.' },
        { left: '43%', top: '43%', size: 30, region: '대전', city: '유성', description: '현지와 온천 가려고 갔는데 족욕하면서 수다 떠는 게 너무 좋았어! 과학관도 구경했지.' },
        { left: '25%', top: '48%', size: 30, region: '전주', city: '한옥마을', description: '슬기와 한복 입고 구경했어! 비빔밥도 먹고 전통차도 마시면서 힐링했지.' },
        { left: '68%', top: '43%', size: 30, region: '대구', city: '동성로', description: '준호와 야식 먹으러 갔어. 찜갈비 골목에서 진짜 맛있게 먹었는데 양이 어마어마하더라고!' },
        { left: '62%', top: '56%', size: 30, region: '부산', city: '서면', description: '은지와 쇼핑하러 갔어. 지하상가가 진짜 크더라고! 부산 어묵도 맛있고.' },
        { left: '66%', top: '59%', size: 30, region: '부산', city: '해운대', description: '지훈이와 바다 보러 갔는데 파도 소리 들으면서 회 먹는 게 진짜 힐링이었어! 광안대교 야경도 정말 예뻤지.' },
        { left: '69%', top: '61%', size: 25, region: '부산', city: '감천마을', description: '다희와 사진 찍으러 갔어. 알록달록한 집들이 진짜 예뻤어! 인스타 감성 제대로였지.' },
        { left: '30%', top: '56%', size: 30, region: '광주', city: '충장로', description: '예지와 맛집 투어로 갔어. 광주 양꼬치가 이렇게 맛있는 줄 몰랐어! 무등산도 올라가 봤는데 전망이 끝내줬지.' },
      ];
    }
  };

  // 줌 레벨에 따른 말풍선 데이터 (비디오별로 분기)
  const getBalloonsForZoom = (zoom) => {
    // move2.mp4일 때는 한국 지도용 말풍선 표시
    if (currentVideo === '/map/move2.mp4') {
      return getKoreaBalloons(zoom);
    }
    
    // move.mp4일 때는 해외 여행지 말풍선 표시
    if (zoom <= 1.1) {
      // 기본 줌 - 대륙별 주요 지역
      return [
        { left: '25%', top: '40%', size: 50, country: '미국', city: '뉴욕', description: '민지와 함께 갔는데 진짜 영화에서 본 그대로였어! 타임스퀘어에서 사진 찍으려고 했는데 사람이 너무 많아서 힘들었지만 그래도 꿈만 같았어.' },
        { left: '50%', top: '35%', size: 50, country: '프랑스', city: '파리', description: '세환이와 신혼여행으로 갔었지. 에펠탑 앞에서 프러포즈하는 커플들 보니까 우리도 괜히 설레더라고. 세느강에서 유람선 탔는데 정말 로맨틱했어!' },
        { left: '70%', top: '50%', size: 50, country: '일본', city: '도쿄', description: '지우와 대학교 졸업여행으로 갔어. 시부야 횡단보도에서 진짜 정신없더라! 그래도 라멘 먹고 온센 들어가니까 피로가 싹 풀렸지.' },
        { left: '65%', top: '62%', size: 50, country: '호주', city: '시드니', description: '하늘이와 워킹홀리데이로 살았던 곳이야. 오페라하우스에서 공연도 보고 하버브릿지 위에서 일출도 봤어. 한 달 살아보니까 진짜 살기 좋은 도시더라고!' },
      ];
    } else if (zoom <= 1.3) {
      // 중간 줌 - 더 많은 도시들
      return [
        { left: '22%', top: '38%', size: 45, country: '미국', city: '뉴욕', description: '민지와 함께 갔는데 진짜 영화에서 본 그대로였어! 타임스퀘어에서 사진 찍으려고 했는데 사람이 너무 많아서 힘들었지만 그래도 꿈만 같았어.' },
        { left: '28%', top: '55%', size: 40, country: '브라질', city: '리우데자네이루', description: '태민이와 배낭여행으로 갔었지. 코파카바나 해변에서 축구하는 사람들 보면서 맥주 마셨는데 정말 자유로웠어. 예수상도 생각보다 훨씬 크더라고!' },
        { left: '48%', top: '32%', size: 45, country: '프랑스', city: '파리', description: '세환이와 신혼여행으로 갔었지. 에펠탑 앞에서 프러포즈하는 커플들 보니까 우리도 괜히 설레더라고. 세느강에서 유람선 탔는데 정말 로맨틱했어!' },
        { left: '52%', top: '28%', size: 40, country: '영국', city: '런던', description: '수아와 어학연수로 갔어. 런던아이에서 내려다본 템즈강이 정말 예뻤어! 피시앤칩스는... 음, 한 번 먹어보는 거로 충분했지 ㅋㅋ' },
        { left: '55%', top: '62%', size: 40, country: '이집트', city: '카이로', description: '현우와 역사탐방으로 갔는데 피라미드 규모가 정말 어마어마하더라고! 낙타 타고 사막 구경하는데 마치 시간여행하는 기분이었어.' },
        { left: '68%', top: '45%', size: 45, country: '일본', city: '도쿄', description: '지우와 대학교 졸업여행으로 갔어. 시부야 횡단보도에서 진짜 정신없더라! 그래도 라멘 먹고 온센 들어가니까 피로가 싹 풀렸지.' },
        { left: '65%', top: '55%', size: 40, country: '태국', city: '방콕', description: '예린이와 먹방여행으로 갔어. 팟타이 진짜 맛있고 망고 스무디도 최고였어! 왓포 사원에서 마사지받는데 너무 시원해서 잠들 뻔했지.' },
        { left: '62%', top: '60%', size: 45, country: '호주', city: '시드니', description: '하늘이와 워킹홀리데이로 살았던 곳이야. 오페라하우스에서 공연도 보고 하버브릿지 위에서 일출도 봤어. 한 달 살아보니까 진짜 살기 좋은 도시더라고!' },
      ];
    } else {
      // 최대 줌 - 세부 여행지들까지
      return [
        { left: '20%', top: '35%', size: 40, country: '미국', city: '뉴욕', description: '민지와 함께 갔는데 진짜 영화에서 본 그대로였어! 타임스퀘어에서 사진 찍으려고 했는데 사람이 너무 많아서 힘들었지만 그래도 꿈만 같았어.' },
        { left: '25%', top: '45%', size: 35, country: '미국', city: '로스앤젤레스', description: '진호와 렌터카 여행으로 갔어. 할리우드 사인 보러 갔는데 생각보다 멀리 있더라고 ㅋㅋ 베니스 비치에서 스케이트보드 배우려다가 넘어져서 무릎 까졌지!' },
        { left: '30%', top: '52%', size: 40, country: '브라질', city: '리우데자네이루', description: '태민이와 배낭여행으로 갔었지. 코파카바나 해변에서 축구하는 사람들 보면서 맥주 마셨는데 정말 자유로웠어. 예수상도 생각보다 훨씬 크더라고!' },
        { left: '45%', top: '30%', size: 40, country: '프랑스', city: '파리', description: '세환이와 신혼여행으로 갔었지. 에펠탑 앞에서 프러포즈하는 커플들 보니까 우리도 괜히 설레더라고. 세느강에서 유람선 탔는데 정말 로맨틱했어!' },
        { left: '50%', top: '25%', size: 35, country: '영국', city: '런던', description: '수아와 어학연수로 갔어. 런던아이에서 내려다본 템즈강이 정말 예뻤어! 피시앤칩스는... 음, 한 번 먹어보는 거로 충분했지 ㅋㅋ' },
        { left: '55%', top: '32%', size: 35, country: '독일', city: '베를린', description: '유진이와 역사기행으로 갔어. 베를린 장벽 앞에서 사진 찍는데 괜히 숙연해지더라고. 맥주는 정말 맛있었는데 소시지는 너무 커서 다 못 먹었어!' },
        { left: '58%', top: '38%', size: 35, country: '러시아', city: '모스크바', description: '성훈이와 트랜스 시베리아 기차여행으로 갔어. 붉은 광장이 정말 웅장하더라고! 보드카는... 한 잔으로 충분했어 ㅋㅋ' },
        { left: '52%', top: '60%', size: 40, country: '이집트', city: '카이로', description: '현우와 역사탐방으로 갔는데 피라미드 규모가 정말 어마어마하더라고! 낙타 타고 사막 구경하는데 마치 시간여행하는 기분이었어.' },
        { left: '62%', top: '42%', size: 35, country: '인도', city: '뉴델리', description: '소영이와 배낭여행으로 갔어. 타지마할이 정말 아름답긴 한데 더위가... 카레는 매일 먹어도 안 질리더라고! 향신료 냄새가 아직도 생각나.' },
        { left: '68%', top: '48%', size: 40, country: '일본', city: '도쿄', description: '지우와 대학교 졸업여행으로 갔어. 시부야 횡단보도에서 진짜 정신없더라! 그래도 라멘 먹고 온센 들어가니까 피로가 싹 풀렸지.' },
        { left: '72%', top: '40%', size: 35, country: '한국', city: '서울', description: '혜진이와 고향 나들이로 갔어. 명동에서 쇼핑하고 홍대에서 클럽가고... 한강에서 치킨 먹으면서 수다 떠는게 제일 좋았어!' },
        { left: '65%', top: '55%', size: 35, country: '태국', city: '방콕', description: '예린이와 먹방여행으로 갔어. 팟타이 진짜 맛있고 망고 스무디도 최고였어! 왓포 사원에서 마사지받는데 너무 시원해서 잠들 뻔했지.' },
        { left: '70%', top: '62%', size: 35, country: '싱가포르', city: '싱가포르', description: '동현이와 쇼핑여행으로 갔어. 마리나베이샌즈 수영장에서 야경 보는데 정말 환상적이었어! 칠리크랩도 맛있고 뽕쁭도 최고였지.' },
        { left: '60%', top: '58%', size: 40, country: '호주', city: '시드니', description: '하늘이와 워킹홀리데이로 살았던 곳이야. 오페라하우스에서 공연도 보고 하버브릿지 위에서 일출도 봤어. 한 달 살아보니까 진짜 살기 좋은 도시더라고!' },
        { left: '68%', top: '65%', size: 35, country: '호주', city: '멜버른', description: '나리와 카페투어로 갔어. 길거리마다 카페가 있어서 하루 종일 커피만 마셨지 ㅋㅋ 그래피티도 예술 같고 트램 타고 시내 구경하는 재미가 쏠쏠했어!' },
      ];
    }
  };

  const balloons = getBalloonsForZoom(zoomLevel);

  // 말풍선 클릭 핸들러
  const handleBalloonClick = (balloon) => {
    setSelectedLocation(balloon);
    setShowModal(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setShowModal(false);
    setSelectedLocation(null);
  };

  React.useEffect(() => {
    // 입장 2초 후 모달 표시
    const timer = setTimeout(() => setShowGuideModal(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#000',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pageOpacity,
        transition: 'opacity 0.8s ease-out',
      }}
      onMouseMove={handleZipMove}
      onMouseUp={handleZipEnd}
      onTouchMove={handleZipMove}
      onTouchEnd={handleZipEnd}
    >
      {/* 상단 zipper.png */}
      <img
        src="/map/zipper.png"
        alt="zipper"
        style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100vw',
          maxWidth: '480px',
          height: 'auto',
          objectFit: 'contain',
          zIndex: 40,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />

      {/* zip.png 줌 컨트롤 - 영상 영역 내로 제한 */}
      <div
        style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100vw',
          maxWidth: '480px',
          height: '60px',
          zIndex: 41,
          pointerEvents: 'auto',
        }}
      >
        {/* 드래그 가이드 라인 (보이지 않는 영역) */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '15%',
            right: '15%',
            height: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            transform: 'translateY(-50%)',
            borderRadius: '1px',
          }}
        />
        
        <img
          src="/bar/zip.png"
          alt="zoom control"
          style={{
            position: 'absolute',
            top: '50%',
            left: `${zipPosition}%`,
            transform: 'translate(-50%, -50%)',
            width: '30px',
            height: '30px',
            objectFit: 'contain',
            cursor: isDraggingZip ? 'grabbing' : 'grab',
            userSelect: 'none',
            zIndex: 42,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            transition: isDraggingZip ? 'none' : 'left 0.1s ease',
          }}
          onMouseDown={handleZipStart}
          onTouchStart={handleZipStart}
          draggable={false}
        />
      </div>
      
      {/* 반응형 비디오 컨테이너 */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100vw',
        maxWidth: '480px',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
        <video
          src={currentVideo}
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            userSelect: 'none',
            pointerEvents: 'none',
            transform: `scale(${zoomLevel})`,
            background: '#000',
            transition: isDraggingZip ? 'none' : 'transform 0.3s ease-out',
          }}
        />
      </div>
      {/* Bar 컴포넌트로 변경된 하단 네비게이션 */}
      <Bar 
        activeBar={activeBar}
        setActiveBar={setActiveBar}
        animatingButton={animatingButton}
        router={router}
      />
      {/* 지도 위 말풍선 + 사진 - 줌과 함께 스케일링 */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100vw',
        maxWidth: '480px',
        height: '100vh',
        pointerEvents: 'none',
      }}>
        {balloons.map((b, i) => (
          <div 
            key={i} 
            style={{ 
              position: 'absolute', 
              left: b.left, 
              top: b.top, 
              zIndex: 10,
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center',
              transition: isDraggingZip ? 'none' : 'transform 0.3s ease-out',
              pointerEvents: 'auto',
            }}
          >
          <div 
            onClick={() => handleBalloonClick(b)}
            style={{ 
              position: 'relative', 
              background: '#fff', 
              borderRadius: 12, 
              boxShadow: '0 4px 16px #2563eb22', 
              padding: b.size * 0.12, 
              minWidth: b.size, 
              minHeight: b.size, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {/* 국가/도시 정보 표시 */}
            <div style={{
              fontSize: b.size * 0.15,
              fontWeight: 'bold',
              color: '#2563eb',
              textAlign: 'center',
              marginBottom: 2,
            }}>
              {b.city}
            </div>
            <div style={{
              fontSize: b.size * 0.12,
              color: '#666',
              textAlign: 'center',
            }}>
              {b.country || b.region}
            </div>
            
            {/* 꼬리 */}
            <div style={{ position: 'absolute', left: b.size * 0.33, bottom: -12, width: 12, height: 12, background: 'transparent' }}>
              <svg width="12" height="12"><polygon points="0,0 12,0 6,12" fill="#fff" /></svg>
            </div>
                      </div>
          </div>
        ))}
      </div>

      {/* 여행지 정보 모달 */}
      {showModal && selectedLocation && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: '20px',
              margin: '20px',
              maxWidth: '350px',
              width: '90%',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              transform: 'scale(1)',
              transition: 'transform 0.2s ease',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '12px',
            }}>
              <h2 style={{
                fontSize: '22px',
                fontWeight: 'bold',
                color: '#2563eb',
                margin: 0,
              }}>
                {selectedLocation.city}
              </h2>
              <button
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '22px',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '4px',
                }}
              >
                ×
              </button>
            </div>

            {/* 모달 내용 */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                fontSize: '16px',
                color: '#666',
                marginBottom: '8px',
              }}>
                📍 {selectedLocation.country}
              </div>
              <p style={{
                fontSize: '18px',
                lineHeight: '1.5',
                color: '#333',
                margin: 0,
              }}>
                {selectedLocation.description}
              </p>
            </div>

            {/* 모달 하단 버튼 */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
            }}>
              <button
                onClick={closeModal}
                style={{
                  padding: '8px 16px',
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 체험 가이드 모달 */}
      {showGuideModal && (
        <div
          onClick={() => setShowGuideModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.38)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: 18,
              boxShadow: '0 6px 32px #2563eb33',
              padding: '32px 28px 24px 28px',
              maxWidth: 320,
              textAlign: 'center',
              fontSize: 18,
              fontWeight: 600,
              color: '#222',
              lineHeight: 1.7,
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 10, color: '#2563eb' }}>체험 가이드</div>
            <div style={{ marginBottom: 18 }}>
              <b>지퍼를 슬라이드</b>하고<br/>
              <b>말풍선</b>을 눌러<br/>
              <span style={{ color: '#2563eb' }}>클로지의 기록</span>을 확인해보세요!
            </div>
            <button
              onClick={() => setShowGuideModal(false)}
              style={{
                marginTop: 8,
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '10px 28px',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px #2563eb22',
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 