'use client';

import { useState, useEffect } from 'react';
import InteractivePostList from './InteractivePostList'; // 경로 수정 필요 시 확인 (@/app/components -> ./)
import type { Post } from '@/lib/db'; // 경로 확인
// 서버 액션들은 props로 받아올 것이므로 여기서는 import 제거 또는 주석 처리
// import { getPostsAction, deleteMultiplePosts, changePassword } from '@/app/actions';
// import { authenticateAdmin, createPost } from '@/app/posts/new/actions';

// 서버 컴포넌트로부터 받을 props 타입 정의
interface ManageClientProps {
  initialPosts: Post[]; // 초기 게시글 데이터
  initialError?: string | null; // 초기 로딩 에러 (선택적)
  // 서버 액션 함수들
  authenticateAdminAction: (password: string) => Promise<{ success: boolean; error?: string }>;
  getPostsAction: () => Promise<{ success: boolean; posts?: Post[]; error?: string }>;
  deleteMultiplePostsAction: (postIds: string[]) => Promise<
    { success: boolean; deletedCount: number; error?: undefined } |
    { success?: false; error: string; deletedCount?: undefined }
  >;
  changePasswordAction: (passwords: { currentPassword: string; newPassword: string }) => Promise<{ success: boolean; error?: string }>;
  createPostAction: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
}

export default function ManageClient({
  initialPosts,
  initialError = null,
  authenticateAdminAction,
  getPostsAction,
  deleteMultiplePostsAction,
  changePasswordAction,
  createPostAction,
}: ManageClientProps) {
  // --- 기존 manage/page.tsx의 상태 및 로직 대부분을 여기로 이동 ---

  // 인증 상태 추가
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // 기존 상태들 (초기값은 props 사용)
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false); // 로딩은 액션 호출 시 관리
  const [error, setError] = useState<string | null>(initialError); // 초기 에러 반영
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [checkedPostIds, setCheckedPostIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  // 비밀번호 변경 관련 상태 추가
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordError, setChangePasswordError] = useState('');
  const [changePasswordSuccess, setChangePasswordSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // 새 글 작성 관련 상태 추가
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostError, setNewPostError] = useState('');
  const [newPostSuccess, setNewPostSuccess] = useState('');
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  // 비밀번호 제출 핸들러 (props로 받은 액션 사용)
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);
    try {
      // props로 받은 authenticateAdminAction 사용
      const result = await authenticateAdminAction(password);
      if (result.success) {
        setIsAuthenticated(true);
      } else {
        setAuthError(result.error || '인증 실패');
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Authentication request failed:', err);
      setAuthError('인증 요청 중 오류 발생');
      setIsAuthenticated(false);
    } finally {
      setIsAuthenticating(false);
    }
  };

  // 인증 성공 시 게시글 로드 (초기 로드는 서버에서 했으므로, 새로고침 등 필요 시 loadPosts 호출)
  useEffect(() => {
    // 이 컴포넌트 마운트 시 다시 로드할 필요는 없음 (서버에서 이미 로드)
    // 필요하다면 특정 조건에서 loadPosts() 호출
  }, []);


  // 체크박스 상태 변경 핸들러
  const handleCheckboxChange = (postId: string, isChecked: boolean) => {
    setCheckedPostIds(prev => {
      const newSet = new Set(prev);
      if (isChecked) {
        newSet.add(postId);
      } else {
        newSet.delete(postId);
      }
      return newSet;
    });
  };

  // 삭제 모드 토글 핸들러
  const handleToggleDeleteMode = () => {
    setIsDeleteMode(prev => !prev);
    if (isDeleteMode) {
      setCheckedPostIds(new Set<string>());
    }
  };

  // 선택된 게시글 삭제 핸들러 (props로 받은 액션 사용)
  const handleDeleteSelected = async () => {
    if (checkedPostIds.size === 0) { /*...*/ return; }
    // 확인 메시지 개선
    if (!window.confirm(`${checkedPostIds.size}개의 게시글을 정말 삭제하시겠습니까?`)) { return; }

    setIsDeleting(true);
    setError(null);
    try {
      // props로 받은 deleteMultiplePostsAction 사용
      const result = await deleteMultiplePostsAction(Array.from(checkedPostIds));
      if (result.success) {
        alert(`${result.deletedCount}개의 게시글이 삭제되었습니다.`);
        setPosts(prevPosts => prevPosts.filter(post => !checkedPostIds.has(post.id)));
        setCheckedPostIds(new Set<string>());
        setIsDeleteMode(false);
      } else {
        setError(result.error || '삭제 실패');
        alert(`삭제 실패: ${result.error || '알 수 없는 오류'}`);
      }
    } catch (err) { 
        console.error('Failed to delete posts:', err);
        setError('게시글 삭제 중 오류 발생');
        alert('게시글 삭제 중 오류가 발생했습니다.');
    } finally { setIsDeleting(false); }
  };

  // 비밀번호 변경 폼 제출 핸들러 (props로 받은 액션 사용)
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordError('');
    setChangePasswordSuccess('');

    if (newPassword !== confirmPassword) { setChangePasswordError('새 비밀번호가 일치하지 않습니다.'); return; }
    if (newPassword.length < 4) { setChangePasswordError('새 비밀번호는 4자 이상이어야 합니다.'); return; }

    setIsChangingPassword(true);
    try {
      // props로 받은 changePasswordAction 사용
      const result = await changePasswordAction({ currentPassword, newPassword });
      if (result.success) {
        setChangePasswordSuccess('비밀번호가 성공적으로 변경되었습니다.');
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
        setShowPasswordForm(false);
        alert('비밀번호가 변경되었습니다.');
      } else {
        setChangePasswordError(result.error || '비밀번호 변경 실패');
      }
    } catch (err) { 
        console.error('Password change failed:', err);
        setChangePasswordError('비밀번호 변경 중 오류 발생');
    } finally { setIsChangingPassword(false); }
  };

  // 게시글 로드 함수 (props로 받은 액션 사용 - 필요시 호출)
  async function loadPosts() {
    setIsLoading(true);
    setError(null);
    setNewPostSuccess(''); setNewPostError('');
    try {
      // props로 받은 getPostsAction 사용
      const result = await getPostsAction();
      if (result.success && result.posts) {
        setPosts(result.posts);
      } else {
        setError(result.error || '게시글 로딩 실패');
      }
    } catch (err) { 
        console.error('Failed to load posts:', err);
        setError('게시글 로딩 중 오류 발생');
    } finally { setIsLoading(false); }
  }

  // 새 글 작성 핸들러 (props로 받은 액션 사용)
  const handleNewPostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewPostError(''); setNewPostSuccess('');
    setIsCreatingPost(true);

    const formData = new FormData();
    formData.append('title', newPostTitle);
    formData.append('content', newPostContent);

    try {
      // props로 받은 createPostAction 사용
      const result = await createPostAction(formData);
      if (result.success) {
        setNewPostSuccess('게시글이 성공적으로 작성되었습니다.');
        setNewPostTitle(''); setNewPostContent('');
        setShowNewPostForm(false);
        await loadPosts(); // 목록 새로고침
      } else {
        setNewPostError(result.error || '게시글 작성 실패');
      }
    } catch (err) { 
        console.error('Failed to create post:', err);
        setNewPostError('게시글 작성 중 오류 발생');
    } finally { setIsCreatingPost(false); }
  };

  // --- 인증되지 않았을 때의 JSX 렌더링 ---
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 pb-8 flex flex-col items-center justify-center h-[calc(100vh-112px)]">
        <h1 className="text-2xl font-medium mb-6">관리자 인증</h1>
        <form onSubmit={handlePasswordSubmit} className="w-full max-w-xs space-y-4">
          <div>
            <label htmlFor="password" className="block text-xs font-medium mb-1 text-neutral-400">비밀번호</label>
            <input
              type="password" id="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isAuthenticating}
              className={`w-full bg-transparent border border-neutral-700 rounded px-3 py-2 focus:outline-none focus:border-neutral-400 text-neutral-100 placeholder-neutral-600 transition-colors ${isAuthenticating ? 'opacity-50' : ''}`}
              placeholder="비밀번호 입력"
            />
          </div>
          {authError && <p className="text-red-500 text-sm">{authError}</p>}
          <button type="submit" disabled={isAuthenticating} className={`w-full border border-neutral-700 hover:border-neutral-400 hover:text-neutral-300 text-neutral-400 font-medium py-2 px-4 rounded transition-colors text-sm ${isAuthenticating ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {isAuthenticating ? '인증 중...' : '인증하기'}
          </button>
        </form>
      </div>
    );
  }

  // --- 인증된 후의 JSX 렌더링 ---
  return (
    // 원래 page.tsx에 있던 container 스타일 복원 시도 (py-8 추가)
    <div className="container mx-auto px-4 py-8">
      {/* 원래 제목 스타일 복원 시도 */}
      <h1 className="text-3xl font-semibold mb-8">관리</h1>

      {/* 기능 섹션들을 원래처럼 세로로 배치하고 그룹화 시도 */}
      <div className="space-y-6"> {/* 각 섹션 간 세로 간격 */}

        {/* 새 글 작성 섹션 */}
        <div>
          <button
            onClick={() => setShowNewPostForm(!showNewPostForm)}
            className="text-neutral-300 hover:text-neutral-100 transition-colors mb-2" // 버튼 스타일 조정
          >
            {showNewPostForm ? '새 글 작성 취소' : '새 글 작성'}
          </button>
          {showNewPostForm && (
            // 폼 스타일 복원 시도 (padding, background, border 등)
            <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">새 글 작성</h2>
              <form onSubmit={handleNewPostSubmit} className="space-y-4">
                <div>
                  <label htmlFor="newTitle" className="block text-xs font-medium mb-1 text-neutral-400">제목</label>
                  <input type="text" id="newTitle" value={newPostTitle} onChange={e => setNewPostTitle(e.target.value)} disabled={isCreatingPost} className="w-full bg-transparent border border-neutral-700 rounded px-3 py-2 focus:outline-none focus:border-neutral-400 text-neutral-100 placeholder-neutral-600 transition-colors" />
                </div>
                <div>
                  <label htmlFor="newContent" className="block text-xs font-medium mb-1 text-neutral-400">내용 (Markdown)</label>
                  <textarea id="newContent" value={newPostContent} onChange={e => setNewPostContent(e.target.value)} disabled={isCreatingPost} rows={10} className="w-full bg-transparent border border-neutral-700 rounded px-3 py-2 focus:outline-none focus:border-neutral-400 text-neutral-100 placeholder-neutral-600 transition-colors" />
                </div>
                {newPostError && <p className="text-red-500 text-sm">{newPostError}</p>}
                {newPostSuccess && <p className="text-green-500 text-sm">{newPostSuccess}</p>}
                <button type="submit" disabled={isCreatingPost} className={`w-full border border-neutral-700 hover:border-neutral-400 hover:text-neutral-300 text-neutral-400 font-medium py-2 px-4 rounded transition-colors text-sm ${isCreatingPost ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {isCreatingPost ? '작성 중...' : '작성 완료'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* 게시글 삭제 섹션 */}
        <div>
          <div className="flex items-center space-x-4 mb-2"> {/* 버튼 그룹 */}
            <button
              onClick={handleToggleDeleteMode}
              className="text-neutral-300 hover:text-neutral-100 transition-colors"
            >
              {isDeleteMode ? '게시글 삭제 (취소)' : '게시글 삭제'}
            </button>
            {isDeleteMode && checkedPostIds.size > 0 && ( // 삭제 버튼은 체크된게 있을 때만 표시
              <button
                onClick={handleDeleteSelected}
                disabled={isDeleting}
                className={`border border-red-700 hover:border-red-500 text-sm px-3 py-1 rounded transition-colors ${isDeleting ? 'opacity-50 cursor-not-allowed' : 'text-red-500 hover:text-red-400'}`}
              >
                {isDeleting ? '삭제 중...' : `선택 (${checkedPostIds.size}) 삭제` }
              </button>
            )}
          </div>
          {isDeleteMode && (
            // 삭제 모드 시 게시글 목록 표시 영역
            <div className="mt-4"> {/* 목록 위 간격 */}
               <h2 className="text-xl font-semibold mb-4 text-neutral-100">삭제할 게시글 선택</h2>
               {isLoading && <p className="text-center py-4 text-neutral-400">로딩 중...</p>}
               {error && !isLoading && <p className="text-center py-4 text-red-500">오류: {error}</p>}
               {!isLoading && !error && posts.length > 0 ? (
                  <InteractivePostList
                    initialPosts={posts} // 서버에서 받은 초기 posts
                    isDeleteMode={isDeleteMode}
                    checkedPostIds={checkedPostIds}
                    onCheckboxChange={handleCheckboxChange}
                  />
                ) : (
                  !isLoading && !error && <p className="text-neutral-400">게시글이 없습니다.</p>
                )}
            </div>
          )}
        </div>

        {/* 비밀번호 변경 섹션 */}
        <div>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="text-neutral-300 hover:text-neutral-100 transition-colors mb-2" // 버튼 스타일 조정
          >
            {showPasswordForm ? '비밀번호 변경 취소' : '비밀번호 변경'}
          </button>
          {showPasswordForm && (
             // 폼 스타일 복원 시도
            <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-lg max-w-md"> {/* 최대 너비 제한 */}
               <h2 className="text-xl font-semibold mb-4">비밀번호 변경</h2>
               <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                 <div>
                   <label htmlFor="currentPassword" className="block text-xs font-medium mb-1 text-neutral-400">현재 비밀번호</label>
                   <input type="password" id="currentPassword" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} disabled={isChangingPassword} className="w-full bg-transparent border border-neutral-700 rounded px-3 py-2 focus:outline-none focus:border-neutral-400 text-neutral-100 placeholder-neutral-600 transition-colors" />
                 </div>
                 <div>
                   <label htmlFor="newPassword" className="block text-xs font-medium mb-1 text-neutral-400">새 비밀번호</label>
                   <input type="password" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} disabled={isChangingPassword} className="w-full bg-transparent border border-neutral-700 rounded px-3 py-2 focus:outline-none focus:border-neutral-400 text-neutral-100 placeholder-neutral-600 transition-colors" />
                 </div>
                 <div>
                   <label htmlFor="confirmPassword" className="block text-xs font-medium mb-1 text-neutral-400">새 비밀번호 확인</label>
                   <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} disabled={isChangingPassword} className="w-full bg-transparent border border-neutral-700 rounded px-3 py-2 focus:outline-none focus:border-neutral-400 text-neutral-100 placeholder-neutral-600 transition-colors" />
                 </div>
                 {changePasswordError && <p className="text-red-500 text-sm">{changePasswordError}</p>}
                 {changePasswordSuccess && <p className="text-green-500 text-sm">{changePasswordSuccess}</p>}
                 <button type="submit" disabled={isChangingPassword} className={`w-full border border-neutral-700 hover:border-neutral-400 hover:text-neutral-300 text-neutral-400 font-medium py-2 px-4 rounded transition-colors text-sm ${isChangingPassword ? 'opacity-50 cursor-not-allowed' : ''}`}>
                   {isChangingPassword ? '변경 중...' : '변경하기'}
                 </button>
               </form>
             </div>
          )}
        </div>

        {/* 삭제 모드가 아닐 때의 일반 게시글 목록 */}
        {!isDeleteMode && (
          <div className="mt-8"> {/* 위 섹션들과의 간격 */}
            <h2 className="text-xl font-semibold mb-4">게시글 목록 (일반)</h2>
            {isLoading && <p className="text-center py-4 text-neutral-400">로딩 중...</p>}
            {error && !isLoading && <p className="text-center py-4 text-red-500">오류: {error}</p>}
            {!isLoading && !error && posts.length > 0 ? (
               <InteractivePostList
                 initialPosts={posts} // 서버에서 받은 초기 posts
                 isDeleteMode={false} // 일반 모드
                 // checkedPostIds, onCheckboxChange 불필요
               />
             ) : (
               !isLoading && !error && <p className="text-neutral-400">게시글이 없습니다.</p>
             )}
          </div>
        )}
      </div> {/* End of space-y-6 div */}
    </div> // End of container div
  );

} 