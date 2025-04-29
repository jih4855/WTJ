import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 여기에 필요한 테마 확장을 추가할 수 있습니다.
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // Typography 플러그인 추가
    require('@tailwindcss/line-clamp'), // Line Clamp 플러그인 추가
  ],
  darkMode: 'class', // 다크모드 클래스 전략 사용 명시
};
export default config; 