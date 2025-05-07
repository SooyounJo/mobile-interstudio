import styled from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Container = styled.div`
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

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

const images = [
  { src: '/cafe.jpg', place: '서울 카페거리' },
  { src: '/str.jpg', place: '스트라스부르 광장' },
];

const MemoryList = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 32px auto 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Memory = styled.div`
  background: #f4f8ff;
  border-radius: 16px;
  padding: 20px 18px;
  color: #34568B;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 2px 8px #2563eb22;
`;

const SlideBox = styled.div`
  width: 90vw;
  max-width: 400px;
  margin: 0 auto 16px auto;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 2px 16px #2563eb22;
  background: #fff;
  position: relative;
`;

const PlaceTag = styled.div`
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: #2563ebcc;
  color: #fff;
  padding: 6px 18px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  box-shadow: 0 2px 8px #2563eb33;
`;

export default function SnsPage() {
  const memories = [
    '파리에서 함께한 노을진 산책길, 잊지 못할 순간이었어요.',
    '카페에서 나눈 깊은 대화, 따뜻한 커피처럼 오래 기억될 거예요.',
    '스트라스부르의 겨울 축제, 함께여서 더 특별했어요.',
    '사진 한 장 한 장에 담긴 소중한 추억들, 고마워요!',
  ];
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    centerMode: true,
    centerPadding: '0',
  };
  return (
    <Container>
      <h2 style={{ color: '#2563eb', fontWeight: 800, fontSize: 28, marginBottom: 18 }}>Sion의 SNS</h2>
      <SlideBox>
        <Slider {...sliderSettings}>
          {images.map((img, idx) => (
            <div key={idx} style={{ position: 'relative', width: '100%', height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eaf1ff' }}>
              <img src={img.src} alt={img.place} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '16px' }} />
              <PlaceTag>{img.place}</PlaceTag>
            </div>
          ))}
        </Slider>
      </SlideBox>
      <MemoryList>
        {memories.map((m, i) => (
          <Memory key={i}>{m}</Memory>
        ))}
      </MemoryList>
      <SnsButton href="https://instagram.com/sion_sns" target="_blank" rel="noopener noreferrer">
        인스타그램 바로가기
      </SnsButton>
    </Container>
  );
} 