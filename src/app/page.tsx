import Navbar from './components/Navbar';

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">최근 글</h1>
        <div className="grid gap-6">
          {/* 예시 포스트 */}
          <div className="bg-neutral-900 p-6 rounded-lg shadow-lg border border-neutral-800">
            <h2 className="text-2xl font-semibold mb-2">블로그에 오신 것을 환영합니다</h2>
            <p className="text-neutral-300 mb-4">
              이곳에서 여러분의 생각과 경험을 공유해보세요. 자유롭게 글을 작성하고 세상과 소통할 수 있습니다.
            </p>
            <div className="text-sm text-neutral-400">
              작성일: {new Date().toLocaleDateString('ko-KR')}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
