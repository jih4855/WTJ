import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcrypt';

// 데이터베이스 파일 경로 설정 (프로젝트 루트에 blog.db 파일 생성)
const dbPath = path.resolve(process.cwd(), 'blog.db');

// 데이터베이스 인스턴스 생성 (없으면 파일 생성)
const db = new Database(dbPath);

// 애플리케이션 시작 시 테이블이 없으면 생성
const createPostsTableQuery = `
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;

db.exec(createPostsTableQuery);

// settings 테이블 생성 (비밀번호 등 설정 저장)
const createSettingsTableQuery = `
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`;
db.exec(createSettingsTableQuery);

// 초기 관리자 비밀번호 설정 (딱 한 번만 실행됨)
function initializeAdminPassword() {
  const stmt = db.prepare('SELECT value FROM settings WHERE key = ?');
  const existingPassword = stmt.get('admin_password');

  if (!existingPassword) {
    const initialPassword = '0000'; // 초기 비밀번호를 '0000'으로 변경
    // bcrypt 해싱 제거
    // const saltRounds = 10; 
    // const hashedPassword = await bcrypt.hash(initialPassword, saltRounds);

    const insertStmt = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
    // 해싱되지 않은 '0000'을 그대로 저장
    insertStmt.run('admin_password', initialPassword);
    console.log('Initial admin password set to 0000.');
  } else {
    console.log('Admin password already set.');
  }
}

// 동기 함수 직접 호출 (async/await 제거)
initializeAdminPassword(); 
console.log('SQLite DB initialized and tables checked/created.');

// 포스트 타입 정의 (공유를 위해 여기에 둘 수 있음)
export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

// ID로 특정 포스트 가져오기 함수
export function getPostById(id: number): Post | null {
  try {
    const stmt = db.prepare('SELECT id, title, content, createdAt FROM posts WHERE id = ?');
    const post = stmt.get(id) as Post | undefined;
    return post || null;
  } catch (error) {
    console.error(`Failed to fetch post with id ${id}:`, error);
    return null;
  }
}

export default db; 