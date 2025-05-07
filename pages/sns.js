import styled from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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
`;

const Sub = styled.div`
  font-size: 13px;
  color: #888;
`;

const FollowBtn = styled.button`
  background: #fff;
  color: #2563eb;
  border: 1.5px solid #2563eb;
  border-radius: 8px;
  padding: 6px 18px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
`;

const FeedCard = styled.div`
  width: 100%;
  max-width: 480px;
  background: #fff;
  border-bottom: 1px solid #eee;
  padding-bottom: 18px;
`;

const FeedImg = styled.img`
  width: 100%;
  height: 260px;
  object-fit: cover;
  border-radius: 12px;
  margin-top: 12px;
`;

const FeedText = styled.div`
  padding: 12px 16px 0 16px;
  font-size: 16px;
  color: #222;
  font-weight: 500;
`;

const FeedMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 8px 16px 0 16px;
  color: #888;
  font-size: 14px;
`;

const FeedTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin: 12px 0 4px 0;
`;

const BottomNav = styled.div`
  width: 100%;
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
    nick: 'waterglasstoon',
    sub: '회원님을 위한 추천',
    title: '내가 소설이나 만화, 영화 속 세계관에 갑자기 뚝 떨어지면',
    image: '/webtoon.jpg',
    text: '어떻게 먹고 살아야 하나라는 상상을 가끔 한다',
    meta: '6일 전 · 1.5만 좋아요 · 4,624 공유',
  },
  {
    profile: '/profile.png',
    nick: 'closie',
    sub: '',
    title: '삶을 입고 걷는 옷',
    image: '/closie.jpg',
    text: '지금 만나보기 · closie는 지금 어디쯤?',
    meta: '1일 전 · 2,100 좋아요 · 1,200 공유',
  },
];

export default function SnsPage() {
  return (
    <Container>
      <ProfileHeader>
        <ProfileInfo>
          <ProfileImg />
          <ProfileText>
            <Nick>waterglasstoon</Nick>
            <Sub>회원님을 위한 추천</Sub>
          </ProfileText>
        </ProfileInfo>
        <FollowBtn>팔로우</FollowBtn>
      </ProfileHeader>
      {feedData.map((feed, idx) => (
        <FeedCard key={idx}>
          <FeedTitle>{feed.title}</FeedTitle>
          <FeedImg src={feed.image} alt={feed.title} />
          <FeedText>{feed.text}</FeedText>
          <FeedMeta>{feed.meta}</FeedMeta>
        </FeedCard>
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