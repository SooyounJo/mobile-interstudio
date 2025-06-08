import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function PageTransition({ children }) {
  const [transitioning, setTransitioning] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const router = useRouter();

  // 페이지 전환 함수
  const navigateWithTransition = (path, delay = 600) => {
    setTransitioning(true);
    setFadeOut(true);
    
    setTimeout(() => {
      router.push(path);
    }, delay);
  };

  // 페이지 로드 시 페이드인
  useEffect(() => {
    setFadeOut(false);
    setTransitioning(false);
  }, [router.asPath]);

  return (
    <div
      style={{
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.6s ease-out',
        width: '100%',
        height: '100%',
      }}
    >
      {React.cloneElement(children, { navigateWithTransition })}
    </div>
  );
}

// 개별 페이지에서 사용할 커스텀 훅
export const usePageTransition = () => {
  const [transitioning, setTransitioning] = useState(false);
  const router = useRouter();

  const transitionTo = (path, delay = 600) => {
    setTransitioning(true);
    
    // 페이드아웃 후 페이지 이동
    setTimeout(() => {
      router.push(path);
    }, delay);
  };

  return {
    transitioning,
    transitionTo
  };
}; 