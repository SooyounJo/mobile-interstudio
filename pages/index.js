import styled from 'styled-components';
import Head from 'next/head';
import { createGlobalStyle } from 'styled-components';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import React, { Suspense, useEffect, useRef } from 'react';
import { TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Link from 'next/link';

useGLTF.preload('/ts.glb');

const Container = styled.div`
  width: 100%;
  max-width: 100%;
  min-height: 100vh;
  padding: 0 16px;
  margin: 0 auto;
`;

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
  padding: 0 16px;
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
  const textRef = useRef();

  useEffect(() => {
    const intro = document.getElementById('intro');
    const text = textRef.current;
    setTimeout(() => {
      intro.style.opacity = '0';
      intro.style.pointerEvents = 'none';
    }, 3000);

    setTimeout(() => {
      text.style.transform = 'scale(1.3)';
    }, 2000);
  }, []);

  return (
    <div id="intro" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#2563eb',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 700,
      fontSize: '32px',
      zIndex: 9999,
      transition: 'opacity 1s ease'
    }}>
      <div ref={textRef} style={{ transition: 'transform 1s ease' }}>
        closie
      </div>
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

export default function Home() {
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

        <Main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ width: '100%', maxWidth: 400, height: 320, display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 32px auto', position: 'relative' }}>
            <WalkingBox>걷는 중</WalkingBox>
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }} style={{ background: 'linear-gradient(180deg, #b3e5fc 0%, #fff 100%)', borderRadius: '16px' }}>
              <ambientLight intensity={0.5} color="#b3e5fc" />
              <directionalLight position={[0, 0, 10]} intensity={1.7} color="#90caf9" castShadow />
              <directionalLight position={[0, 10, 0]} intensity={0.5} color="#e3f2fd" />
              <Suspense fallback={null}>
                <Model />
              </Suspense>
              <OrbitControls enablePan={false} enableZoom={false} />
            </Canvas>
          </div>
          <h2>Sion</h2>
          <p>2021-2025 Seoul</p>
          <Link href="/map" passHref legacyBehavior>
            <SaveMomentButton as="a">지금 이 순간 저장</SaveMomentButton>
          </Link>
        </Main>

        <Footer>
          <p>© 지금도 걸어다니는 중</p>
        </Footer>
      </Container>
    </>
  );
}
