'use server'; // 이 파일의 함수들은 서버에서만 실행됨을 명시

// Firebase db 객체 및 Firestore FieldValue 임포트
import { db } from '@/lib/firebase'; // Firebase 초기화 파일 경로
import { FieldValue } from 'firebase-admin/firestore'; // FieldValue 임포트 (serverTimestamp용)
import { revalidatePath } from 'next/cache'; // 캐시 무효화를 위한 함수
import bcrypt from 'bcrypt'; // bcrypt 임포트 확인

// Server Action: 새로운 게시글 생성
export async function createPost(formData: FormData) {
  // FormData에서 필요한 데이터 추출 (password 제거)
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  // 입력 유효성 검사
  if (!title || !content || title.trim() === '' || content.trim() === '') {
    return { success: false, error: '제목과 내용은 필수 입력 항목입니다.' };
  }

  try {
    // Firestore 'posts' 컬렉션에 새 문서 추가 (db.collection().add() 사용)
    const docRef = await db.collection('posts').add({
      title: title,
      content: content,
      createdAt: FieldValue.serverTimestamp() // FieldValue 사용
    });

    // 문서 추가 성공 확인 (add는 성공 시 DocumentReference 반환)
    if (docRef.id) {
      revalidatePath('/posts');
      revalidatePath('/manage');
      return { success: true };
    } else {
      // Firestore 에러는 보통 catch 블록에서 처리됨
      return { success: false, error: '글을 데이터베이스에 저장하지 못했습니다.' };
    }

  } catch (error) {
    console.error('Error creating post in Firestore:', error);
    return { success: false, error: '게시글 생성 중 오류가 발생했습니다.' };
  }
}

// 관리자 인증 함수
export async function authenticateAdmin(password: string): Promise<{ success: boolean; error?: string }> {
  let storedValue: string | undefined;
  try {
    // Firestore 'settings' 컬렉션에서 'admin_password' 문서 가져오기 (db.doc().get() 사용)
    const docRef = db.doc('settings/admin_password'); // 경로 직접 지정
    const docSnap = await docRef.get(); // get() 메서드 사용

    if (docSnap.exists) { // exists는 속성(property)
      // 문서 데이터에서 'value' 필드 값(해시된 비밀번호) 가져오기
      storedValue = docSnap.data()?.value; // Optional chaining 사용
    } else {
      // Firestore에 해당 문서가 없는 경우
      console.error("Admin password document ('settings/admin_password') not found in Firestore.");
      return { success: false, error: '서버 설정 오류. 비밀번호가 초기화되지 않았습니다.' };
    }
  } catch (dbError) {
    console.error('Error fetching admin password from Firestore:', dbError);
    return { success: false, error: '서버 설정 오류.' };
  }

  // storedValue가 없는 경우 (문서는 존재하지만 value 필드가 없는 경우 등)
  if (!storedValue) {
    console.error('Admin password value not found in the document.');
    return { success: false, error: '서버 설정 오류. 비밀번호 데이터가 누락되었습니다.' };
  }

  try {
    // 입력된 비밀번호와 Firestore에 저장된 해시값 비교
    const passwordMatch = await bcrypt.compare(password, storedValue);

    if (passwordMatch) {
      return { success: true }; // 인증 성공
    } else {
      return { success: false, error: '비밀번호가 일치하지 않습니다.' }; // 비밀번호 불일치
    }
  } catch (compareError) {
    console.error('Error comparing password hash:', compareError);
    return { success: false, error: '인증 중 오류가 발생했습니다.' };
  }
} 