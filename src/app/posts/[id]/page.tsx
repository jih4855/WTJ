import { notFound } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import { db } from '@/lib/firebase';
import type { Post } from '@/lib/db';
import { Timestamp } from 'firebase-admin/firestore';

// PostPage 컴포넌트의 props 타입을 위한 인터페이스 정의 (삭제됨)

// 1. params의 타입을 Promise로 감싼 타입 정의
type PostPageProps = {
  params: Promise<{ id: string }>;
};

// 모든 게시글 ID를 가져와 정적 파라미터 생성
export async function generateStaticParams() {
  try {
    // ID만 가져오도록 select() 추가 (효율성)
    const postsSnapshot = await db.collection('posts').select().get(); 
    return postsSnapshot.docs.map((doc) => ({
      id: doc.id,
    }));
  } catch (error) {
    console.error("Error generating static params for posts:", error);
    return []; // 오류 발생 시 빈 배열 반환
  }
}

// 2. 함수 시그니처에 새로운 타입 적용
export default async function PostPage({ params: paramsPromise }: PostPageProps) {
  // 3. await를 사용하여 params 객체 추출
  const params = await paramsPromise;
  const postId = params.id;
  let post: Post | null = null;
  let error: string | null = null;

  try {
    const docRef = db.collection('posts').doc(postId);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      post = {
        id: docSnap.id,
        title: data?.title || '제목 없음',
        content: data?.content || '내용 없음',
        createdAt: data?.createdAt instanceof Timestamp 
                   ? data.createdAt.toDate().toISOString() 
                   : data?.createdAt || new Date().toISOString(),
      };
    } else {
      notFound();
    }
  } catch (err) {
    console.error("Error fetching post from Firestore:", err);
    error = "게시글을 불러오는 중 오류가 발생했습니다.";
  }

  if (error) {
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-100">
        <Navbar />
        <div className="container mx-auto px-4 pb-8 text-center text-red-500">
          {error}
        </div>
      </main>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />
      <div className="container mx-auto px-4 pb-8">
        <article className="prose prose-invert max-w-none">
          <h1 className="text-3xl font-semibold mb-3 !mt-8">{post.title}</h1>
          <p className="text-xs text-neutral-500 mb-10">
            {new Date(post.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div className="whitespace-pre-wrap text-base leading-relaxed">
            {post.content}
          </div>
        </article>
      </div>
    </main>
  );
} 