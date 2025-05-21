import styled from 'styled-components';
import { useState } from 'react';
import { useRouter } from 'next/router';

const blue = '#2563eb';
const COMMON_WIDTH = '360px';

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
  margin-right: 8px;
`;

const FindFriendBtn = styled.button`
  background: ${blue};
  color: #fff;
  border: 1.5px solid ${blue};
  border-radius: 8px;
  padding: 6px 18px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

const FeedCard = styled.div`
  width: 100%;
  max-width: ${COMMON_WIDTH};
  background: #fafdff;
  border-radius: 22px;
  box-shadow: 0 4px 24px 0 #2563eb18, 0 1.5px 0 #2563eb11;
  border: 1.5px solid #e3eafc;
  padding: 22px 0 18px 0;
  margin: 0 auto 22px auto;
  position: relative;
  box-sizing: border-box;
  padding-left: 10px;
  padding-right: 10px;
`;

const FeedImg = styled.img`
  width: 100%;
  max-width: ${COMMON_WIDTH};
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 0;
  margin: 0 auto 12px auto;
  display: block;
  box-shadow: 0 2px 12px #2563eb22;
  box-sizing: border-box;
  padding-left: 0;
  padding-right: 0;
`;

const MapImg = styled.img`
  width: 100%;
  max-width: ${COMMON_WIDTH};
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 0;
  margin: 0 auto 12px auto;
  display: block;
  border: 2px solid #2563eb44;
  background: #eaf1ff;
  box-sizing: border-box;
  padding-left: 0;
  padding-right: 0;
  cursor: pointer;
`;

const SlideWrap = styled.div`
  width: 100%;
  max-width: ${COMMON_WIDTH};
  height: 240px;
  overflow: hidden;
  position: relative;
  margin: 0 auto 8px auto;
  box-sizing: border-box;
  padding-left: 10px;
  padding-right: 10px;
`;

const SlideInner = styled.div`
  display: flex;
  width: 200%;
  max-width: calc(2 * ${COMMON_WIDTH});
  height: 100%;
  transform: translateX(${props => props.idx === 0 ? '0' : `-${COMMON_WIDTH}`});
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

const FeedTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: ${blue};
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  padding-left: 10px;
  padding-right: 10px;
`;

const FeedMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px 0 10px;
  color: #7a8bb7;
  font-size: 14px;
  text-align: left;
  margin-bottom: 8px;
  box-sizing: border-box;
  font-weight: 500;
`;

const FeedText = styled.div`
  padding: 0 10px 0 10px;
  font-size: 14px;
  color: ${blue};
  font-weight: 500;
  text-align: left;
  margin-bottom: 8px;
  box-sizing: border-box;
`;

const SaveMemoryButton = styled.button`
  background: #fff;
  color: #2563eb;
  border: 1.2px solid #2563eb;
  border-radius: 8px;
  padding: 3px 12px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  margin-left: 6px;
  transition: background 0.15s;
  &:hover {
    background: #eaf1ff;
  }
`;

const CommentSection = styled.div`
  width: 100%;
  max-width: ${COMMON_WIDTH};
  padding: 0 18px 12px 18px;
  box-sizing: border-box;
  margin: 0 auto;
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
  margin-top: 6px;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1.5px solid #cfd8dc;
  border-radius: 10px;
  font-size: 14px;
  color: #7a8bb7;
  background: #fafdff;
  &::placeholder {
    color: #7a8bb7;
    opacity: 1;
  }
`;

const CommentButton = styled.button`
  background: ${blue};
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px 0 #2563eb22;
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
    map: '/cafecl.png'
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
  const router = useRouter();

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
          <MapImg src={feed.map} alt={feed.place + ' 지도'} onClick={() => router.push('/fullmap')} />
        </SlideInner>
      </SlideWrap>
      <SlideDotWrap>
        <SlideDot active={slideIdx === 0} />
        <SlideDot active={slideIdx === 1} />
      </SlideDotWrap>
      <FeedText>{feed.text}</FeedText>
      <FeedMeta>
        {feed.meta}
        <SaveMemoryButton onClick={() => alert('내 기억에 저장되었습니다!')}>내 기억으로 저장</SaveMemoryButton>
      </FeedMeta>
      <div style={{width:'100%',height:'1px',background:'#e3eafc',margin:'18px 0 8px 0',padding:'0 10px',boxSizing:'border-box'}} />
      <div style={{fontWeight:500, fontSize:'14px', color:blue, marginBottom:2, padding:'0 10px',boxSizing:'border-box'}}>{feed.place}</div>
      <div style={{fontSize:'14px', color:blue, opacity:0.8, padding:'0 10px',boxSizing:'border-box', fontWeight:500}}>{feed.placeDesc}</div>
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
  const router = useRouter();
  const [comments, setComments] = useState({});
  const [slideIdx, setSlideIdx] = useState(0);

  const handleComment = (feedIdx, comment) => {
    setComments(prev => ({
      ...prev,
      [feedIdx]: [...(prev[feedIdx] || []), comment]
    }));
  };

  return (
    <Container>
      <ProfileHeader>
        <ProfileInfo>
          <ProfileImg />
          <ProfileText>
            <Nick>김인터</Nick>
            <Sub>@interstudio</Sub>
          </ProfileText>
        </ProfileInfo>
        <ButtonContainer>
          <FollowBtn>팔로우</FollowBtn>
          <FindFriendBtn onClick={() => router.push('/friends')}>친구찾기</FindFriendBtn>
        </ButtonContainer>
      </ProfileHeader>
      {feedData.map((feed, idx) => (
        <Feed
          key={idx}
          feed={feed}
          comments={comments[idx] || []}
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