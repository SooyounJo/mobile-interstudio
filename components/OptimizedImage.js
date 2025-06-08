import React, { useState, useCallback, memo } from 'react';

const OptimizedImage = memo(({ 
  src, 
  alt, 
  className = '', 
  style = {}, 
  onClick,
  priority = false,
  quality = 75,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  const optimizedStyle = {
    ...style,
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease',
    // GPU 가속을 위한 transform 추가
    transform: style.transform || 'translateZ(0)',
    willChange: 'transform, opacity',
    // 모바일 최적화
    imageRendering: 'optimizeSpeed',
    ...props
  };

  return (
    <>
      {!isLoaded && !hasError && (
        <div 
          style={{
            ...style,
            backgroundColor: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
            fontSize: '12px'
          }}
        >
          로딩중...
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        style={optimizedStyle}
        onClick={onClick}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        // 모바일 브라우저 최적화
        crossOrigin="anonymous"
        {...props}
      />
    </>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage; 