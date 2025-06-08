import React from 'react';

export default function AnimationSection({ loading, error, displayedText2 }) {
  // 로딩/에러/일기 결과를 단순 텍스트로만 반환
  if (loading) return <div style={{ textAlign: 'center', marginTop: 24 }}>AI가 일기를 쓰는 중...</div>;
  if (error) return <div style={{ textAlign: 'center', marginTop: 24, color: 'red' }}>{error}</div>;
  if (displayedText2) return (
    <div style={{ textAlign: 'center', marginTop: 24, whiteSpace: 'pre-line', fontSize: 16, color: '#222' }}>
      {displayedText2}
    </div>
  );
  return null;
} 