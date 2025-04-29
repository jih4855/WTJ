'use client';

import { useState, useMemo } from 'react';
import type { Post } from '@/lib/db'; // Post 타입 가져오기

interface InteractivePostListProps {
  initialPosts: Post[];
  isDeleteMode?: boolean; // 삭제 모드 여부 prop 추가
  checkedPostIds?: Set<number>; // 체크된 게시글 ID Set prop 추가
  onCheckboxChange?: (postId: number, isChecked: boolean) => void; // 체크박스 변경 핸들러 prop 추가
}

export default function InteractivePostList({
  initialPosts,
  isDeleteMode = false, // 기본값 false
  checkedPostIds = new Set(), // 기본값 빈 Set
  onCheckboxChange = () => {},
}: InteractivePostListProps) {
  // initialPosts가 변경될 때만 posts 상태 업데이트 (선택적 최적화)
  const [posts, setPosts] = useState(initialPosts);
  useMemo(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);

  const handleTitleClick = (postId: number) => {
    setExpandedPostId(currentId => (currentId === postId ? null : postId));
  };

  return (
    <ul className="list-none p-0 space-y-6">
      {posts.map((post) => {
        const isExpanded = expandedPostId === post.id;
        const isChecked = checkedPostIds.has(post.id);

        return (
          <li key={post.id} className="pb-2">
            <div className="flex items-start mb-2">
              {isDeleteMode && (
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => onCheckboxChange(post.id, e.target.checked)}
                  className="mr-3 mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 bg-neutral-800 border-neutral-600 cursor-pointer"
                  aria-label={`'${post.title}' 선택`}
                />
              )}
              <button
                onClick={() => handleTitleClick(post.id)}
                className="bg-transparent border-none p-0 m-0 mr-4 text-lg font-semibold text-inherit text-left cursor-pointer flex-grow hover:text-neutral-300 transition-colors"
                aria-expanded={isExpanded}
                aria-controls={`post-content-${post.id}`}
              >
                {post.title}
              </button>
              <span className="text-xs text-neutral-500 whitespace-nowrap mt-1">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div
              id={`post-content-${post.id}`}
              className={`
                text-neutral-100 \n                text-sm \n                overflow-hidden \n                transition-all duration-300 ease-in-out \n                ${isDeleteMode ? 'ml-7' : 'ml-0'} \n                ${isExpanded ? 'max-h-none whitespace-pre-wrap py-2' : 'max-h-14 line-clamp-3'} \n              `}
            >
              {post.content}
            </div>
          </li>
        );
      })}
    </ul>
  );
} 