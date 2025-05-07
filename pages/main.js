import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled, { keyframes } from 'styled-components';

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

const Title = styled.h1`
  color: #fff;
  font-size: 48px;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 40px;
`;

const draw = keyframes`
  to {
    stroke-dashoffset: 0;
  }
`;

const AnimatedPath = styled.path`
  stroke: #fff;
  stroke-width: 4;
  fill: none;
  stroke-dasharray: 400;
  stroke-dashoffset: 400;
  animation: ${draw} 1.5s ease-out forwards;
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #fff;
  border-top: 4px solid #90caf9;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-top: 32px;
`;

export default function Main() {
  const router = useRouter();
  const [fadeout, setFadeout] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFadeout(true);
    }, 700);
    const timer2 = setTimeout(() => {
      router.replace('/');
    }, 1400);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [router]);

  return (
    <Container $fadeout={fadeout}>
      <Title>Closie</Title>
      <svg width="220" height="60" viewBox="0 0 220 60" style={{ display: 'block' }}>
        <AnimatedPath d="M10 50 Q 60 10, 110 50 T 210 50" />
      </svg>
      <Spinner />
    </Container>
  );
} 