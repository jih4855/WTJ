'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';

// 글 삭제 Server Action
export async function deletePost(formData: FormData) {
  const postId = formData.get('postId');

  // postId 유효성 검사 (숫자인지, 존재하는지 등)
  if (!postId || typeof postId !== 'string') {
    return { error: '유효하지 않은 포스트 ID입니다.' };
  }

  const id = parseInt(postId, 10);
  if (isNaN(id)) {
    return { error: '포스트 ID는 숫자여야 합니다.' };
  }

  try {
    const stmt = db.prepare('DELETE FROM posts WHERE id = ?');
    const info = stmt.run(id);

    if (info.changes > 0) {
      revalidatePath('/'); // 홈 페이지 캐시 무효화
      return { success: true };
    } else {
      // 해당 ID의 포스트가 없을 수도 있음
      return { error: '삭제할 포스트를 찾지 못했거나 이미 삭제되었습니다.' };
    }
  } catch (error) {
    console.error("Failed to delete post:", error);
    return { error: '글 삭제 중 데이터베이스 오류가 발생했습니다.' };
  }
}

// 모든 게시글 목록을 가져오는 Server Action
export async function getPostsAction() {
  try {
    const stmt = db.prepare('SELECT id, title, content, createdAt FROM posts ORDER BY createdAt DESC');
    // Post 타입 임포트 필요 (만약 db.ts에 정의되어 있다면 거기서 가져오기)
    // import type { Post } from '@/lib/db';
    // 이 파일 상단에 임포트 추가 필요
    const posts = stmt.all() as any[]; // 타입을 any로 우선 처리, 실제 Post 타입 사용 권장
    return { success: true, posts };
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return { success: false, error: '게시글 목록을 가져오는 중 오류가 발생했습니다.', posts: [] };
  }
}

// 여러 게시글을 삭제하는 Server Action
export async function deleteMultiplePosts(postIds: number[]) {
  if (!postIds || postIds.length === 0) {
    return { error: '삭제할 게시글 ID가 제공되지 않았습니다.' };
  }

  // 모든 ID가 유효한 숫자인지 확인
  if (postIds.some(id => typeof id !== 'number' || isNaN(id))) {
    return { error: '유효하지 않은 게시글 ID가 포함되어 있습니다.' };
  }

  // SQLite는 배열 파라미터를 직접 지원하지 않으므로 IN (?, ?, ...) 형태로 만들어야 함
  const placeholders = postIds.map(() => '?').join(', ');
  const sql = `DELETE FROM posts WHERE id IN (${placeholders})`;

  try {
    const stmt = db.prepare(sql);
    const info = stmt.run(...postIds); // 배열 요소를 인자로 전달

    if (info.changes > 0) {
      revalidatePath('/'); // 홈 페이지 캐시 무효화
      revalidatePath('/manage'); // 관리 페이지 캐시 무효화
      return { success: true, deletedCount: info.changes };
    } else {
      return { error: '삭제할 포스트를 찾지 못했거나 이미 삭제되었습니다.', deletedCount: 0 };
    }
  } catch (error) {
    console.error("Failed to delete multiple posts:", error);
    return { error: '글 삭제 중 데이터베이스 오류가 발생했습니다.' };
  }
}

// 비밀번호 변경 Server Action
interface ChangePasswordArgs {
  currentPassword?: string;
  newPassword?: string;
}
export async function changePassword({
  currentPassword,
  newPassword,
}: ChangePasswordArgs): Promise<{ success: boolean; error?: string }> {
  if (!currentPassword || !newPassword) {
    return { success: false, error: '현재 비밀번호와 새 비밀번호를 모두 입력해주세요.' };
  }

  try {
    // 1. 현재 비밀번호 확인 (DB 값과 직접 비교)
    const stmt = db.prepare('SELECT value FROM settings WHERE key = ?');
    const setting = stmt.get('admin_password') as { value: string } | undefined;

    if (!setting || !setting.value) {
      return { success: false, error: '관리자 비밀번호 설정을 찾을 수 없습니다.' };
    }

    const storedPassword = setting.value;

    // 현재 비밀번호가 DB 값과 일치하는지 확인 (bcrypt 비교 제거)
    if (currentPassword !== storedPassword) {
      // 초기 '0000' 상태이거나, 이미 해싱된 비밀번호가 틀린 경우
      return { success: false, error: '현재 비밀번호가 일치하지 않습니다.' };
    }

    // 2. 새 비밀번호 유효성 검사 및 해싱
    if (newPassword.length < 4) {
      return { success: false, error: '새 비밀번호는 4자 이상이어야 합니다.' };
    }
    const saltRounds = 10;
    const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // 3. 데이터베이스 업데이트 (새 해시된 비밀번호 저장)
    const updateStmt = db.prepare('UPDATE settings SET value = ? WHERE key = ?');
    const info = updateStmt.run(newHashedPassword, 'admin_password');

    if (info.changes > 0) {
      console.log('Admin password updated successfully.');
      return { success: true };
    } else {
      return { success: false, error: '데이터베이스 업데이트에 실패했습니다.' };
    }

  } catch (error) {
    console.error("Password change error:", error);
    return { success: false, error: '비밀번호 변경 중 오류가 발생했습니다.' };
  }
} 