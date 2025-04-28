import Navbar from '../../components/Navbar';

export default function NewPost() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">새 글 작성</h1>
        <form className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-lg font-medium mb-2">
              제목
            </label>
            <input
              type="text"
              id="title"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-500 text-neutral-100 placeholder-neutral-400"
              placeholder="글 제목을 입력하세요"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-lg font-medium mb-2">
              내용
            </label>
            <textarea
              id="content"
              rows={10}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-500 text-neutral-100 placeholder-neutral-400"
              placeholder="글 내용을 작성하세요..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-neutral-700 hover:bg-neutral-600 text-neutral-100 font-medium py-2 px-6 rounded-lg transition-colors"
          >
            글 발행하기
          </button>
        </form>
      </div>
    </main>
  );
} 