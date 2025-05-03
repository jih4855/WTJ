import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let app: App;

// Google Cloud Function 환경인지 확인 (더 안정적인 방법)
const isProduction = !!process.env.FUNCTION_TARGET || process.env.NODE_ENV === 'production';

if (!getApps().length) {
  if (isProduction) {
    // 배포 환경에서는 기본 인증 정보 사용
    try {
      app = initializeApp();
      console.log('Firebase Admin SDK initialized using default credentials (production).');
    } catch (error: unknown) {
      console.error('Firebase Admin SDK 초기화 실패 (production default): ', error);
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Firebase Admin SDK 초기화 실패 (production default): ${message}`);
    }
  } else {
    // 로컬 개발 환경
    const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!serviceAccountPath) {
      console.error('Firebase 초기화 오류: GOOGLE_APPLICATION_CREDENTIALS 환경 변수가 로컬 개발 환경에 설정되지 않았습니다.');
      console.error("프로젝트 루트에 .env.local 파일을 생성하고 GOOGLE_APPLICATION_CREDENTIALS='/path/to/your/key.json' 형식으로 서비스 계정 키 파일 경로를 지정해주세요.");
      throw new Error('GOOGLE_APPLICATION_CREDENTIALS 환경 변수가 설정되지 않았습니다.');
    }
    try {
      // 로컬에서는 서비스 계정 키 파일 경로 사용
      app = initializeApp({
        credential: cert(serviceAccountPath)
      });
      console.log('Firebase Admin SDK initialized using service account key (local).');
    } catch (error: unknown) {
      console.error('Firebase Admin SDK 초기화 실패 (local): ', error);
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Firebase Admin SDK를 초기화할 수 없습니다. 서비스 계정 키 경로 ('${serviceAccountPath}') 또는 파일 내용을 확인하세요. 오류: ${message}`);
    }
  }
} else {
  app = getApps()[0]; // 이미 초기화된 앱 가져오기
}

// Firestore 인스턴스 가져오기
const db = getFirestore(app);

// Firestore 인스턴스 export
export { db }; 