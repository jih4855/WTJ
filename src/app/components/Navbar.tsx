import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-neutral-900 text-neutral-100 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          나의 블로그
        </Link>
        <div className="space-x-4">
          <Link href="/" className="hover:text-neutral-300">
            홈
          </Link>
          <Link href="/posts/new" className="hover:text-neutral-300">
            새 글 작성
          </Link>
        </div>
      </div>
    </nav>
  );
} 