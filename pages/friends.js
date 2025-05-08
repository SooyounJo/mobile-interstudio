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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  touch-action: pan-x;
  user-select: none;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
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

const DateModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.15);
  z-index: 1001;
  min-width: 280px;
  text-align: center;
`;

const DateTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${blue};
  margin-bottom: 16px;
`;

const DateInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1.5px solid #e3eafc;
  border-radius: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
  background: #fafdff;
  
  &:focus {
    outline: none;
    border-color: ${blue};
  }
`;

const DateButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

const DateButton = styled.button`
  flex: 1;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.confirm {
    background: ${blue};
    color: white;
    border: none;
    
    &:hover {
      background: #1d4ed8;
    }
  }
  
  &.cancel {
    background: white;
    color: ${blue};
    border: 1.5px solid ${blue};
    
    &:hover {
      background: #fafdff;
    }
  }
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
  margin-bottom: 16px;
`;

const TogetherButton = styled.button`
  background: ${blue};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  margin-top: 8px;
  
  &:hover {
    background: #1d4ed8;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
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

const ZoomControl = styled.div`
  position: relative;
  width: 120px;
  height: 32px;
  background: #f1f5f9;
  border-radius: 16px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;

const ZoomSlider = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  color: #64748b;
  font-weight: 600;
  font-size: 14px;
  pointer-events: none;
`;

const ZoomTrack = styled.div`
  position: absolute;
  top: 50%;
  left: 12px;
  right: 12px;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  transform: translateY(-50%);
  pointer-events: none;
`;

const ZoomThumb = styled.div`
  position: absolute;
  top: 50%;
  left: ${props => props.value}%;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transform: translate(-50%, -50%);
  pointer-events: none;
  transition: left 0.1s ease;
`;

const ZoomButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  font-size: 18px;
  font-weight: bold;
  color: ${blue};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8fafc;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }
`;

const ZoomLevel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  min-width: 40px;
  text-align: center;
`;

const FriendsContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transform-origin: center center;
  transition: transform 0.3s ease;
`;

const friendData = [
  { name: '김서연', location: '서울시 강남구', image: '/1.png' },
  { name: '이지원', location: '서울시 서초구 서초동', image: '/2.png' },
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
  const [showDateModal, setShowDateModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const containerRef = useRef(null);
  const headerRef = useRef(null);

  const getLocationByZoom = (zoomLevel) => {
    if (zoomLevel >= 1.75) return { main: '서울 전역', sub: '모든 지역의 친구들이 보입니다' };
    if (zoomLevel >= 1.5) return { main: '서울 남부', sub: '강남, 서초, 송파 지역' };
    if (zoomLevel >= 1.25) return { main: '서울 중부', sub: '중구, 용산, 마포 지역' };
    if (zoomLevel >= 1) return { main: '서울 동부', sub: '성동, 종로 지역' };
    if (zoomLevel >= 0.75) return { main: '서초구', sub: '서초구 전역' };
    if (zoomLevel >= 0.6) return { main: '서초동', sub: '서초동 일대' };
    return { main: '서초동', sub: '가까운 친구들이 보입니다' };
  };

  const handleMouseDown = (e) => {
    const zoomControl = e.currentTarget.querySelector('.zoom-control');
    if (!zoomControl) return;

    const rect = zoomControl.getBoundingClientRect();
    const startX = e.clientX || e.touches[0].clientX;
    const startPercentage = ((startX - rect.left) / rect.width) * 100;
    const startZoom = 0.5 + (startPercentage / 100) * 1.5;
    
    setIsDragging(true);
    setDragStartX(startX);
    setZoom(startZoom);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const zoomControl = e.currentTarget.querySelector('.zoom-control');
    if (!zoomControl) return;

    const rect = zoomControl.getBoundingClientRect();
    const currentX = e.clientX || e.touches[0].clientX;
    const percentage = ((currentX - rect.left) / rect.width) * 100;
    const newZoom = 0.5 + (percentage / 100) * 1.5;
    
    setZoom(Math.max(0.5, Math.min(2, newZoom)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getZoomPercentage = () => {
    return ((zoom - 0.5) / 1.5) * 100;
  };

  useEffect(() => {
    if (containerRef.current) {
      const friendsContainer = containerRef.current.querySelector('.friends-container');
      if (friendsContainer) {
        friendsContainer.style.transform = `scale(${zoom})`;
      }
    }
  }, [zoom]);

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

  const handleTogether = () => {
    setShowDateModal(true);
  };

  const handleDateConfirm = () => {
    if (!startDate || !endDate) {
      alert('시작일과 종료일을 모두 선택해주세요.');
      return;
    }
    alert(`${selectedFriend.name}님과 ${startDate}부터 ${endDate}까지 함께하기가 시작되었습니다!`);
    setShowDateModal(false);
    setSelectedFriend(null);
    setStartDate('');
    setEndDate('');
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  return (
    <Container>
      <LocationHeader
        ref={headerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <LocationText>{getLocationByZoom(zoom).main}</LocationText>
        <LocationSubText>{getLocationByZoom(zoom).sub}</LocationSubText>
        <ZoomControl className="zoom-control">
          <ZoomTrack />
          <ZoomThumb value={getZoomPercentage()} />
          <ZoomSlider>
            <span>+</span>
            <span>-</span>
          </ZoomSlider>
        </ZoomControl>
      </LocationHeader>

      <FriendsContainer 
        ref={containerRef}
        className="friends-container"
      >
        {friends.map((friend, index) => (
          <Friend
            key={index}
            image={friend.image}
            style={{
              left: friend.x,
              top: friend.y,
              transform: `scale(${selectedFriend === friend ? 2 : 1})`,
              transition: 'transform 0.3s ease',
              zIndex: selectedFriend === friend ? 100 : 1,
            }}
            onClick={() => setSelectedFriend(friend)}
          />
        ))}
      </FriendsContainer>

      {selectedFriend && (
        <>
          <Overlay onClick={() => {
            setSelectedFriend(null);
            setShowDateModal(false);
          }} />
          <InfoModal>
            <InfoName>{selectedFriend.name}</InfoName>
            <InfoLocation>{selectedFriend.location}</InfoLocation>
            <TogetherButton onClick={handleTogether}>
              이 친구와 함께하기
            </TogetherButton>
          </InfoModal>
        </>
      )}

      {showDateModal && (
        <DateModal>
          <DateTitle>함께할 기간을 선택해주세요</DateTitle>
          <DateInput
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="시작일"
          />
          <DateInput
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="종료일"
          />
          <DateButtonGroup>
            <DateButton className="cancel" onClick={() => setShowDateModal(false)}>
              취소
            </DateButton>
            <DateButton className="confirm" onClick={handleDateConfirm}>
              확인
            </DateButton>
          </DateButtonGroup>
        </DateModal>
      )}
    </Container>
  );
} 