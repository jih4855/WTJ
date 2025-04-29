'use server'; // 이 파일의 함수들은 서버에서만 실행됨을 명시

import db from '@/lib/db'; // db 객체 임포트 경로 수정
// import { posts } from '@/lib/schema'; // 스키마 임포트 제거
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

  // 관리자 인증 로직은 여기서 제거되었습니다.

  try {
    // 데이터베이스에 게시글 삽입 (better-sqlite3 사용)
    const stmt = db.prepare('INSERT INTO posts (title, content, createdAt) VALUES (?, ?, ?)');
    const info = stmt.run(title, content, new Date().toISOString()); // createdAt 추가

    if (info.changes > 0) {
      // 캐시 무효화
      revalidatePath('/posts');
      revalidatePath('/manage');
      // lastInsertRowid 대신 success만 반환하도록 수정
      return { success: true }; 
    } else {
      return { success: false, error: '글을 데이터베이스에 저장하지 못했습니다.' };
    }

  } catch (error) {
    console.error('Error creating post:', error);
    return { success: false, error: '게시글 생성 중 오류가 발생했습니다.' };
  }
}

// 관리자 인증 함수
export async function authenticateAdmin(password: string): Promise<{ success: boolean; error?: string }> {
  // const storedPasswordHash = process.env.ADMIN_PASSWORD_HASH; // 환경 변수 사용 안 함
  // const plainPassword = process.env.ADMIN_PASSWORD; // 환경 변수 사용 안 함

  // settings 테이블에서 저장된 비밀번호 (해시값) 가져오기
  let storedValue: string | undefined;
  try {
    const stmt = db.prepare('SELECT value FROM settings WHERE key = ?');
    const setting = stmt.get('admin_password') as { value: string } | undefined;
    if (setting) {
      storedValue = setting.value;
    }
  } catch (dbError) {
    console.error('Error fetching admin password from DB:', dbError);
    return { success: false, error: 'Server configuration error.' };
  }

  if (!storedValue) {
    console.error('Admin password not found in settings table.');
    return { success: false, error: 'Server configuration error. Password not initialized.' }; 
  }

  // 비밀번호 비교: 입력된 비밀번호와 DB에 저장된 해시값을 bcrypt.compare로 비교
  try {
    const passwordMatch = await bcrypt.compare(password, storedValue);
    
    if (passwordMatch) {
      return { success: true };
    } else {
      return { success: false, error: 'Incorrect password.' }; // 비밀번호 불일치
    }
  } catch (compareError) {
    console.error('Error comparing password hash:', compareError);
    // bcrypt.compare 자체에서 오류 발생 시
    return { success: false, error: 'Authentication error during comparison.' }; 
  }
} 