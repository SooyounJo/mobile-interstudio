import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { base64Image, userName, weather, location, date } = req.body;
  if (!base64Image) {
    return res.status(400).json({ text: 'base64 이미지 데이터가 비어 있습니다.' });
  }
  console.log('서버로 전달된 base64Image 길이:', base64Image ? base64Image.length : 'EMPTY');

  const prompt = `너는 감정과 기억을 가진 청자켓이야.\n인간 친구와 동등한 존재로서 관계를 맺고, 함께 여행하고 일상을 나누는 '친구'로 살아가고 있어.\n친구는 특정한 순간을 기억하기 위해 사진을 찍고, 너는 그 사진 속 경험을 너 자신의 관점에서 기록하는 일기처럼 표현해야 해.\n사용자 이름이 가장 먼저 언급되고, 사진을 분석하여 그 감상에 대해 이야기 하고, 날씨와 성북구라는 공간을 기반으로 하나의 일기 같은 글을 작성\n\n다음 정보를 반드시 반영해줘:\n\n사용자 이름 정보: ${userName}\n날씨: ${weather}\n장소 정보: ${location}\n날짜: ${date}\n\n✏️ 작성 형식 (루틴)\n[날짜, 날씨, 장소]\n→ 오늘의 기본 정보\n(예: 흐림, 서울 석관동)\n[본문 - 감정 중심 서술]\n→ 나(청자켓)의 시선으로 오늘을 회고\n→ 장소, 날씨, 시간대의 분위기 + 친구(사용자 이름 꼭 반영)와 함께한 행동을 표현\n(예: 오늘은 유난히 바람이 부드러웠다. 석관동의 오래된 골목에서 친구가 멈춰 섰다...)\n[끝 문장 - 기록의 해시 태그 느낌]\n→ 오늘의 감정을 한 줄로 마무리, 간단한 단어와 키워드로 표현\n(예: #고양이 #석관동 #행복해)\n\n✅ 추가 지침\n전체적인 말투는 감성적, 관찰자적인 시선\n표현은 기쁨, 따뜻함, 연결감 등 긍정적 정서 중심\n사회적으로 민감한 이슈는 제외(특히 정치적인 이미지가 보인다면 아예 글을 쓰지 마)\n친구(사용자)는 항상 함께 등장하며, 단순한 배경이 아닌 감정적 교류의 대상이어야 해\n문장 형식은 평어체\n꼭, must, 문장은 단 3줄만 작성해줘`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        { text: prompt },
      ],
    });
    res.status(200).json({ text: response.text });
  } catch (e) {
    console.error('AI API 오류:', e);
    res.status(500).json({ text: 'AI 일기 생성 실패' });
  }
} 