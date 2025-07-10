import { GoogleGenAI } from "@google/genai";

// AI 기능 비활성화 (보안상 apiKey 완전 제거)

export default async function handler(req, res) {
  return res.status(503).json({ text: 'AI 기능이 보안상 비활성화되었습니다.' });
}

// AI 일기 생성 함수도 비활성화
export async function generateDiaryFromImage(userName, weather) {
  return '';
} 