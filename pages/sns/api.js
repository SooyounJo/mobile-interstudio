// AIAPI.js: AI 일기 생성 및 base64 변환 함수

// 이미지 URL을 base64로 변환
export function getBase64FromUrl(url) {
  return fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }));
}

// AI 일기 생성 함수
export async function generateDiaryFromImage(imageUrl, userName, weather, location, date) {
  const base64ImageData = await getBase64FromUrl(imageUrl);
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      base64Image: base64ImageData,
      userName,
      weather,
      location,
      date,
    }),
  });
  if (!response.ok) return '';
  const data = await response.json();
  console.log('AI 응답:', response.text);
  return data.text || '';
} 