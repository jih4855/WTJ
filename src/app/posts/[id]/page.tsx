import { notFound } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import { getPostById } from '@/lib/db';
import type { Post } from '@/lib/db';

interface PostPageParams {
  params: {
    id: string; // URL 파라미터는 기본적으로 문자열
  };
}

export default function PostPage({ params }: PostPageParams) {
  const postId = parseInt(params.id, 10); // 문자열 ID를 숫자로 변환

  // ID가 유효한 숫자인지 확인
  if (isNaN(postId)) {
    notFound(); // 유효하지 않으면 404 페이지 표시
  }

  const post = getPostById(postId);

  // 해당 ID의 포스트가 없으면 404 페이지 표시
  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />
      <div className="container mx-auto px-4 pb-8">
        <article className="prose prose-invert">
          <h1 className="text-3xl font-semibold mb-3 !mt-0">{post.title}</h1>
          <p className="text-xs text-neutral-500 mb-10">
            {new Date(post.createdAt).toLocaleDateString('ko-KR')}
          </p>
          <div className="whitespace-pre-wrap">
            {post.content}
          </div>
        </article>
      </div>
    </main>
  );
} 