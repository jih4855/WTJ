import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/firebase'; // Admin SDK Firestore instance
import { FieldValue } from 'firebase-admin/firestore'; // FieldValue 임포트 추가

export async function POST(request: NextRequest) {
  try {
    // 요청 본문에서 pathname 읽기
    let pathname = '/'; // 기본값 설정
    try {
      const body = await request.json();
      if (typeof body.pathname === 'string') {
        pathname = body.pathname;
      }
    } catch {
      // JSON 파싱 실패 시 로그만 남김
      console.warn('Could not parse request body or pathname missing');
    }

    // --- 서버 측 경로 체크 추가 ---
    if (pathname.startsWith('/manage')) {
      console.log(`Skipping count for path: ${pathname}`); // 확인용 로그 (선택 사항)
      // 카운트 안 하고 성공 응답 반환
      return NextResponse.json({ message: 'Skipped page view count for manage path.' }, { status: 200 });
    }
    // --- 경로 체크 끝 ---

    // 카운터 증가 로직 (경로 체크 통과 시)
    const counterRef = db.collection('metrics').doc('pageViews');
    await counterRef.set({ 
      total: FieldValue.increment(1) 
    }, { merge: true });

    // 성공 응답 반환
    return NextResponse.json({ message: 'Page view count incremented successfully.' }, { status: 200 });

  } catch (error) {
    console.error("Error incrementing page view count (API Route): ", error);
    // 실패 응답 반환
    return NextResponse.json({ message: 'Failed to increment page view count.', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

// 참고: GET 요청으로도 구현할 수 있지만,
// 상태를 변경하는 작업은 POST가 더 적합한 경우가 많습니다.
// export async function GET() { ... } 