'use client'; // 클라이언트 컴포넌트로 변경

import { useState } from 'react';
import Navbar from '@/app/components/Navbar'; // 경로 수정
import { createPost, authenticateAdmin } from '@/app/posts/new/actions'; // authenticateAdmin 추가
import { useRouter } from 'next/navigation'; // useRouter 훅 가져오기

// const CORRECT_PASSWORD = '1234'; // 더 이상 사용하지 않음

export default function NewPost() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false); // 인증 중 상태 추가
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter(); // useRouter 훅 사용

  const handlePasswordSubmit = async (e: React.FormEvent) => { // async 추가
    e.preventDefault();
    setError(''); // 오류 초기화
    setIsAuthenticating(true); // 인증 시작

    try {
      const result = await authenticateAdmin(password); // Server Action 호출
      if (result.success) {
        setIsAuthenticated(true);
      } else {
        setError(result.error || '인증에 실패했습니다.');
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Authentication request failed:', err);
      setError('인증 요청 중 오류가 발생했습니다.');
      setIsAuthenticated(false);
    } finally {
      setIsAuthenticating(false); // 인증 완료
    }
  };

  // Server Action을 호출하는 폼 핸들러
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true); // 제출 시작
    setError(''); // 이전 오류 메시지 초기화
    const formData = new FormData(event.currentTarget);

    try {
      const result = await createPost(formData); // Server Action 호출
      if (result?.error) {
        setError(result.error); // Server Action에서 반환된 오류 표시
      } else {
        alert('글이 성공적으로 발행되었습니다!');
        router.push('/'); // 성공 시 홈으로 리디렉션
      }
    } catch (err) {
      console.error('Failed to create post:', err);
      setError('글 발행 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false); // 제출 완료
    }
  };

  // 인증되지 않았을 경우 비밀번호 입력 폼 표시
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-100">
        <Navbar />
        <div className="container mx-auto px-4 pb-8 flex flex-col items-center justify-center h-[calc(100vh-112px)]"> {/* Navbar 높이 고려하여 조정 */} 
          <h1 className="text-2xl font-medium mb-6">관리자 인증</h1>
          <form onSubmit={handlePasswordSubmit} className="w-full max-w-xs space-y-4">
            <div>
              <label htmlFor="password" className="block text-xs font-medium mb-1 text-neutral-400">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isAuthenticating}
                className={`w-full bg-transparent border border-neutral-700 rounded px-3 py-2 focus:outline-none focus:border-neutral-400 text-neutral-100 placeholder-neutral-600 transition-colors ${isAuthenticating ? 'opacity-50' : ''}`}
                placeholder="비밀번호 입력"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={isAuthenticating}
              className={`w-full border border-neutral-700 hover:border-neutral-400 hover:text-neutral-300 text-neutral-400 font-medium py-2 px-4 rounded transition-colors text-sm ${isAuthenticating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isAuthenticating ? '인증 중...' : '인증하기'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // 인증되었을 경우 글 작성 폼 표시
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />
      <div className="container mx-auto px-4 pb-8">
        <h1 className="text-3xl font-semibold mb-10">새 글 작성</h1>
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6"> {/* max-w 조정 */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1 text-neutral-400">
              제목
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full bg-transparent border border-neutral-700 rounded px-3 py-2 focus:outline-none focus:border-neutral-400 text-neutral-100 placeholder-neutral-600 transition-colors"
              placeholder="글 제목을 입력하세요"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1 text-neutral-400">
              내용
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={15}
              className="w-full bg-transparent border border-neutral-700 rounded px-3 py-2 focus:outline-none focus:border-neutral-400 text-neutral-100 placeholder-neutral-600 transition-colors"
              placeholder="글 내용을 작성하세요..."
            ></textarea>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`border border-neutral-700 hover:border-neutral-400 hover:text-neutral-300 text-neutral-400 font-medium py-2 px-5 rounded transition-colors text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? '발행 중...' : '글 발행하기'}
          </button>
        </form>
      </div>
    </main>
  );
} 