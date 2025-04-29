'use client'; // 클라이언트 컴포넌트로 변경

import { useState, useEffect } from 'react'; // useState, useEffect 임포트
import Navbar from './components/Navbar';
// import db from '@/lib/db'; // 클라이언트 컴포넌트에서는 직접 DB 접근 불가
import type { Post } from '@/lib/db'; 
import InteractivePostList from './components/InteractivePostList';
// 서버 액션을 통해 데이터를 가져오도록 변경
import { getPostsAction } from '@/app/actions'; // 서버 액션 임포트

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState<string | null>(null);
  // const [isListVisible, setIsListVisible] = useState(false); // 전체 목록 토글 상태 제거

  useEffect(() => {
    async function loadPosts() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getPostsAction(); // 서버 액션 호출
        if (result.success) {
          setPosts(result.posts as Post[]);
        } else {
          setError(result.error || '게시글 로딩 실패');
        }
      } catch (err) {
        console.error('Failed to load posts:', err);
        setError('게시글 로딩 중 오류 발생');
      } finally {
        setIsLoading(false);
      }
    }
    loadPosts();
  }, []); // 컴포넌트 마운트 시 한 번 실행

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />
      <div className="container mx-auto px-4 pb-8">
        {/* 제목 - 일반 h1 태그로 복원 */}
        <h1 className="text-3xl font-semibold mb-10">최근 글</h1> 
        
        {/* 목록 영역 - 항상 표시 */}
        <div className="mt-4"> 
          {isLoading && <p className="text-center py-4 text-neutral-400">로딩 중...</p>} 
          {error && <p className="text-center py-4 text-red-500">오류: {error}</p>}
          {!isLoading && !error && (
            posts.length > 0 ? (
              // InteractivePostList에 posts 전달
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
