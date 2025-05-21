import React from 'react';

export default function AppMainImage() {
  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        background: '#2563eb',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        overflowY: 'auto',
      }}
    >
      <img
        src="/app/appmain2.png"
        alt="앱 메인2"
        style={{
          width: '100%',
          maxWidth: 480,
          minHeight: '100vh',
          objectFit: 'contain',
          objectPosition: 'top center',
          display: 'block',
          background: '#2563eb',
        }}
      />
    </div>
  );
}
