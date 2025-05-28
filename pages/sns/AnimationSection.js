import React from 'react';

export default function AnimationSection({ loading, error, displayedText2 }) {
  return (
    <div style={{ position: 'absolute', top: '2350px', left: '50%', transform: 'translate(-50%, 0)', width: 220, height: 'auto', borderRadius: 18, background: '#f3f3f3', padding: '12px', color: '#333', fontSize: 14, marginTop: 18, zIndex: 10, textAlign: 'left', lineHeight: 1.5, minHeight: 60, whiteSpace: 'pre-line' }}>
      {loading ? 'AI가 일기를 쓰는 중...' : error || displayedText2}
    </div>
  );
} 