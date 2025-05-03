import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase'; // Admin SDK Firestore instance

export async function GET() {
  try {
    const counterRef = db.collection('metrics').doc('pageViews');
    const docSnap = await counterRef.get();

    let count = 0;
    if (docSnap.exists) {
      const data = docSnap.data();
      count = typeof data?.total === 'number' ? data.total : 0;
    }

    return NextResponse.json({ count }, { status: 200 });

  } catch (error) {
    console.error("Error fetching page view count (API): ", error);
    // 에러 발생 시 0 또는 에러 상태 반환
    return NextResponse.json({ count: 0, error: 'Failed to fetch count' }, { status: 500 }); 
  }
} 