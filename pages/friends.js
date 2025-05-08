import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

const blue = '#2563eb';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: #fafdff;
  position: relative;
  overflow: hidden;
`;

const LocationHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  padding: 16px;
  text-align: center;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const LocationText = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${blue};
  transition: all 0.3s ease;
`;

const LocationSubText = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 4px;
`;

const Friend = styled.div`
  width: 80px;
  height: 80px;
  background: url(${props => props.image}) center/contain no-repeat;
  position: absolute;
  cursor: pointer;
  transition: all 0.3s ease;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
  
  &:hover {
    transform: scale(1.1);
    filter: drop-shadow(0 6px 12px rgba(0,0,0,0.15));
  }
`;

const InfoModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.15);
  z-index: 1000;
  min-width: 200px;
  text-align: center;
`;

const InfoName = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${blue};
  margin-bottom: 8px;
`;

const InfoLocation = styled.div`
  font-size: 14px;
  color: #666;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 999;
`;

const ZoomControls = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  z-index: 100;
`;

const ZoomButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${blue};
`;

const friendData = [
  { name: '김서연', location: '서울시 강남구', image: '/1.png' },
  { name: '이지원', location: '서울시 서초구', image: '/2.png' },
  { name: '박민수', location: '서울시 송파구', image: '/3.png' },
  { name: '최유진', location: '서울시 마포구', image: '/4.png' },
  { name: '정다은', location: '서울시 용산구', image: '/5.png' },
  { name: '강현우', location: '서울시 중구', image: '/6.png' },
  { name: '윤서연', location: '서울시 종로구', image: '/7.png' },
  { name: '임지훈', location: '서울시 성동구', image: '/8.png' },
];

export default function FriendsPage() {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef(null);

  const getLocationByZoom = (zoomLevel) => {
    if (zoomLevel >= 1.75) return { main: '서울 전역', sub: '모든 지역의 친구들이 보입니다' };
    if (zoomLevel >= 1.5) return { main: '서울 남부', sub: '강남, 서초, 송파 지역' };
    if (zoomLevel >= 1.25) return { main: '서울 중부', sub: '중구, 용산, 마포 지역' };
    if (zoomLevel >= 1) return { main: '서울 동부', sub: '성동, 종로 지역' };
    return { main: '서초구', sub: '가까운 친구들이 보입니다' };
  };

  useEffect(() => {
    const updateFriends = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const friendCount = Math.floor(8 * zoom);

      const newFriends = friendData.slice(0, friendCount).map(friend => ({
        ...friend,
        x: Math.random() * (containerWidth - 80),
        y: Math.random() * (containerHeight - 80),
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: (Math.random() - 0.5) * 1.5,
      }));

      setFriends(newFriends);
    };

    updateFriends();
    const interval = setInterval(() => {
      setFriends(prevFriends => 
        prevFriends.map(friend => {
          const container = containerRef.current;
          if (!container) return friend;

          let newX = friend.x + friend.speedX;
          let newY = friend.y + friend.speedY;

          if (newX <= 0 || newX >= container.clientWidth - 80) {
            friend.speedX *= -0.95;
            newX = friend.x;
          }
          if (newY <= 0 || newY >= container.clientHeight - 80) {
            friend.speedY *= -0.95;
            newY = friend.y;
          }

          return { ...friend, x: newX, y: newY };
        })
      );
    }, 30);

    return () => clearInterval(interval);
  }, [zoom]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  return (
    <Container ref={containerRef}>
      <LocationHeader>
        <LocationText>{getLocationByZoom(zoom).main}</LocationText>
        <LocationSubText>{getLocationByZoom(zoom).sub}</LocationSubText>
      </LocationHeader>

      {friends.map((friend, index) => (
        <Friend
          key={index}
          image={friend.image}
          style={{
            left: friend.x,
            top: friend.y,
            transform: `scale(${zoom})`,
          }}
          onClick={() => setSelectedFriend(friend)}
        />
      ))}

      {selectedFriend && (
        <>
          <Overlay onClick={() => setSelectedFriend(null)} />
          <InfoModal>
            <InfoName>{selectedFriend.name}</InfoName>
            <InfoLocation>{selectedFriend.location}</InfoLocation>
          </InfoModal>
        </>
      )}

      <ZoomControls>
        <ZoomButton onClick={handleZoomOut}>-</ZoomButton>
        <ZoomButton onClick={handleZoomIn}>+</ZoomButton>
      </ZoomControls>
    </Container>
  );
} 