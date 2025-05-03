import Link from 'next/link';
import VisitorCounter from './VisitorCounter';
// lucide-react에서 Cog 아이콘 import
import { Cog } from 'lucide-react';

// SVG 아이콘 정의 제거
// const CogIcon = () => ( ... );

export default function Navbar() {
  return (
    <nav className="bg-neutral-950 text-neutral-100 border-b border-neutral-800 sticky top-0 z-10">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="hover:text-neutral-300 transition-colors text-2xl font-bold">
          내 블로그
        </Link>
        <div className="flex items-center space-x-4">
          <VisitorCounter />
          <Link href="/manage" className="flex items-center space-x-1 hover:text-neutral-300 transition-colors">
            <Cog size={18} />
            <span>관리</span>
          </Link>
        </div>
      </div>
    </nav>
  );
} 