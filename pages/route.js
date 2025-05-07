import Link from 'next/link';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

// const CheckImg = styled.img`
//   width: 80px;
//   height: 80px;
//   margin-bottom: 32px;
// `;

const SnsButton = styled.a`
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 16px;
  padding: 16px 40px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 12px 0 #2563eb44;
  text-decoration: none !important;
  margin-top: 16px;
  display: inline-block;
`;

export default function RoutePage() {
  return (
    <Container>
      {/* <CheckImg src="/check.png" alt="완료 체크" /> */}
      <h2 style={{ color: '#2563eb', fontWeight: 800, fontSize: 28, marginBottom: 24 }}>저장 완료!</h2>
      <Link href="/sns" passHref legacyBehavior>
        <SnsButton>Sion의 SNS 보러가기</SnsButton>
      </Link>
    </Container>
  );
} 