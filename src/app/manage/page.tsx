'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import InteractivePostList from '@/app/components/InteractivePostList';
import type { Post } from '@/lib/db';
import { getPostsAction, deleteMultiplePosts, changePassword } from '@/app/actions';
import { authenticateAdmin, createPost } from '@/app/posts/new/actions';

export default function ManagePage() {
  // 인증 상태 추가
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // 기존 상태들
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false); // 초기 로딩은 인증 후 시작
  const [error, setError] = useState<string | null>(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [checkedPostIds, setCheckedPostIds] = useState<Set<number>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

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

  // 비밀번호 제출 핸들러
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);
    try {
      const result = await authenticateAdmin(password);
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

  // 인증 성공 시 게시글 로드
  useEffect(() => {
    if (isAuthenticated) {
      loadPosts();
    }
  }, [isAuthenticated]);

  // 체크박스 상태 변경 핸들러
  const handleCheckboxChange = (postId: number, isChecked: boolean) => {
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
    // 삭제 모드 종료 시 체크박스 초기화
    if (isDeleteMode) {
      setCheckedPostIds(new Set());
    }
  };

  // 선택된 게시글 삭제 핸들러
  const handleDeleteSelected = async () => {
    if (checkedPostIds.size === 0) {
      alert('삭제할 게시글을 선택해주세요.');
      return;
    }
    if (!window.confirm(`${checkedPostIds.size}개의 게시글을 정말 삭제하시겠습니까?`)) {
      return;
    }

    setIsDeleting(true);
    setError(null);
    try {
      const result = await deleteMultiplePosts(Array.from(checkedPostIds));
      if (result.success) {
        alert(`${result.deletedCount}개의 게시글이 삭제되었습니다.`);
        // 상태 업데이트: 삭제된 게시글 반영
        setPosts(prevPosts => prevPosts.filter(post => !checkedPostIds.has(post.id)));
        setCheckedPostIds(new Set()); // 체크박스 초기화
        setIsDeleteMode(false); // 삭제 모드 종료
      } else {
        setError(result.error || '삭제 실패');
        alert(`삭제 실패: ${result.error || '알 수 없는 오류'}`);
      }
    } catch (err) {
      console.error('Failed to delete posts:', err);
      setError('게시글 삭제 중 오류 발생');
      alert('게시글 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  // 비밀번호 변경 폼 제출 핸들러
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordError('');
    setChangePasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setChangePasswordError('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (newPassword.length < 4) {
      setChangePasswordError('새 비밀번호는 4자 이상이어야 합니다.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const result = await changePassword({ currentPassword, newPassword });
      if (result.success) {
        setChangePasswordSuccess('비밀번호가 성공적으로 변경되었습니다.');
        // 폼 초기화 및 닫기
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordForm(false); 
        // **중요:** 비밀번호 변경 후에는 인증 로직이 bcrypt를 사용하도록 다시 수정해야 함!
        // 사용자가 다음에 로그인할 때는 해싱된 비밀번호로 로그인해야 함.
        alert('비밀번호가 변경되었습니다. 다음에 로그인 시 새 비밀번호를 사용하세요.');
      } else {
        setChangePasswordError(result.error || '비밀번호 변경 실패');
      }
    } catch (err) {
      console.error('Password change failed:', err);
      setChangePasswordError('비밀번호 변경 중 오류 발생');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // 게시글 로드 함수
  async function loadPosts() {
    setIsLoading(true);
    setError(null);
    setNewPostSuccess(''); // 새글 작성 성공 메시지 초기화
    setNewPostError(''); // 새글 작성 에러 메시지 초기화
    try {
      const result = await getPostsAction();
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

  // 새 글 작성 핸들러
  const handleNewPostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewPostError('');
    setNewPostSuccess('');
    setIsCreatingPost(true);

    const formData = new FormData();
    formData.append('title', newPostTitle);
    formData.append('content', newPostContent);

    try {
      const result = await createPost(formData);
      if (result.success) {
        setNewPostSuccess('게시글이 성공적으로 작성되었습니다.');
        setNewPostTitle(''); // 폼 초기화
        setNewPostContent('');
        setShowNewPostForm(false); // 폼 숨기기
        await loadPosts(); // 게시글 목록 새로고침
      } else {
        setNewPostError(result.error || '게시글 작성 실패');
      }
    } catch (err) {
      console.error('Failed to create post:', err);
      setNewPostError('게시글 작성 중 오류 발생');
    } finally {
      setIsCreatingPost(false);
    }
  };

  // 인증되지 않았을 때 렌더링
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-100">
        <Navbar />
        <div className="container mx-auto px-4 pb-8 flex flex-col items-center justify-center h-[calc(100vh-112px)]">
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
            {authError && <p className="text-red-500 text-sm">{authError}</p>}
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

  // 인증 완료 후 관리 페이지 렌더링
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-8">관리</h1>

        <div className="mb-8">
          <ul className="space-y-3 text-neutral-300">
            <li>
              <button
                onClick={() => setShowNewPostForm(!showNewPostForm)}
                className="hover:text-neutral-100 transition-colors"
              >
                {showNewPostForm ? '새 글 작성 숨기기' : '새 글 작성'}
              </button>
              {showNewPostForm && (
                <form onSubmit={handleNewPostSubmit} className="mt-4 p-6 bg-neutral-900 border border-neutral-800 rounded-lg space-y-4 max-w-2xl">
                  <h2 className="text-xl font-semibold mb-4">새 글 작성</h2>
                  <div>
                    <label htmlFor="newPostTitle" className="block text-xs font-medium mb-1 text-neutral-400">제목</label>
                    <input
                      type="text"
                      id="newPostTitle"
                      value={newPostTitle}
                      onChange={e => setNewPostTitle(e.target.value)}
                      required
                      className="w-full bg-transparent border border-neutral-700 rounded px-3 py-2 focus:outline-none focus:border-neutral-400 text-neutral-100 placeholder-neutral-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="newPostContent" className="block text-xs font-medium mb-1 text-neutral-400">내용</label>
                    <textarea
                      id="newPostContent"
                      value={newPostContent}
                      onChange={e => setNewPostContent(e.target.value)}
                      required
                      rows={10}
                      className="w-full bg-transparent border border-neutral-700 rounded px-3 py-2 focus:outline-none focus:border-neutral-400 text-neutral-100 placeholder-neutral-600 transition-colors"
                    />
                  </div>
                  {newPostError && <p className="text-red-500 text-sm">{newPostError}</p>}
                  {newPostSuccess && <p className="text-green-500 text-sm">{newPostSuccess}</p>}
                  <button
                    type="submit"
                    disabled={isCreatingPost}
                    className={`w-full border border-neutral-700 hover:border-neutral-400 hover:text-neutral-300 text-neutral-400 font-medium py-2 px-4 rounded transition-colors text-sm ${isCreatingPost ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isCreatingPost ? '작성 중...' : '게시글 작성하기'}
                  </button>
                </form>
              )}
            </li>
            <li>
              <div className="flex items-center space-x-4 mb-2">
                <button
                  onClick={handleToggleDeleteMode}
                  className="hover:text-neutral-100 transition-colors"
                >
                  {isDeleteMode ? '게시글 삭제 (취소)' : '게시글 삭제'}
                </button>
              </div>
              {isDeleteMode && (
                <div className="mt-2">
                  <h2 className="text-xl font-semibold mb-4 text-neutral-100">삭제할 게시글 선택</h2>
                  {isLoading && <p className="text-center py-8 text-neutral-400">게시글 목록을 불러오는 중...</p>}
                  {error && <p className="text-center py-8 text-red-500">오류: {error}</p>}
                  {!isLoading && !error && (
                    posts.length > 0 ? (
                      <InteractivePostList
                        initialPosts={posts}
                        isDeleteMode={isDeleteMode}
                        checkedPostIds={checkedPostIds}
                        onCheckboxChange={handleCheckboxChange}
                      />
                    ) : (
                      <p className="text-center py-8 text-neutral-400">표시할 게시글이 없습니다.</p>
                    )
                  )}
                  {checkedPostIds.size > 0 && (
                    <div className="mt-4">
                      <button
                        onClick={handleDeleteSelected}
                        disabled={isDeleting}
                        className={`border border-red-700 hover:border-red-500 hover:text-red-400 text-red-500 font-medium py-2 px-4 rounded transition-colors text-sm ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isDeleting ? '삭제 중...' : `${checkedPostIds.size}개 선택 삭제`}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </li>
            <li>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="hover:text-neutral-100 transition-colors"
              >
                {showPasswordForm ? '비밀번호 변경 숨기기' : '비밀번호 변경'}
              </button>
              {showPasswordForm && (
                <form onSubmit={handleChangePasswordSubmit} className="mt-4 p-6 bg-neutral-900 border border-neutral-800 rounded-lg space-y-4 max-w-md">
                  <h2 className="text-xl font-semibold mb-4">비밀번호 변경</h2>
                  <div>
                    <label htmlFor="currentPassword" className="block text-xs font-medium mb-1 text-neutral-400">현재 비밀번호</label>
                    <input
                      type="password"
                      id="currentPassword"
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      required
                      className="w-full bg-transparent border border-neutral-700 rounded px-3 py-2 focus:outline-none focus:border-neutral-400 text-neutral-100 placeholder-neutral-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-xs font-medium mb-1 text-neutral-400">새 비밀번호</label>
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                      className="w-full bg-transparent border border-neutral-700 rounded px-3 py-2 focus:outline-none focus:border-neutral-400 text-neutral-100 placeholder-neutral-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-xs font-medium mb-1 text-neutral-400">새 비밀번호 확인</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                      className="w-full bg-transparent border border-neutral-700 rounded px-3 py-2 focus:outline-none focus:border-neutral-400 text-neutral-100 placeholder-neutral-600 transition-colors"
                    />
                  </div>
                  {changePasswordError && <p className="text-red-500 text-sm">{changePasswordError}</p>}
                  {changePasswordSuccess && <p className="text-green-500 text-sm">{changePasswordSuccess}</p>}
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className={`w-full border border-neutral-700 hover:border-neutral-400 hover:text-neutral-300 text-neutral-400 font-medium py-2 px-4 rounded transition-colors text-sm ${isChangingPassword ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isChangingPassword ? '변경 중...' : '비밀번호 변경하기'}
                  </button>
                </form>
              )}
            </li>
          </ul>
        </div>

      </div>
    </main>
  );
} 