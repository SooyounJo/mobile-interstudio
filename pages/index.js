import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { animationStyles } from '../styles/animations';
import { useParticles, ParticleSystem } from '../components/ParticleSystem';
import { 
  WelcomeMessage, 
  ScrollIndicator, 
  BackButton
} from '../components/UIComponents';
import Bar from '../components/Bar';
import { 
  useAnimations, 
  useUserData 
} from '../hooks/useInteractions';

export default function AppMainImage() {
  const router = useRouter();
  const [pageOpacity, setPageOpacity] = React.useState(0);
  const [isFromIntro, setIsFromIntro] = React.useState(false);

  // 커스텀 훅들 사용 (마우스 팔로잉 제거로 최적화됨)
  const { 
    floatY, 
    cloOpacity, 
    activeBar, 
    setActiveBar, 
    animatingButton, 
    cloClicked,
    showScrollIndicator 
  } = useAnimations();
  const userName = useUserData();
  const { particles, createParticle } = useParticles();

  // 페이지 진입 시 부드러운 페이드인 효과
  React.useEffect(() => {
    setIsFromIntro(router.query.from === 'intro');
    
    // 페이지 로드 후 바로 페이드인 시작
    const fadeInTimer = setTimeout(() => {
      setPageOpacity(1);
    }, 100);

    return () => clearTimeout(fadeInTimer);
  }, [router.query.from]);

  // URL 리다이렉트 처리
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 
        !router.query.from && 
        !document.cookie.includes('visited=true')) {
      router.replace('/intro');
    }
  }, [router]);

  return (
    <>
      <Head>
        <style jsx global>{animationStyles}</style>
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
        opacity: pageOpacity,
        transition: isFromIntro ? 'opacity 1.2s ease-out' : 'opacity 0.6s ease-out',
      }}
    >
              <div style={{ width: '100%', maxWidth: 480, position: 'relative' }}
             onClick={(e) => createParticle(e.clientX, e.clientY)}>
          
          <WelcomeMessage userName={userName} />
          <ParticleSystem particles={particles} />
          <BackButton router={router} />
          <ScrollIndicator showScrollIndicator={showScrollIndicator} />



          {/* 공중에 떠있는 clo.png - 주황 파티클 애니메이션 제거됨 */}
        <img
          src="/app/clo.png"
          alt="clo"
            className={`clo-interactive ${cloClicked ? 'clo-clicked' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              // 주황색 파티클 애니메이션 제거됨
            }}
            style={{
              position: 'absolute',
              top: 370 + floatY,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '50vw',
              maxWidth: 230,
              height: 'auto',
              objectFit: 'contain',
              zIndex: 20,
              pointerEvents: 'auto',
              userSelect: 'none',
              filter: 'drop-shadow(0 8px 16px rgba(37,99,235,0.18))',
              transition: 'filter 0.2s, opacity 2s',
              opacity: cloOpacity,
            }}
          />
                    {/* 메인 이미지들 - 패럴랙스 제거로 성능 최적화 */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <img
              src="/app/fir.png"
              alt="첫 번째 이미지"
              className="interactive-image"
            style={{
              width: '100vw',
              maxWidth: 480,
              height: 'auto',
              objectFit: 'contain',
              objectPosition: 'top center',
                display: 'block',
                background: '#000',
              }}
              onClick={(e) => {
                e.stopPropagation();
                createParticle(e.clientX, e.clientY);
            }}
          />
        <img
              src="/app/fir2.png"
              alt="두 번째 이미지"
              className="interactive-image"
          style={{
            width: '100vw',
            maxWidth: 480,
            height: 'auto',
            objectFit: 'contain',
            objectPosition: 'top center',
            display: 'block',
            background: '#000',
                marginTop: 0,
              }}
              onClick={(e) => {
                e.stopPropagation();
                createParticle(e.clientX, e.clientY);
              }}
              />
        </div>
          {/* Bar 컴포넌트로 분리됨 */}
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
