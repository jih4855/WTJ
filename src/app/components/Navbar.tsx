import Link from 'next/link';
// ClientVisitorCounter import
import ClientVisitorCounter from './ClientVisitorCounter';
// lucide-react import 제거
// import { Cog } from 'lucide-react';

// 제공된 SVG 코드를 기반으로 아이콘 컴포넌트 정의
const ManageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> {/* 크기 h-5 w-5, stroke="currentColor" */}
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} // strokeWidth는 원본 SVG 참고 (2 사용)
      d="M9.75 3a1 1 0 00-.97.757L8.4 5.45a6.48 6.48 0 00-1.52.88l-1.63-.65a1 1 0 00-1.21.46L2.34 8.19a1 1 0 00.22 1.2l1.3 1.3c-.05.4-.05.8 0 1.2l-1.3 1.3a1 1 0 00-.22 1.2l1.7 2.03a1 1 0 001.21.46l1.63-.65c.47.36.98.65 1.52.88l.38 1.69a1 1 0 00.97.76h4.5a1 1 0 00.97-.76l.38-1.69a6.48 6.48 0 001.52-.88l1.63.65a1 1 0 001.21-.46l1.7-2.03a1 1 0 00-.22-1.2l-1.3-1.3c.05-.4.05-.8 0-1.2l1.3-1.3a1 1 0 00.22-1.2l-1.7-2.03a1 1 0 00-1.21-.46l-1.63.65a6.48 6.48 0 00-1.52-.88l-.38-1.69a1 1 0 00-.97-.76h-4.5z" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={2} fill="none"/> {/* circle 요소 추가, strokeWidth=2, fill="none" */}
  </svg>
);

export default function Navbar() {
  return (
    <nav className="bg-neutral-950 text-neutral-100 border-b border-neutral-800 sticky top-0 z-10">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="hover:text-neutral-300 transition-colors text-2xl font-bold">
          내 블로그
        </Link>
        <div className="flex items-center space-x-4">
          {/* ClientVisitorCounter를 관리 링크 왼쪽에 배치 */}
          <ClientVisitorCounter />
          <Link href="/manage" className="flex items-center space-x-1 hover:text-neutral-300 transition-colors">
            <ManageIcon />
            <span>관리</span>
          </Link>
        </div>
      </div>
    </nav>
  );
} 