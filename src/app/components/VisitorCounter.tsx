import { db } from "@/lib/firebase"; // Firebase Admin SDK Firestore 인스턴스

async function getPageViewCount(): Promise<number> {
  try {
    const counterRef = db.collection('metrics').doc('pageViews');
    const docSnap = await counterRef.get();

    if (docSnap.exists) {
      // 문서가 존재하면 total 필드 값을 반환, 없거나 숫자가 아니면 0 반환
      const data = docSnap.data();
      return typeof data?.total === 'number' ? data.total : 0;
    } else {
      // 문서가 존재하지 않으면 0 반환
      console.log('Page view counter document does not exist yet.');
      return 0;
    }
  } catch (error) {
    console.error("Error fetching page view count (VisitorCounter): ", error);
    // 오류 발생 시 0 반환 (또는 오류 메시지 표시 등의 다른 처리 가능)
    return 0;
  }
}

export default async function VisitorCounter() {
  const count = await getPageViewCount();

  return (
    <div className="text-sm text-neutral-400">
      총 방문자 수: {count.toLocaleString()} {/* 숫자에 콤마 추가 */}
    </div>
  );
} 