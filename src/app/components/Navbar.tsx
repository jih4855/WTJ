import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-neutral-950 text-neutral-100 border-b border-neutral-800 sticky top-0 z-10">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* 홈 링크 제거됨 */}
          <Link href="/" className="hover:text-neutral-300 transition-colors">
            내 블로그
          </Link>
          <Link href="/manage" className="hover:text-neutral-300 transition-colors">
            관리
          </Link>
          {/* 설정 링크 제거 */}
          {/* <Link href="/settings" className="hover:text-neutral-300 transition-colors">
            설정
          </Link> */}
        </div>
      </div>
    </nav>
  );
} 