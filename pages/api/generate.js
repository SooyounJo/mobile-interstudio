import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { userName, weather } = req.body;
  if (!userName || !weather) {
    return res.status(400).json({ text: '이름과 날씨 정보를 모두 입력해야 합니다.' });
  }

  // 간단한 프롬프트: 이름, 날씨만 반영
  const prompt = `
너는 감정과 기억을 가진 청자켓이야. 친구(${userName})와 함께 한국의 오늘(${weather})을 경험했어. 아래 조건에 따라 3줄짜리 감성 일기를 써줘.

1. 첫 줄: 오늘의 날짜와 날씨, 친구(${userName})와 함께한 사실을 담아.
2. 두 번째 줄: 오늘 느낀 감정이나 인상적인 순간을 간단히 회고해.
3. 세 번째 줄: 오늘을 대표하는 해시태그 2~3개로 마무리해.

문장은 평어체로, 따뜻하고 긍정적으로 써줘. 반드시 3줄로만 작성해.
`;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        { text: prompt },
      ],
    });

    const response = await result.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '응답 없음';
    res.status(200).json({ text });
  } catch (e) {
    console.error('AI API 오류:', e);
    res.status(500).json({ text: 'AI 일기 생성 실패' });
  }
}

// AI 일기 생성 함수
export async function generateDiaryFromImage(userName, weather) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userName,
      weather,
    }),
  });
  if (!response.ok) return '';
  const data = await response.json();
  return data.text || '';
} 