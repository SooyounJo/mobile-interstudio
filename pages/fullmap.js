import React, { useRef, useState } from 'react';
import { useRouter } from 'next/router';

export default function FullMap() {
  const [scale, setScale] = useState(2); // 2배 확대
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [imgStart, setImgStart] = useState({ x: 0, y: 0 });
  const [activeBar, setActiveBar] = useState(3); // 3번 버튼 활성화
  const router = useRouter();
  const containerRef = useRef();

  // 화면 크기, 이미지 크기 계산
  const vw = typeof window !== 'undefined' ? window.innerWidth : 480;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const imgW = 480 * scale;
  const imgH = 480 * scale;

  // 이동 한계 계산 (이미지가 프레임보다 작으면 중앙 고정)
  const maxX = imgW > vw ? (imgW - vw) / 2 : 0;
  const maxY = imgH > vh ? (imgH - vh) / 2 : 0;

  // 마우스/터치 드래그 이동
  const onPointerDown = e => {
    setDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setStart({ x: clientX, y: clientY });
    setImgStart({ ...pos });
  };
  const onPointerMove = e => {
    if (!dragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    let nextX = imgStart.x + (clientX - start.x);
    let nextY = imgStart.y + (clientY - start.y);
    // 한계 적용 (이미지가 프레임보다 작으면 중앙 고정)
    if (maxX === 0) nextX = 0;
    else {
      if (nextX > maxX) nextX = maxX;
      if (nextX < -maxX) nextX = -maxX;
    }
    if (maxY === 0) nextY = 0;
    else {
      if (nextY > maxY) nextY = maxY;
      if (nextY < -maxY) nextY = -maxY;
    }
    setPos({ x: nextX, y: nextY });
  };
  const onPointerUp = () => setDragging(false);

  // 휠 줌인/줌아웃
  const onWheel = e => {
    e.preventDefault();
    let next = scale - e.deltaY * 0.002;
    if (next < 1) next = 1;
    if (next > 10) next = 10;
    setScale(next);
    // 줌 시 위치도 한계 내로 보정
    setTimeout(() => {
      const newImgW = 480 * next;
      const newImgH = 480 * next;
      const newMaxX = newImgW > vw ? (newImgW - vw) / 2 : 0;
      const newMaxY = newImgH > vh ? (newImgH - vh) / 2 : 0;
      setPos(pos => ({
        x: newMaxX === 0 ? 0 : Math.max(-newMaxX, Math.min(newMaxX, pos.x)),
        y: newMaxY === 0 ? 0 : Math.max(-newMaxY, Math.min(newMaxY, pos.y)),
      }));
    }, 0);
  };

  // 말풍선 정보 배열 (scale에 따라 개수/크기/위치 다르게)
  const balloonSets = [
    // scale <= 2
    [
      { left: '30%', top: '28%', size: 90, img: '/sns/sns3.png' },
      { left: '60%', top: '55%', size: 110, img: '/app/clo.png' },
      { left: '70%', top: '18%', size: 70, img: '/app/sew.png' },
    ],
    // scale > 2
    [
      { left: '30%', top: '28%', size: 90, img: '/sns/sns3.png' },
      { left: '60%', top: '55%', size: 110, img: '/app/clo.png' },
      { left: '70%', top: '18%', size: 70, img: '/app/sew.png' },
      { left: '45%', top: '40%', size: 60, img: '/bar/1.png' },
      { left: '80%', top: '60%', size: 80, img: '/bar/2.png' },
    ],
    // scale > 4
    [
      { left: '30%', top: '28%', size: 90, img: '/sns/sns3.png' },
      { left: '60%', top: '55%', size: 110, img: '/app/clo.png' },
      { left: '70%', top: '18%', size: 70, img: '/app/sew.png' },
      { left: '45%', top: '40%', size: 60, img: '/bar/1.png' },
      { left: '80%', top: '60%', size: 80, img: '/bar/2.png' },
      { left: '20%', top: '70%', size: 55, img: '/bar/3.png' },
      { left: '55%', top: '15%', size: 65, img: '/sns/sns3.png' },
      { left: '75%', top: '80%', size: 95, img: '/app/clo.png' },
    ],
  ];
  let balloons = balloonSets[0];
  if (scale > 4) balloons = balloonSets[2];
  else if (scale > 2) balloons = balloonSets[1];

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        background: '#fff',
        overflow: 'hidden',
        touchAction: 'none',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseMove={onPointerMove}
      onMouseUp={onPointerUp}
      onMouseLeave={onPointerUp}
      onTouchMove={onPointerMove}
      onTouchEnd={onPointerUp}
    >
      <img
        src="/map/map.png"
        alt="map"
        style={{
          width: '100vw',
          maxWidth: 480,
          height: 'auto',
          objectFit: 'contain',
          userSelect: 'none',
          pointerEvents: 'auto',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          cursor: dragging ? 'grabbing' : 'grab',
          transition: dragging ? 'none' : 'box-shadow 0.2s',
          boxShadow: dragging ? '0 0 0 0 transparent' : '0 4px 24px 0 #2563eb18',
        }}
        draggable={false}
        onMouseDown={onPointerDown}
        onTouchStart={onPointerDown}
        onWheel={onWheel}
      />
      {/* 하단 minibar.png 배경 + 선택 바 버튼 3개 (이미지 위에 고정) */}
      <img
        src="/app/minibar.png"
        alt="minibar"
        style={{
          position: 'fixed',
          left: '50%',
          bottom: -10,
          width: '100%',
          maxWidth: 480,
          minWidth: 0,
          zIndex: 30,
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />
      <div
        style={{
          position: 'fixed',
          left: '50%',
          bottom: -10,
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          zIndex: 31,
          width: '100%',
          maxWidth: 480,
          justifyContent: 'center',
          pointerEvents: 'auto',
        }}
      >
        {[1,2,3].map(num => (
          <button
            key={num}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              margin: '0 27px',
              width: 72,
              height: 72,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.18s cubic-bezier(.4,0,.2,1)',
              transform: activeBar === num ? 'scale(1.18)' : 'scale(1.0)',
            }}
            onClick={() => {
              setActiveBar(num);
              if(num === 1) router.push('/');
              if(num === 2) router.push('/sns');
              if(num === 3) router.push('/fullmap');
            }}
          >
            <img
              src={`/bar/${num}.png`}
              alt={`버튼${num}`}
              style={{ width: 72, height: 72, objectFit: 'contain', userSelect: 'none', pointerEvents: 'none' }}
            />
          </button>
        ))}
      </div>
      {/* 지도 위 말풍선 + 사진 */}
      {balloons.map((b, i) => (
        <div key={i} style={{ position: 'absolute', left: b.left, top: b.top, zIndex: 10 }}>
          <div style={{ position: 'relative', background: '#fff', borderRadius: 18, boxShadow: '0 4px 16px #2563eb22', padding: b.size * 0.12, minWidth: b.size, minHeight: b.size, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={b.img} alt={`사진${i+1}`} style={{ width: b.size * 0.78, height: b.size * 0.78, borderRadius: 12, objectFit: 'cover', marginBottom: 4 }} />
            {/* 꼬리 */}
            <div style={{ position: 'absolute', left: b.size * 0.33, bottom: -16, width: 18, height: 18, background: 'transparent' }}>
              <svg width="18" height="18"><polygon points="0,0 18,0 9,18" fill="#fff" /></svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 