import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #2563eb;
  transition: opacity 0.7s ease;
  opacity: ${props => props.$fadeout ? 0 : 1};
`;

export default function Main() {
  const router = useRouter();
  const [fadeout, setFadeout] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFadeout(true);
    }, 3000); // 3초 후 fadeout
    const timer2 = setTimeout(() => {
      router.replace('/');
    }, 3700); // fadeout 후 홈으로 이동
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [router]);

  return (
    <Container $fadeout={fadeout}>
      <img src="/app/appmain.png" alt="앱 메인" style={{ width: 220, height: 220, objectFit: 'contain' }} />
    </Container>
  );
} 