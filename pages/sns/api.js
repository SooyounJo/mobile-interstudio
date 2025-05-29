// 파일명 변경: AIAPI.js → api.js (실제 파일명 변경은 시스템 명령 필요)
// 아래 코드를 pages/sns/api.js로 옮겨주세요.

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
  try {
    const base64ImageData = await getBase64FromUrl(imageUrl);
    // base64 값이 비어있으면 에러 throw
    if (!base64ImageData) throw new Error('이미지 변환 실패');
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
    if (!response.ok) throw new Error('AI 서버 응답 오류');
    const data = await response.json();
    return data.text;
  } catch (e) {
    throw new Error('AI 일기 생성에 실패했습니다.');
  }
} 