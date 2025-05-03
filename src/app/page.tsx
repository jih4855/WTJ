// 'use client'; 제거 - 서버 컴포넌트로 변경

// useState, useEffect 임포트 제거
// import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import type { Post } from '@/lib/db';
import InteractivePostList from './components/InteractivePostList'; // 이 컴포넌트가 클라이언트 인터랙션을 담당한다고 가정
import { getPostsAction } from '@/app/actions';
import VisitorCounter from './components/VisitorCounter'; // VisitorCounter 임포트 유지
import type { Metadata } from "next"; // Metadata 타입 임포트

// Metadata 정의 추가 (layout.tsx에서 가져옴)
export const metadata: Metadata = {
  title: "나의 블로그",
  description: "개인 블로그입니다.",
};

// 컴포넌트 함수를 async로 변경
export default async function Home() {
  // useState, useEffect 로직 제거
  // const [posts, setPosts] = useState<Post[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // 서버에서 직접 데이터 로딩
  let posts: Post[] = [];
  let error: string | null = null;
  try {
    const result = await getPostsAction(); // 서버 컴포넌트에서 직접 서버 액션 호출
    if (result.success) {
      posts = result.posts as Post[];
    } else {
      error = result.error || '게시글 로딩 실패';
      console.error('Error loading posts (server):', error); // 서버 로그에 에러 기록
    }
  } catch (err) {
    console.error('Failed to load posts (server exception):', err);
    error = '게시글 로딩 중 오류 발생';
  }

  // isLoading 상태는 서버 컴포넌트에서 별도 관리 불필요 (데이터 로딩 후 렌더링)

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />
      <div className="container mx-auto px-4 pb-8">
        {/* 제목 등 필요한 UI 추가 가능 */}
        {/* <h1 className="text-3xl font-semibold mb-10">최근 글</h1> */}

        <div className="mt-4">
          {/* 서버에서 발생한 에러 표시 */}
          {error && <p className="text-center py-4 text-red-500">오류: {error}</p>}
          {/* 에러가 없을 때 목록 표시 */}
          {!error && (
            posts.length > 0 ? (
              // InteractivePostList는 클라이언트 컴포넌트일 수 있으므로,
              // 서버에서 가져온 데이터를 initialPosts prop으로 전달
              <InteractivePostList initialPosts={posts} />
            ) : (
              <p className="text-neutral-400">아직 작성된 글이 없습니다.</p>
            )
          )}
        </div>
      </div>
    </main>
  );
}
