// 포스트 타입 정의 (공유를 위해 여기에 둘 수 있음)
export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string; // 또는 Timestamp 타입 등 실제 타입에 맞게 조정 필요
}

// 나머지 SQLite 관련 코드는 모두 삭제됨 