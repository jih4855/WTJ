import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth"; // 필요한 경우 주석 해제
// import { getStorage } from "firebase/storage"; // 필요한 경우 주석 해제
// import { getAnalytics } from "firebase/analytics"; // 필요한 경우 주석 해제

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID // Google Analytics 사용 시
};

// Firebase 앱 초기화 (이미 초기화되었으면 기존 앱 가져오기)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firestore 인스턴스 가져오기
const db = getFirestore(app);

// 다른 Firebase 서비스 필요 시 주석 해제하고 export
// const auth = getAuth(app);
// const storage = getStorage(app);
// let analytics;
// if (typeof window !== 'undefined') { // 브라우저 환경에서만 Analytics 초기화
//   analytics = getAnalytics(app);
// }

// 필요한 서비스 export
export { app, db };
// export { app, db, auth, storage, analytics }; // 필요에 따라 수정 