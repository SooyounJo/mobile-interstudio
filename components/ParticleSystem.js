import React, { useState, useCallback } from 'react';

export const useParticles = () => {
  const [particles, setParticles] = useState([]);

  const createParticle = useCallback((x, y, type = 'image') => {
    // 모바일에서 파티클 수 제한
    setParticles(prev => {
      if (prev.length >= 10) return prev; // 최대 10개로 제한
      
      const newParticle = {
        id: Date.now() + Math.random(),
        x,
        y,
        scale: 1,
        opacity: 1,
        type, // 'image' 또는 'color'
        color: type === 'color' ? 'radial-gradient(circle, #f97316, #ea580c)' : null,
      };
      
      return [...prev, newParticle];
    });

    // 모바일에서는 1.5초로 단축
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== Date.now() + Math.random()));
    }, 1500);
  }, []);

  const createMultipleParticles = useCallback((centerX, centerY, count = 3) => {
    // 모바일에서는 3개로 감소
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        createParticle(
          centerX + (Math.random() - 0.5) * 80, // 범위도 축소
          centerY + (Math.random() - 0.5) * 80,
          'color'
        );
      }, i * 150); // 간격도 늘림
    }
  }, [createParticle]);

  return { particles, createParticle, createMultipleParticles };
};

export const ParticleSystem = React.memo(({ particles }) => {
  return (
    <>
      {particles.map(particle => (
        particle.type === 'image' ? (
          <img
            key={particle.id}
            src="/bar/1.png"
            alt="파티클"
            className="particle"
            style={{
              position: 'fixed',
              left: particle.x - 15, // 모바일에서 크기 축소
              top: particle.y - 15,
              width: '30px', // 40px → 30px
              height: '30px',
              objectFit: 'contain',
              zIndex: 55,
              pointerEvents: 'none',
              willChange: 'transform',
              transform: 'translateZ(0)', // GPU 가속
            }}
          />
        ) : (
          <div
            key={particle.id}
            className="particle"
            style={{
              position: 'fixed',
              left: particle.x - 10, // 크기 축소
              top: particle.y - 10,
              width: '20px', // 30px → 20px
              height: '20px',
              background: particle.color,
              borderRadius: '50%',
              zIndex: 55,
              pointerEvents: 'none',
              willChange: 'transform',
              transform: 'translateZ(0)', // GPU 가속
            }}
          />
        )
      ))}
    </>
  );
}); 