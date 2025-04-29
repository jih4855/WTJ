import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// 환경 변수에서 서비스 계정 키 파일 경로 읽기
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

let app: App;

if (!getApps().length) {
  if (!serviceAccountPath) {
    // .env.local 파일 설정 및 개발 서버 재시작 필요 알림
    console.error('Firebase 초기화 오류: GOOGLE_APPLICATION_CREDENTIALS 환경 변수가 설정되지 않았습니다.');
    console.error('프로젝트 루트에 .env.local 파일을 생성하고 GOOGLE_APPLICATION_CREDENTIALS=\'/path/to/your/key.json\' 형식으로 서비스 계정 키 파일 경로를 지정해주세요.');
    console.error('환경 변수 설정 후에는 Next.js 개발 서버를 재시작해야 합니다.');
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS 환경 변수가 설정되지 않았습니다.');
  }

  try {
    // cert 함수는 파일 경로를 직접 받습니다.
    app = initializeApp({
      credential: cert(serviceAccountPath)
    });
    console.log('Firebase Admin SDK initialized successfully.'); // 초기화 성공 로그 추가
  } catch (error: any) { // 타입 명시 (any 또는 구체적인 타입)
    console.error('Firebase Admin SDK 초기화 실패:', error);
    // 오류 메시지에 경로 정보 포함
    throw new Error(`Firebase Admin SDK를 초기화할 수 없습니다. 서비스 계정 키 경로 ('${serviceAccountPath}') 또는 파일 내용을 확인하세요. 오류: ${error.message}`);
  }
} else {
  app = getApps()[0]; // 이미 초기화된 앱 가져오기
}

// Firestore 인스턴스 가져오기
const db = getFirestore(app);

// Firestore 인스턴스 export
export { db }; 