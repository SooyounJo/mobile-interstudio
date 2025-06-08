import React from 'react';

export default function ImageSection({ newFeed, onAddDiary }) {
  return (
    <>
      {/* 날짜 텍스트 */}
      {newFeed && (
        <div style={{ position: 'absolute', top: '1865px', left: 'calc(50% - 170px)', fontWeight: 700, fontSize: 18, color: '#000', zIndex: 11, background: 'none', textAlign: 'center' }}>
          {newFeed.date}
        </div>
      )}
      {/* 사진 박스 */}
      <div style={{ position: 'absolute', top: '1950px', left: '50%', transform: 'translate(-50%, 0)', width: 240, height: 240, borderRadius: 32, background: '#eaeaea', boxShadow: '0 2px 8px #bbb6', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, overflow: 'hidden', padding: 0 }}>
        {newFeed && (
          <img
            src={newFeed.photo}
            alt="추가된 추억"
            style={{ width: '100%', height: '100%', borderRadius: 32, objectFit: 'cover', margin: 0, padding: 0 }}
          />
        )}
      </div>
      {/* 새로운 일기 작성 버튼 */}
      <button
        style={{
          position: 'absolute',
          top: 670,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: 12,
          padding: '8px 20px',
          fontSize: 14,
          fontWeight: 600,
          boxShadow: '0 4px 16px #2563eb22',
          cursor: 'pointer',
          transition: 'background 0.2s',
          zIndex: 20,
        }}
        onClick={onAddDiary}
      >
        새로운 일기 작성하기
      </button>
    </>
  );
} 