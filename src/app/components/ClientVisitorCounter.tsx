'use client';

import { useState, useEffect } from 'react';

export default function ClientVisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // 클라이언트 측에서만 실행되도록 fetch 호출
    fetch('/api/pageview/count')
      .then(res => {
        if (!res.ok) {
          // 에러 발생 시 콘솔에 기록하고 count를 null 또는 0으로 유지
          console.error('Failed to fetch visitor count:', res.status);
          return null; // 또는 { count: 0 }
        }
        return res.json();
      })
      .then(data => {
        if (data && typeof data.count === 'number') {
          setCount(data.count);
        }
      })
      .catch(error => {
        console.error('Error fetching visitor count:', error);
      });
  }, []); // 마운트 시 한 번만 호출

  // 로딩 중 또는 에러 시 표시 (선택적)
  if (count === null) {
    return <div className="text-sm text-neutral-500 animate-pulse">...</div>; // 로딩 표시 예시
  }

  return (
    <div className="text-sm text-neutral-400">
      총 방문자 수: {count.toLocaleString()}
    </div>
  );
} 