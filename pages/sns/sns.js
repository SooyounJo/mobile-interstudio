import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ImageSection from '../components/ImageSection';
import AnimationSection from '../components/AnimationSection';
import { generateDiaryFromImage } from '../utils/api';

export default function SNSPage() {
  const [activeBar, setActiveBar] = useState(2);
  const [showAddBtn, setShowAddBtn] = useState(false);
  const [newFeed, setNewFeed] = useState(null);
  const [displayedText2, setDisplayedText2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // 스크롤에 따라 버튼 노출
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      const scrollY = window.scrollY || window.pageYOffset;
      const winH = window.innerHeight;
      const docH = document.body.scrollHeight;
      if (scrollY + winH >= docH - 2) setShowAddBtn(true);
      else setShowAddBtn(false);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 저장된 newFeed 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const feed = localStorage.getItem('newFeed');
      if (feed) {
        setNewFeed(JSON.parse(feed));
        localStorage.removeItem('newFeed');
      }
    }
  }, []);

  // newFeed가 있을 때 하단으로 자동 스크롤
  useEffect(() => {
    if (newFeed && typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        const lastElement = document.querySelector('img[src="/sns/sns3.png"]');
        if (lastElement) {
          lastElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [newFeed]);

  // 사진이 추가될 때마다 AI 일기 생성
  useEffect(() => {
    if (newFeed && newFeed.photo) {
      setLoading(true);
      setError('');
      generateDiaryFromImage(
        newFeed.photo,
        '수연',
        '맑음',
        '서울 성북구',
        newFeed.date
      ).then(text => {
        let i = 0;
        setDisplayedText2('');
        function type() {
          setDisplayedText2(prev => prev + (text[i] || ''));
          i++;
          if (i < text.length) setTimeout(type, 40);
        }
        type();
        setLoading(false);
      }).catch(e => {
        setError(e.message);
        setLoading(false);
      });
    }
  }, [newFeed]);

  return (
    <div style={{ minHeight: '100vh', background: '#fff', position: 'relative' }}>
      <div style={{ width: '100vw', maxWidth: 480, margin: '0 auto', paddingTop: 0, paddingBottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        <ImageSection newFeed={newFeed} onAddDiary={() => router.push('/map')} />
        <img src="/sns/sns3.png" alt="sns3" style={{ width: '100vw', maxWidth: 480, height: 'auto', objectFit: 'contain', display: 'block' }} />
      </div>

      {/* 일기 결과를 페이지 맨 아래에 자연스럽게 출력 */}
      <div style={{ width: '100vw', maxWidth: 480, margin: '0 auto', paddingBottom: 32 }}>
        {newFeed && (
          <AnimationSection loading={loading} error={error} displayedText2={displayedText2} />
        )}
      </div>

      {/* 하단 minibar, 바 버튼, 추억 추가하기 버튼 등은 기존 코드 그대로 복사/분리 가능 */}
      {/* ... (생략) ... */}
    </div>
  );
} 