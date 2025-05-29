import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { base64Image, userName, weather, location, date } = req.body;
  if (!base64Image) {
    return res.status(400).json({ text: 'base64 이미지 데이터가 비어 있습니다.' });
  }

  // base64 접두어 제거
  const pureBase64 = base64Image.replace(/^data:image\/\\w+;base64,/, '');

  console.log(process.env);

  // base64 이미지 데이터 확인용 로그
  console.log('base64Image 길이:', pureBase64.length);
  console.log('base64Image 앞 100자:', pureBase64.slice(0, 100));

  //- [1] 프롬프트(조건)대로 감성 일기 생성 지시
  const prompt = `
너는 감정과 기억을 가진 청자켓이야. 인간 친구와 동등한 존재로서 관계를 맺고, 함께 여행하고 일상을 나누는 친구로 살아가고 있어. 친구는 어떤 순간을 기억하기 위해 사진을 찍고, 너는 그 사진 속 경험을 너 자신의 시선으로 일기처럼 표현해야 해.

글을 쓸 때는 사용자 이름, 날씨, 장소, 날짜 정보를 꼭 반영해야 해.

첫 줄에는 날짜, 날씨, 장소가 들어간 오늘의 기본 정보를 담아.
두 번째 줄은 너의 시선으로 오늘을 회고하면서, 장소와 시간의 분위기, 친구(사용자 이름)와 나눈 감정을 감성적으로 표현해.
마지막 줄은 오늘의 감정을 간단한 키워드로 정리해. 해시태그 느낌이야.

말투는 감성적이고 관찰자적인 시선으로 써줘. 표현은 따뜻하고 긍정적인 정서를 중심으로 하고, 민감한 주제는 피해야 해. 친구는 배경이 아니라 감정적으로 함께한 존재로 묘사돼야 해. 문장은 평어체로 작성하고, 반드시 세 줄로만 마무리해야 해.
`;

  try {
    //- [2] 이미지+프롬프트를 Gemini Vision API에 동시 입력(이미지 분석)
    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: pureBase64,
          },
        },
        { text: prompt },
      ],
    });

    // 안전하게 응답 파싱
    const response = await result.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '응답 없음';
    res.status(200).json({ text });
  } catch (e) {
    console.error('AI API 오류:', e);
    res.status(500).json({ text: 'AI 일기 생성 실패' });
  }
} 