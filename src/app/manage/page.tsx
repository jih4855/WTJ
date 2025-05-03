import Navbar from '@/app/components/Navbar';
import ManageClient from '@/app/components/ManageClient';
import type { Post } from '@/lib/db';
import { getPostsAction, deleteMultiplePosts, changePassword } from '@/app/actions';
import { authenticateAdmin, createPost } from '@/app/posts/new/actions';

export default async function ManagePage() {
  let initialPosts: Post[] = [];
  let initialError: string | null = null;
  try {
    const result = await getPostsAction();
    if (result.success) {
      initialPosts = result.posts as Post[];
    } else {
      initialError = result.error || '게시글 초기 로딩 실패';
      console.error('Initial post load failed (server):', initialError);
    }
  } catch (err) {
    console.error('Initial post load failed (server exception):', err);
    initialError = '게시글 초기 로딩 중 오류 발생';
  }

  const clientProps = {
    initialPosts,
    initialError,
    authenticateAdminAction: authenticateAdmin,
    getPostsAction: getPostsAction,
    deleteMultiplePostsAction: deleteMultiplePosts,
    changePasswordAction: changePassword,
    createPostAction: createPost,
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />
      <ManageClient {...clientProps} />
    </main>
  );
} 