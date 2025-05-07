import styled from 'styled-components';

const FullMapWrap = styled.div`
  min-height: 100vh;
  background: #fafdff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 0;
`;

const MapTitle = styled.h2`
  color: #2563eb;
  font-size: 22px;
  font-weight: 700;
  margin: 32px 0 18px 0;
`;

const BigMap = styled.img`
  width: 100vw;
  max-width: 600px;
  height: 60vw;
  max-height: 480px;
  object-fit: cover;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 #2563eb18;
  margin-bottom: 32px;
`;

const Info = styled.div`
  color: #2563eb;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 24px;
`;

export default function FullMap() {
  return (
    <FullMapWrap>
      <MapTitle>지나온 위치 전체 보기</MapTitle>
      <BigMap src="/fullmap.png" alt="전체 지도" />
      <Info>지나온 위치와 기록을 한눈에 볼 수 있습니다.</Info>
    </FullMapWrap>
  );
} 