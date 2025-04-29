'use client'; // 클라이언트 컴포넌트 명시

import { useState } from 'react'; // useState 추가
import { deletePost } from '@/app/actions';

interface DeletePostButtonProps {
  postId: number;
  postTitle: string;
}

export default function DeletePostButton({ postId, postTitle }: DeletePostButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false); // 삭제 중 상태 추가
  const [error, setError] = useState<string | null>(null); // 오류 상태 추가

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // 기본 폼 제출 동작 방지

    if (!window.confirm(`'${postTitle}' 글을 정말 삭제하시겠습니까?`)) {
      return; // 취소 시 중단
    }

    setIsDeleting(true);
    setError(null);

    const formData = new FormData();
    formData.append('postId', String(postId));

    try {
      const result = await deletePost(formData); // Server Action 직접 호출
      if (result?.error) {
        setError(result.error);
        console.error("Delete failed:", result.error);
        // 사용자에게 오류 알림 (예: alert(result.error);)
      }
      // 성공 시 별도 처리 없음 (페이지 새로고침은 revalidatePath가 담당)
    } catch (err) {
      setError('삭제 중 오류가 발생했습니다.');
      console.error("Error submitting delete form:", err);
      // 사용자에게 오류 알림 (예: alert('삭제 중 오류가 발생했습니다.');)
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    // action 속성 제거, onSubmit 핸들러 추가
    <form onSubmit={handleSubmit} className="inline-block ml-4">
      {/* input hidden 필드 제거 가능 (formData로 직접 전달) */}
      {/* <input type="hidden" name="postId" value={postId} /> */}
      <button
        type="submit"
        disabled={isDeleting} // 삭제 중 비활성화
        className={`text-xs text-red-500 hover:text-red-400 transition-colors border border-red-500/30 hover:border-red-400/50 px-2 py-0.5 rounded ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={`'${postTitle}' 글 삭제`}
      >
        {isDeleting ? '삭제 중...' : '삭제'} {/* 삭제 중 텍스트 변경 */}
      </button>
      {/* 간단한 오류 메시지 표시 (선택 사항) */}
      {error && <span className="text-xs text-red-600 ml-2">({error})</span>}
    </form>
  );
} 