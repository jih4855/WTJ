import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-neutral-950 text-neutral-100 border-b border-neutral-800 sticky top-0 z-10">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="hover:text-neutral-300 transition-colors text-2xl font-bold">
          내 블로그
        </Link>
        <div className="flex items-center space-x-2">
          <span className="text-lg">⚙️</span>
          <Link href="/manage" className="hover:text-neutral-300 transition-colors">
            관리
          </Link>
        </div>
      </div>
    </nav>
  );
} 