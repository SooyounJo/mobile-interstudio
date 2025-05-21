import styled from 'styled-components';
import Head from 'next/head';
import { createGlobalStyle } from 'styled-components';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Link from 'next/link';
import { useRouter } from 'next/router';

useGLTF.preload('/ts.glb');

const blue = '#2563eb';

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: #fafdff;
  position: relative;
  overflow-x: hidden;
`;

const ScrollContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-snap-type: y mandatory;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Section = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  scroll-snap-align: start;
  position: relative;
  background: #fafdff;
`;

const InterBox = styled.div`
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  max-width: 400px;
  width: 90%;
`;

const InterTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${blue};
  margin-bottom: 16px;
`;

const InterSubtitle = styled.p`
  font-size: 18px;
  color: #666;
  margin-bottom: 32px;
`;

const InterButton = styled.button`
  background: ${blue};
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  
  &:hover {
    background: #1d4ed8;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SNSContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
`;

const SNSHeader = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const SNSTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${blue};
  margin-bottom: 8px;
`;

const SNSSubtitle = styled.p`
  font-size: 16px;
  color: #666;
`;

const SNSGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`;

const SNSItem = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  }
`;

const SNSIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${props => props.color};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
`;

const SNSName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const SNSDescription = styled.div`
  font-size: 14px;
  color: #666;
  text-align: center;
`;

const SNSButton = styled.button`
  background: ${blue};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  display: block;
  
  &:hover {
    background: #1d4ed8;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const snsData = [
  {
    name: '인스타그램',
    description: '일상과 순간을 공유하세요',
    icon: '📸',
    color: '#E1306C'
  },
  {
    name: '페이스북',
    description: '친구들과 소통하세요',
    icon: '👥',
    color: '#1877F2'
  },
  {
    name: '트위터',
    description: '짧은 생각을 나누세요',
    icon: '🐦',
    color: '#1DA1F2'
  },
  {
    name: '유튜브',
    description: '영상으로 소통하세요',
    icon: '🎥',
    color: '#FF0000'
  }
];

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #2563eb;
  box-shadow: 0 2px 6px 0 rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  padding: 0 5px;
  z-index: 1000;

  h1 {
    color: #fff;
    font-size: 28px;
    font-weight: 700;
  }
`;

const Main = styled.main`
  padding-top: 70px;
  min-height: calc(100vh - 80px);

  h2 {
    color: #2563eb;
    font-weight: 700;
  }

  a, button {
    color: #2563eb;
    font-weight: 700;
  }

  p {
    color: #2563eb;
  }
`;

const Footer = styled.footer`
  padding: 20px 0;
  text-align: center;
  background: #f5f5f5;

  p {
    color: #2563eb;
    font-weight: 700;
  }
`;

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }

  #__next {
    width: 100%;
    height: 100%;
  }
`;

const WalkingBox = styled.div`
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 16px;
  padding: 4px 16px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
  z-index: 10;
`;

const SaveMomentButton = styled.button`
  display: block;
  margin: 24px auto 0 auto;
  background: rgb(255, 255, 255);
  color: #fff;
  border: none;
  border-radius: 16px;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 12px 0 #2563eb44;
  transition: background 0.2s;
  text-shadow: 0 1px 4px rgba(0,0,0,0.18), 0 0px 1px #fff;
  text-decoration: none;
  &:hover {
    background: #174ea6;
  }
`;

const ButtonRow = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100vw;
  max-width: 480px;
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 16px 0 24px 0;
  background: #fff;
  z-index: 9999;
  box-shadow: 0 -2px 12px 0 #2563eb22;
  margin: 0 auto;
`;

function IntroOverlay() {
  const imgRef = useRef();

  useEffect(() => {
    const intro = document.getElementById('intro');
    setTimeout(() => {
      intro.style.opacity = '0';
      intro.style.pointerEvents = 'none';
    }, 3000);
  }, []);

  return (
    <div id="intro" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#2563eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      transition: 'opacity 1s ease',
      overflow: 'hidden'
    }}>
      <img
        ref={imgRef}
        src="/app/appmain.png"
        alt="앱 메인"
        style={{
          width: '100%',
          height: '100vh',
          maxWidth: 480,
          maxHeight: '100vh',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
          pointerEvents: 'none',
          userSelect: 'none',
          background: '#2563eb',
          borderRadius: 0
        }}
      />
    </div>
  );
}

function Model() {
  const gltf = useGLTF('/ts.glb');
  const modelRef = useRef();
  
  useEffect(() => {
    if (!modelRef.current) return;
    
    // 모델 구조 확인을 위한 디버깅
    console.log('Model Structure:', modelRef.current);
    console.log('Children:', modelRef.current.children);
    
    const animate = () => {
      if (modelRef.current) {
        // 위아래로 부드럽게 움직이는 애니메이션 (속도 증가)
        modelRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.15;
        
        // 팔 움직임 애니메이션
        const arms = modelRef.current.children.find(child => child.name === 'arms');
        if (arms) {
          // 팔을 앞뒤로 움직이는 애니메이션
          arms.rotation.x = Math.sin(Date.now() * 0.003) * 0.3;
        } else {
          // 팔 본을 찾지 못했을 때의 디버깅
          console.log('Available children names:', modelRef.current.children.map(child => child.name));
        }
      }
      requestAnimationFrame(animate);
    };
    
    animate();
  }, []);

  return <primitive ref={modelRef} object={gltf.scene} scale={5} />;
}

const COMMON_WIDTH = '360px';

const ProfileHeader = styled.div`
  width: 100%;
  max-width: 480px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 16px 8px 16px;
  border-bottom: 1px solid #eee;
  background: #fff;
`;
const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
const ProfileImg = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #eee url('/profile.png') center/cover no-repeat;
  border: 1.5px solid #ddd;
`;
const ProfileText = styled.div`
  display: flex;
  flex-direction: column;
`;
const Nick = styled.div`
  font-weight: 700;
  font-size: 16px;
  color: ${blue};
  text-align: left;
`;
const Sub = styled.div`
  font-size: 13px;
  color: ${blue};
  text-align: left;
`;
const FollowBtn = styled.button`
  background: #fff;
  color: ${blue};
  border: 1.5px solid ${blue};
  border-radius: 8px;
  padding: 6px 18px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 8px;
`;
const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;
const FeedCard = styled.div`
  width: 100%;
  max-width: ${COMMON_WIDTH};
  background: #fafdff;
  border-radius: 22px;
  box-shadow: 0 4px 24px 0 #2563eb18, 0 1.5px 0 #2563eb11;
  border: 1.5px solid #e3eafc;
  padding: 22px 0 18px 0;
  margin: 0 auto 22px auto;
  position: relative;
  box-sizing: border-box;
  padding-left: 10px;
  padding-right: 10px;
`;
const FeedImg = styled.img`
  width: 100%;
  max-width: ${COMMON_WIDTH};
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 0;
  margin: 0 auto 12px auto;
  display: block;
  box-shadow: 0 2px 12px #2563eb22;
  box-sizing: border-box;
  padding-left: 0;
  padding-right: 0;
`;
const MapImg = styled.img`
  width: 100%;
  max-width: ${COMMON_WIDTH};
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 0;
  margin: 0 auto 12px auto;
  display: block;
  border: 2px solid #2563eb44;
  background: #eaf1ff;
  box-sizing: border-box;
  padding-left: 0;
  padding-right: 0;
  cursor: pointer;
`;
const SlideWrap = styled.div`
  width: 100%;
  max-width: ${COMMON_WIDTH};
  height: 240px;
  overflow: hidden;
  position: relative;
  margin: 0 auto 8px auto;
  box-sizing: border-box;
  padding-left: 10px;
  padding-right: 10px;
`;
const SlideInner = styled.div`
  display: flex;
  width: 200%;
  max-width: calc(2 * ${COMMON_WIDTH});
  height: 100%;
  transform: translateX(${props => props.idx === 0 ? '0' : `-${COMMON_WIDTH}`});
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
`;
const SlideDotWrap = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 8px 0 0 0;
`;
const SlideDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.active ? blue : '#cfd8dc'};
`;
const FeedTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: ${blue};
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  padding-left: 10px;
  padding-right: 10px;
`;
const FeedMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px 0 10px;
  color: #7a8bb7;
  font-size: 14px;
  text-align: left;
  margin-bottom: 8px;
  box-sizing: border-box;
  font-weight: 500;
`;
const FeedText = styled.div`
  padding: 0 10px 0 10px;
  font-size: 14px;
  color: ${blue};
  font-weight: 500;
  text-align: left;
  margin-bottom: 8px;
  box-sizing: border-box;
`;
const SaveMemoryButton = styled.button`
  background: #fff;
  color: #2563eb;
  border: 1.2px solid #2563eb;
  border-radius: 8px;
  padding: 3px 12px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  margin-left: 6px;
  transition: background 0.15s;
  &:hover {
    background: #eaf1ff;
  }
`;
const CommentSection = styled.div`
  width: 100%;
  max-width: ${COMMON_WIDTH};
  padding: 0 18px 12px 18px;
  box-sizing: border-box;
  margin: 0 auto;
`;
const CommentList = styled.div`
  margin-bottom: 8px;
`;
const Comment = styled.div`
  font-size: 15px;
  color: ${blue};
  margin-bottom: 4px;
  text-align: left;
`;
const CommentForm = styled.form`
  display: flex;
  gap: 8px;
  margin-top: 6px;
`;
const CommentInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1.5px solid #cfd8dc;
  border-radius: 10px;
  font-size: 14px;
  color: #7a8bb7;
  background: #fafdff;
  &::placeholder {
    color: #7a8bb7;
    opacity: 1;
  }
`;
const CommentButton = styled.button`
  background: ${blue};
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px 0 #2563eb22;
`;
const BottomNav = styled.div`
  width: 100vw;
  max-width: 480px;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 54px;
  z-index: 100;
`;
const NavIcon = styled.div`
  width: 28px;
  height: 28px;
  background: #eee;
  border-radius: 50%;
`;

const feedData = [
  {
    profile: '/profile.png',
    nick: 'closie',
    sub: '',
    title: '서울 카페거리의 하루',
    image: '/cafe.jpg',
    text: '따뜻한 햇살과 커피향이 가득한 서울의 카페거리에서.',
    meta: '2022.10.16',
    place: '서울 카페거리',
    placeDesc: '서울의 감성적인 카페들이 모여있는 거리. 다양한 커피와 디저트를 즐길 수 있어요.',
    map: '/cafecl.png'
  },
  {
    profile: '/profile.png',
    nick: 'closie',
    sub: '',
    title: '청계천에서의 산책',
    image: '/str.jpg',
    text: '신기한 동물을 많이 보았던 청계천 산책.',
    meta: '2023.04.02',
    place: '청계천',
    placeDesc: '여유로운 아침 청계천에서 서연이랑 산책을 했어요!',
    map: 'https://maps.googleapis.com/maps/api/staticmap?center=37.5702,126.9768&zoom=15&size=600x300&markers=color:blue%7C37.5702,126.9768&key=YOUR_API_KEY'
  },
];

const Feed = React.forwardRef(function Feed({ feed, comments, onComment }, ref) {
  const [slideIdx, setSlideIdx] = React.useState(0);
  let touchStartX = null;
  const router = useRouter();

  // 모바일 터치 슬라이드 구현
  const handleTouchStart = e => {
    touchStartX = e.touches[0].clientX;
  };
  const handleTouchEnd = e => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (dx < -50 && slideIdx === 0) setSlideIdx(1); // 오른쪽으로 밀면 지도
    if (dx > 50 && slideIdx === 1) setSlideIdx(0); // 왼쪽으로 밀면 사진
    touchStartX = null;
  };

  return (
    <FeedCard ref={ref}>
      <div style={{fontWeight:500, fontSize:'14px', color:blue, margin:'12px 0 2px 0', padding:'0 10px',boxSizing:'border-box'}}>{feed.meta}</div>
      <FeedTitle>{feed.title}</FeedTitle>
      <SlideWrap
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <SlideInner idx={slideIdx}>
          <FeedImg src={feed.image} alt={feed.title} />
          <MapImg src={feed.map} alt={feed.place + ' 지도'} onClick={() => router.push('/fullmap')} />
        </SlideInner>
      </SlideWrap>
      <div style={{fontWeight:500, fontSize:'14px', color:blue, marginBottom:2, padding:'0 10px',boxSizing:'border-box'}}>{feed.place}</div>
      <div style={{fontSize:'14px', color:blue, opacity:0.8, padding:'0 10px',boxSizing:'border-box', fontWeight:600}}>{feed.placeDesc}</div>
    </FeedCard>
  );
});

function EmoticonScroll() {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // 기준: 이모티콘 영역의 상단이 뷰포트 하단에서 100px 위에 올 때 opacity 1
      const y = Math.min(Math.max((window.innerHeight - rect.top - 100) / 100, 0), 1);
      setScrollY(y);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 최초 렌더 시에도 적용
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 이모티콘 간격(최소 8px, 최대 60px)
  const gap = 8 + (60 - 8) * scrollY;
  // 설명 투명도(0~1), 0.2~0.5 구간에서 그라데이션 등장
  const opacity = Math.max(0, Math.min((scrollY - 0.2) / 0.3, 1));

  return (
    <div ref={containerRef} style={{ marginTop: 47, marginBottom: 0, width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: gap, transition: 'gap 0.3s', width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="/jump.png" alt="jump" style={{ width: 36, height: 36, filter: 'brightness(0) saturate(100%) invert(22%) sepia(98%) saturate(7492%) hue-rotate(203deg) brightness(97%) contrast(101%)', transition: 'filter 0.2s' }} />
          <div style={{
            marginTop: 12,
            color: '#2563eb',
            fontWeight: 600,
            fontSize: 14,
            textAlign: 'center',
            opacity: opacity,
            transition: 'opacity 0.4s',
            pointerEvents: 'none',
            minHeight: 20
          }}>활동적인 친구</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="/pla.png" alt="pla" style={{ width: 36, height: 36, filter: 'brightness(0) saturate(100%) invert(22%) sepia(98%) saturate(7492%) hue-rotate(203deg) brightness(97%) contrast(101%)', transition: 'filter 0.2s' }} />
          <div style={{
            marginTop: 12,
            color: '#2563eb',
            fontWeight: 600,
            fontSize: 14,
            textAlign: 'center',
            opacity: opacity,
            transition: 'opacity 0.4s',
            pointerEvents: 'none',
            minHeight: 20
          }}>여행 전문가</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="/water.png" alt="water" style={{ width: 36, height: 36, filter: 'brightness(0) saturate(100%) invert(22%) sepia(98%) saturate(7492%) hue-rotate(203deg) brightness(97%) contrast(101%)', transition: 'filter 0.2s' }} />
          <div style={{
            marginTop: 12,
            color: '#2563eb',
            fontWeight: 600,
            fontSize: 14,
            textAlign: 'center',
            opacity: opacity,
            transition: 'opacity 0.4s',
            pointerEvents: 'none',
            minHeight: 20
          }}>물에 강한 친구</div>
        </div>
      </div>
    </div>
  );
}

function FadeInButtons({ lastFeedRef, router }) {
  const [show, setShow] = useState(false);
  const [hoverIdx, setHoverIdx] = useState(-1);
  useEffect(() => {
    const handleScroll = () => {
      if (!lastFeedRef.current) return;
      const rect = lastFeedRef.current.getBoundingClientRect();
      // 마지막 피드가 화면 하단에 거의 닿으면 show
      if (rect.top < window.innerHeight) {
        setShow(true);
      } else {
        setShow(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastFeedRef]);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', margin: '48px 0 0 0',
      opacity: show ? 1 : 0,
      pointerEvents: show ? 'auto' : 'none',
      transition: 'opacity 0.7s'
    }}>
      <button
        style={{
          background: hoverIdx === 0 ? '#174ea6' : '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: 16,
          padding: '16px 40px',
          fontSize: 18,
          fontWeight: 700,
          marginBottom: 18,
          boxShadow: '0 2px 12px 0 #2563eb44',
          cursor: 'pointer',
          width: 240,
          maxWidth: '90%',
          transform: hoverIdx === 0 ? 'scale(1.04)' : 'scale(1)',
          transition: 'all 0.18s cubic-bezier(.4,0,.2,1)'
        }}
        onMouseEnter={() => setHoverIdx(0)}
        onMouseLeave={() => setHoverIdx(-1)}
        onClick={() => router.push('/map')}
      >
        함께 기록하기
      </button>
      <button
        style={{
          background: '#fff',
          color: hoverIdx === 1 ? '#fff' : '#2563eb',
          border: hoverIdx === 1 ? '2px solid #174ea6' : '2px solid #2563eb',
          borderRadius: 16,
          padding: '16px 40px',
          fontSize: 18,
          fontWeight: 700,
          boxShadow: '0 2px 12px 0 #2563eb22',
          cursor: 'pointer',
          width: 240,
          maxWidth: '90%',
          transform: hoverIdx === 1 ? 'scale(1.04)' : 'scale(1)',
          backgroundColor: hoverIdx === 1 ? '#2563eb' : '#fff',
          transition: 'all 0.18s cubic-bezier(.4,0,.2,1)'
        }}
        onMouseEnter={() => setHoverIdx(1)}
        onMouseLeave={() => setHoverIdx(-1)}
      >
        옷의 여행지도
      </button>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [comments, setComments] = React.useState({});
  const lastFeedRef = React.useRef(null);

  const handleComment = (feedIdx, comment) => {
    setComments(prev => ({
      ...prev,
      [feedIdx]: [...(prev[feedIdx] || []), comment]
    }));
  };

  return (
    <>
      <IntroOverlay />
      <Head>
        <title>closieproject</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="description" content="모바일 최적화된 웹사이트" />
        <link rel="stylesheet" as="style" crossOrigin="" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css" />
        <link href="https://cdn.jsdelivr.net/gh/webfontworld/kopus@1.0/kopub.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap" rel="stylesheet" />
      </Head>
      <Container>
        <Header>
          <h1>Closie</h1>
        </Header>
        <Section style={{paddingTop: 0, alignItems: 'center', justifyContent: 'flex-start'}}>
          {feedData.map((feed, idx) => (
            <Feed
              key={idx}
              feed={feed}
              comments={comments[idx] || []}
              onComment={comment => handleComment(idx, comment)}
              ref={idx === feedData.length - 1 ? lastFeedRef : undefined}
            />
          ))}
          <FadeInButtons lastFeedRef={lastFeedRef} router={router} />
          <BottomNav>
            <NavIcon />
            <NavIcon />
            <NavIcon />
            <NavIcon />
          </BottomNav>
        </Section>
        <Footer>
          <p>© 2024 Closie. All rights reserved.</p>
        </Footer>
        <GlobalStyle />
      </Container>
    </>
  );
}
