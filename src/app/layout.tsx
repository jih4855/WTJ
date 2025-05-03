"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  useEffect(() => {
    // /manage 경로는 클라이언트 측에서 미리 체크할 필요 없어짐 (서버에서 처리)
    // if (pathname?.startsWith('/manage')) { return; }

    const storageKey = 'blogVisitedThisSession';
    const hasVisited = sessionStorage.getItem(storageKey);

    if (!hasVisited) {
      // console.log('First visit this session, attempting count.'); // 로그 수정 가능

      sessionStorage.setItem(storageKey, 'true');

      // 페이지뷰 API 호출 시 pathname 포함
      fetch('/api/pageview', {
        method: 'POST',
        // 헤더와 body 추가
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pathname: pathname }) // 현재 경로 전송
      })
      .then(res => {
        if (!res.ok) {
          // 서버에서 에러 응답 시 (예: 500) 또는 스킵 응답(예: 200 이지만 메시지 다름) 처리 가능
          // console.error('API call issue:', res.status, res.statusText);
        } else {
          // 성공 응답 (카운트 됐거나 스킵됐거나)
          // res.json().then(data => console.log('API response:', data)); // 응답 메시지 확인용
        }
      })
      .catch(error => {
        console.error("Error fetching pageview API: ", error);
      });
    }
  }, [pathname]); // 의존성 배열은 그대로 유지

  return (
    <html lang="ko" className="dark">
      <body className={`${inter.className} dark:bg-neutral-950 dark:text-neutral-100`}>
        {children}
      </body>
    </html>
  );
}
