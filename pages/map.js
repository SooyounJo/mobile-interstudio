import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useRouter } from 'next/router';

const IconRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  margin-top: 40px;
  margin-bottom: 32px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s;
  &:hover, &.active {
    transform: scale(1.12);
  }
`;

const MapPhotoRow = styled.div`
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 24px;
  flex: 1 1 auto;
  min-height: 0;
  margin: 0 auto;
`;

const MapBox = styled.div`
  width: 100vw;
  max-width: 100vw;
  min-width: 0;
  min-height: 0;
  height: 480px;
  border-radius: 16px;
  box-shadow: 0 2px 12px 0 #2563eb22;
  overflow: hidden;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PhotoPreview = styled.img`
  width: 96px;
  height: 96px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 2px 8px 0 #2563eb22;
  margin-top: 8px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 32px auto 80px auto;
  z-index: 10;
`;

const ActionButton = styled.button`
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 16px;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 12px 0 #2563eb44;
  display: block;
  text-decoration: none;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default function MapPage() {
  const [selected, setSelected] = useState('photo');
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const router = useRouter();
  const [photoUrl, setPhotoUrl] = useState(null);
  const [gpsAllowed, setGpsAllowed] = useState(false);
  const [gpsError, setGpsError] = useState(null);
  const [gpsPosition, setGpsPosition] = useState(null);
  const [saving, setSaving] = useState(false);
  const [activeBar, setActiveBar] = useState(2); // map이 2번 버튼

  // GPS 권한 요청 및 위치 정보 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsAllowed(true);
          setGpsPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          setGpsAllowed(false);
          setGpsError('위치 정보 사용이 거부되었습니다.');
        },
        { enableHighAccuracy: true }
      );
    } else {
      setGpsError('이 브라우저에서는 위치 정보가 지원되지 않습니다.');
    }
  }, []);

  useEffect(() => {
    // 카카오맵 스크립트 동적 로드
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=3d51d40b37cd2ec7eab092b604cf4322&autoload=false`;
    script.async = true;
    document.head.appendChild(script);
    script.onload = () => {
      window.kakao.maps.load(() => {
        const map = new window.kakao.maps.Map(document.getElementById('map'), {
          center: gpsPosition ? new window.kakao.maps.LatLng(gpsPosition.lat, gpsPosition.lng) : new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 3,
        });
        if (gpsPosition) {
          new window.kakao.maps.Marker({
            map,
            position: new window.kakao.maps.LatLng(gpsPosition.lat, gpsPosition.lng),
          });
        }
      });
    };
    return () => {
      document.head.removeChild(script);
    };
  }, [gpsPosition]);

  // 파일 선택 시 미리보기
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  // 오디오 녹음(파일 선택) 시 파일명만 alert로 표시
  const handleAudioChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      alert(`녹음된 파일: ${e.target.files[0].name}`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f8ff', position: 'relative' }}>
      {/* 좌측 상단 뒤로가기 버튼 */}
      <button
        onClick={() => router.push('/sns')}
        style={{
          position: 'absolute',
          left: 12,
          top: 12,
          width: 24,
          height: 24,
          background: 'none',
          border: 'none',
          padding: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        aria-label="뒤로가기"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15L6 9L12 3" stroke="#222" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div style={{ width: '100%', maxWidth: 480, margin: '40px auto 0 auto' }}>
        <IconRow>
          {/* 카메라(사진)만 남김 */}
          <IconButton
            className={selected === 'photo' ? 'active' : ''}
            onClick={() => {
              setSelected('photo');
              fileInputRef.current && fileInputRef.current.click();
            }}
            title="카메라"
          >
            <img src="/ca.png" alt="카메라" style={{ width: 48, height: 48 }} />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </IconButton>
        </IconRow>
      </div>
      <MapPhotoRow style={{ position: 'relative' }}>
        <MapBox>
          {/* <div id="map" /> 기존 카카오맵 제거 */}
          <img src="/map/map.png" alt="map" style={{ width: '720px', height: '720px', maxWidth: 'none', maxHeight: 'none', objectFit: 'contain', display: 'block' }} />
          {/* 말풍선: 석관동 한국예술종합학교 */}
          <div style={{ position: 'absolute', right: '3%', top: '16%', zIndex: 10, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              position: 'relative',
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 4px 16px #2563eb22',
              padding: '14px 22px',
              fontSize: 17,
              fontWeight: 600,
              color: '#222',
              minWidth: 120,
              textAlign: 'center',
              display: 'inline-block',
            }}>
              석관동 한국예술종합학교
              {/* 꼬리 */}
              <div style={{ position: 'absolute', left: 38, bottom: -16, width: 18, height: 18, background: 'transparent' }}>
                <svg width="18" height="18"><polygon points="0,0 18,0 9,18" fill="#fff" /></svg>
              </div>
            </div>
            {/* 사진 미리보기 (말풍선 아래) */}
            {photoUrl && (
              <img
                src={photoUrl}
                alt="사진 미리보기"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  objectFit: 'cover',
                  boxShadow: '0 2px 8px 0 #2563eb22',
                  marginTop: 10,
                  background: '#eee',
                  pointerEvents: 'auto',
                }}
              />
            )}
          </div>
        </MapBox>
      </MapPhotoRow>
      {gpsError && <div style={{ color: '#e53935', textAlign: 'center', marginTop: 12 }}>{gpsError}</div>}
      <ButtonRow>
        <ActionButton
          onClick={() => {
            if (saving) return;
            setSaving(true);
            // 오늘 날짜 구하기
            const today = new Date();
            const dateStr = today.getFullYear() + '.' + String(today.getMonth()+1).padStart(2,'0') + '.' + String(today.getDate()).padStart(2,'0');
            // 사진 url (없으면 기본)
            const photo = photoUrl || '/profile.png';
            // 임시 문구
            const text = 'AI가 곧 작성할 문구입니다.';
            // localStorage에 저장
            localStorage.setItem('newFeed', JSON.stringify({ date: dateStr, photo, text }));
            router.push('/sns#new');
          }}
          disabled={saving}
        >
          저장하기
        </ActionButton>
      </ButtonRow>
      {/* 하단 minibar.png 배경 + 선택 바 버튼 3개 */}
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
    </div>
  );
} 