import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase'; // Admin SDK Firestore instance
import { FieldValue } from 'firebase-admin/firestore'; // FieldValue 임포트 추가

export async function POST() {
  try {
    const counterRef = db.collection('metrics').doc('pageViews');

    // Admin SDK를 사용하여 total 필드를 1 증가시킵니다.
    // set 함수와 { merge: true }를 사용하여 문서가 없으면 생성하고, 있으면 필드를 업데이트합니다.
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