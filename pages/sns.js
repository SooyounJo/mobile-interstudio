import styled from 'styled-components';
import { useState } from 'react';

const blue = '#2563eb';

const Container = styled.div`
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileHeader = styled.div`
  width: 100%;
  max-width: 480px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 16px 8px 16px;
  border-bottom: 1px solid #eee;
  background: #fff;
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProfileImg = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #eee url('/profile.png') center/cover no-repeat;
  border: 1.5px solid #ddd;
`;

const ProfileText = styled.div`
  display: flex;
  flex-direction: column;
`;

const Nick = styled.div`
  font-weight: 700;
  font-size: 16px;
  color: ${blue};
  text-align: left;
`;

const Sub = styled.div`
  font-size: 13px;
  color: ${blue};
  text-align: left;
`;

const FollowBtn = styled.button`
  background: #fff;
  color: ${blue};
  border: 1.5px solid ${blue};
  border-radius: 8px;
  padding: 6px 18px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
`;

const FeedCard = styled.div`
  width: 100vw;
  max-width: 480px;
  background: #fff;
  border-bottom: 1px solid #eee;
  padding-bottom: 18px;
  margin-bottom: 12px;
`;

const FeedImg = styled.img`
  width: 100vw;
  max-width: 480px;
  height: 260px;
  object-fit: cover;
  border-radius: 18px;
  margin-top: 0;
  transition: box-shadow 0.2s;
  box-shadow: 0 2px 8px #2563eb22;
`;

const MapImg = styled.img`
  width: 100vw;
  max-width: 480px;
  height: 260px;
  object-fit: cover;
  border-radius: 18px;
  margin-top: 0;
  border: 2px solid #2563eb44;
  background: #eaf1ff;
`;

const SlideWrap = styled.div`
  width: 100vw;
  max-width: 480px;
  height: 260px;
  overflow: hidden;
  position: relative;
`;

const SlideInner = styled.div`
  display: flex;
  width: 200vw;
  height: 100%;
  transform: translateX(${props => props.idx === 0 ? '0' : '-100vw'});
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
`;

const SlideDotWrap = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 8px 0 0 0;
`;

const SlideDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.active ? blue : '#cfd8dc'};
`;

const FeedText = styled.div`
  padding: 12px 16px 0 16px;
  font-size: 16px;
  color: ${blue};
  font-weight: 500;
  text-align: left;
`;

const FeedMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 8px 16px 0 16px;
  color: ${blue};
  font-size: 14px;
  text-align: left;
`;

const FeedTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin: 12px 0 4px 0;
  color: ${blue};
  text-align: left;
`;

const PlaceCard = styled.div`
  width: 100vw;
  max-width: 480px;
  background: #eaf1ff;
  border: 2px solid #2563eb;
  border-radius: 18px;
  padding: 16px 14px 16px 14px;
  color: ${blue};
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 4px 16px #2563eb33, 0 1.5px 0 #2563eb44;
  margin: 18px auto 18px auto;
  text-align: left;
  letter-spacing: 0.01em;
`;

const CommentSection = styled.div`
  width: 100vw;
  max-width: 480px;
  padding: 0 14px 12px 14px;
  box-sizing: border-box;
`;

const CommentList = styled.div`
  margin-bottom: 8px;
`;

const Comment = styled.div`
  font-size: 15px;
  color: ${blue};
  margin-bottom: 4px;
  text-align: left;
`;

const CommentForm = styled.form`
  display: flex;
  gap: 8px;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  color: ${blue};
`;

const CommentButton = styled.button`
  background: ${blue};
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
`;

const BottomNav = styled.div`
  width: 100vw;
  max-width: 480px;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 54px;
  z-index: 100;
`;

const NavIcon = styled.div`
  width: 28px;
  height: 28px;
  background: #eee;
  border-radius: 50%;
`;

const feedData = [
  {
    profile: '/profile.png',
    nick: 'closie',
    sub: '',
    title: '서울 카페거리의 하루',
    image: '/cafe.jpg',
    text: '따뜻한 햇살과 커피향이 가득한 서울의 카페거리에서.',
    meta: '2일 전 · 1,200 좋아요 · 300 공유',
    place: '서울 카페거리',
    placeDesc: '서울의 감성적인 카페들이 모여있는 거리. 다양한 커피와 디저트를 즐길 수 있어요.',
    map: 'https://maps.googleapis.com/maps/api/staticmap?center=37.5422,127.0566&zoom=15&size=600x300&markers=color:blue%7C37.5422,127.0566&key=YOUR_API_KEY'
  },
  {
    profile: '/profile.png',
    nick: 'closie',
    sub: '',
    title: '청계천에서의 산책',
    image: '/str.jpg',
    text: '신기한 동물을 많이 보았던 청계천 산책.',
    meta: '1일 전 · 2,100 좋아요 · 1,200 공유',
    place: '청계천',
    placeDesc: '여유로운 아침 청계천에서 서연이랑 산책을 했어요!',
    map: 'https://maps.googleapis.com/maps/api/staticmap?center=37.5702,126.9768&zoom=15&size=600x300&markers=color:blue%7C37.5702,126.9768&key=YOUR_API_KEY'
  },
];

function Feed({ feed, comments, onComment }) {
  const [slideIdx, setSlideIdx] = useState(0);
  let touchStartX = null;

  // 모바일 터치 슬라이드 구현
  const handleTouchStart = e => {
    touchStartX = e.touches[0].clientX;
  };
  const handleTouchEnd = e => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (dx < -50 && slideIdx === 0) setSlideIdx(1); // 오른쪽으로 밀면 지도
    if (dx > 50 && slideIdx === 1) setSlideIdx(0); // 왼쪽으로 밀면 사진
    touchStartX = null;
  };

  return (
    <FeedCard>
      <FeedTitle>{feed.title}</FeedTitle>
      <SlideWrap
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <SlideInner idx={slideIdx}>
          <FeedImg src={feed.image} alt={feed.title} />
          <MapImg src={feed.map} alt={feed.place + ' 지도'} />
        </SlideInner>
      </SlideWrap>
      <SlideDotWrap>
        <SlideDot active={slideIdx === 0} />
        <SlideDot active={slideIdx === 1} />
      </SlideDotWrap>
      <FeedText>{feed.text}</FeedText>
      <FeedMeta>{feed.meta}</FeedMeta>
      <PlaceCard>
        <b>{feed.place}</b><br />
        {feed.placeDesc}
      </PlaceCard>
      <CommentSection>
        <CommentList>
          {comments.map((c, i) => (
            <Comment key={i}>{c}</Comment>
          ))}
        </CommentList>
        <CommentForm onSubmit={e => {
          e.preventDefault();
          if (e.target[0].value.trim()) {
            onComment(e.target[0].value);
            e.target[0].value = '';
          }
        }}>
          <CommentInput
            placeholder="댓글을 입력하세요..."
          />
          <CommentButton type="submit">저장</CommentButton>
        </CommentForm>
      </CommentSection>
    </FeedCard>
  );
}

export default function SnsPage() {
  const [comments, setComments] = useState([[], []]);

  const handleComment = (feedIdx, comment) => {
    setComments(prev => {
      const newComments = [...prev];
      newComments[feedIdx] = [...newComments[feedIdx], comment];
      return newComments;
    });
  };

  return (
    <Container>
      <ProfileHeader>
        <ProfileInfo>
          <ProfileImg />
          <ProfileText>
            <Nick>closie</Nick>
            <Sub>closie의 피드</Sub>
          </ProfileText>
        </ProfileInfo>
        <FollowBtn>팔로우</FollowBtn>
      </ProfileHeader>
      {feedData.map((feed, idx) => (
        <Feed
          key={idx}
          feed={feed}
          comments={comments[idx]}
          onComment={comment => handleComment(idx, comment)}
        />
      ))}
      <BottomNav>
        <NavIcon />
        <NavIcon />
        <NavIcon />
        <NavIcon />
      </BottomNav>
    </Container>
  );
} 