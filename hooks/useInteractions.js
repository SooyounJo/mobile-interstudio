import { useState, useEffect, useCallback } from 'react';

// useMousePosition 훅 제거됨 - CPU 최적화를 위해

export const useScrollTracking = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.pageYOffset || document.documentElement.scrollTop;
          const windowHeight = window.innerHeight;
          const documentHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight,
            document.body.clientHeight,
            document.documentElement.clientHeight
          );
          
          const scrollableHeight = documentHeight - windowHeight;
          let percentage = 0;
          
          if (scrollableHeight > 0) {
            percentage = (scrollY / scrollableHeight) * 100;
          }
          
          const finalPercentage = Math.min(100, Math.max(0, percentage));
          setScrollPercentage(finalPercentage);
          
          // 스크롤 인디케이터 처리
          if (scrollY > 30) {
            setShowScrollIndicator(false);
          } else {
            setShowScrollIndicator(true);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    // 이벤트 리스너 등록 (throttled)
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    // 초기 실행
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // 3초 후 스크롤 인디케이터 자동 숨김
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScrollIndicator(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return { scrollPercentage, showScrollIndicator };
};

export const useAnimations = () => {
  const [floatY, setFloatY] = useState(0);
  const [cloOpacity, setCloOpacity] = useState(1);
  const [activeBar, setActiveBar] = useState(null);
  const [animatingButton, setAnimatingButton] = useState(null);
  const [cloClicked, setCloClicked] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  // clo.png 위아래 부드러운 애니메이션 (60FPS 유지)
  useEffect(() => {
    let raf;
    let lastTime = 0;
    const targetFPS = 60; // 부드러운 애니메이션을 위해 60FPS 유지
    const interval = 1000 / targetFPS;
    
    const animate = (currentTime) => {
      if (currentTime - lastTime >= interval) {
        setFloatY(Math.sin(currentTime * 0.002) * 12); // -12~+12px
        lastTime = currentTime;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  // 버튼 순차 애니메이션
  useEffect(() => {
    const buttons = [4, 5, 6];
    let currentIndex = 0;
    
    const animateButtons = () => {
      setAnimatingButton(buttons[currentIndex]);
      
      setTimeout(() => {
        setAnimatingButton(null);
        currentIndex = (currentIndex + 1) % buttons.length;
      }, 1500);
    };
    
    animateButtons();
    const interval = setInterval(animateButtons, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // clo.png 클릭 핸들러
  const handleCloClick = useCallback((e, createMultipleParticles) => {
    e.stopPropagation();
    
    setCloClicked(true);
    
    const rect = e.target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    createMultipleParticles(centerX, centerY);
    
    setTimeout(() => {
      setCloClicked(false);
    }, 300);
  }, []);

  // 3초 후 스크롤 인디케이터 자동 숨김
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScrollIndicator(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return {
    floatY,
    cloOpacity,
    activeBar,
    setActiveBar,
    animatingButton,
    cloClicked,
    handleCloClick,
    showScrollIndicator
  };
};

export const useUserData = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('userName') || '';
      setUserName(name);
    }
  }, []);

  return userName;
}; 