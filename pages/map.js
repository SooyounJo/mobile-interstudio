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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f8ff' }}>
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
      <MapPhotoRow>
        <MapBox id="map" />
        {photoUrl && <PhotoPreview src={photoUrl} alt="사진 미리보기" />}
      </MapPhotoRow>
      {gpsError && <div style={{ color: '#e53935', textAlign: 'center', marginTop: 12 }}>{gpsError}</div>}
      <ButtonRow>
        <Link href="/" passHref legacyBehavior>
          <ActionButton as="a">홈으로 돌아가기</ActionButton>
        </Link>
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
            router.push('/');
          }}
          disabled={saving}
        >
          저장하기
        </ActionButton>
      </ButtonRow>
    </div>
  );
} 