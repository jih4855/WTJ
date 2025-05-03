'use server';

// import db from '@/lib/db'; // SQLite db 임포트 제거
import { db } from '@/lib/firebase'; // Firestore db 임포트 추가
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';
import type { Post } from '@/lib/db'; // Post 타입 임포트 추가

// 글 삭제 Server Action (Firestore 버전으로 수정 필요할 수 있음 - 여기서는 일단 유지)
export async function deletePost(formData: FormData) {
  const postId = formData.get('postId');

  // postId 유효성 검사 (숫자인지, 존재하는지 등)
  if (!postId || typeof postId !== 'string') {
    return { error: '유효하지 않은 포스트 ID입니다.' };
  }

  // Firestore ID는 보통 문자열이지만, 만약 숫자 ID를 사용했다면 파싱
  // const id = parseInt(postId, 10);
  // if (isNaN(id)) {
  //   return { error: '포스트 ID는 숫자여야 합니다.' };
  // }

  try {
    // Firestore 문서 삭제
    await db.collection('posts').doc(postId).delete();
    console.log(`Post with ID ${postId} deleted successfully from Firestore.`);

    revalidatePath('/'); // 홈 페이지 캐시 무효화
    revalidatePath('/manage'); // 관리 페이지 캐시 무효화 추가
    return { success: true };

  } catch (error) {
    console.error("Failed to delete post from Firestore:", error);
    // Firestore 오류는 더 구체적인 정보를 제공할 수 있음
    return { error: '글 삭제 중 오류가 발생했습니다.' };
  }
}

// 모든 게시글 목록을 가져오는 Server Action (Firestore 버전)
export async function getPostsAction() {
  try {
    const postsSnapshot = await db.collection('posts').orderBy('createdAt', 'desc').get();
    const posts = postsSnapshot.docs.map(doc => ({
      id: doc.id, // Firestore 문서 ID 사용
      ...doc.data(),
      // Firestore Timestamp를 Date 객체나 문자열로 변환 (필요시)
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toISOString() : doc.data().createdAt,
    })) as Post[]; // 타입을 Post[]로 명시

    return { success: true, posts };
  } catch (error) {
    console.error("Failed to fetch posts from Firestore:", error);
    return { success: false, error: '게시글 목록을 가져오는 중 오류가 발생했습니다.', posts: [] };
  }
}

// 여러 게시글을 삭제하는 Server Action (Firestore 버전)
export async function deleteMultiplePosts(postIds: string[]) { // ID 타입을 string으로 변경
  if (!postIds || postIds.length === 0) {
    return { error: '삭제할 게시글 ID가 제공되지 않았습니다.' };
  }

  // Firestore Batch Write 사용
  const batch = db.batch();
  postIds.forEach(id => {
    if (typeof id !== 'string' || id.trim() === '') {
       // 유효하지 않은 ID는 건너뛰거나 오류 처리
       console.warn(`Invalid post ID skipped: ${id}`);
       return; // 또는 여기서 오류 반환
    }
    const docRef = db.collection('posts').doc(id);
    batch.delete(docRef);
  });

  try {
    await batch.commit(); // 배치 작업 실행
    const deletedCount = postIds.length; // 성공적으로 삭제 요청한 수 (실제 삭제된 수는 다를 수 있음)

    revalidatePath('/');
    revalidatePath('/manage');
    return { success: true, deletedCount };
  } catch (error) {
    console.error("Failed to delete multiple posts from Firestore:", error);
    return { error: '여러 글 삭제 중 오류가 발생했습니다.' };
  }
}

// 비밀번호 변경 Server Action (Firestore 버전)
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
    // 1. 현재 비밀번호 확인 (Firestore 사용)
    const docRef = db.doc('settings/admin_password');
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return { success: false, error: '관리자 비밀번호 설정을 찾을 수 없습니다.' };
    }

    const storedHash = docSnap.data()?.value;
    if (!storedHash) {
      return { success: false, error: '저장된 비밀번호 데이터를 찾을 수 없습니다.' };
    }

    // bcrypt.compare로 현재 비밀번호와 저장된 해시 비교
    const isMatch = await bcrypt.compare(currentPassword, storedHash);
    if (!isMatch) {
      return { success: false, error: '현재 비밀번호가 일치하지 않습니다.' };
    }

    // 2. 새 비밀번호 유효성 검사 및 해싱
    if (newPassword.length < 4) {
      return { success: false, error: '새 비밀번호는 4자 이상이어야 합니다.' };
    }
    const saltRounds = 10;
    const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // 3. Firestore 업데이트 (새 해시된 비밀번호 저장)
    await docRef.update({ value: newHashedPassword });

    console.log('Admin password updated successfully in Firestore.');
    return { success: true };

  } catch (error) {
    console.error("Password change error in Firestore:", error);
    return { success: false, error: '비밀번호 변경 중 오류가 발생했습니다.' };
  }
} 