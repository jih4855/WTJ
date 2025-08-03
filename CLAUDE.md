# WTJ (Welcome to Jinju) Blog - 프로젝트 가이드

## 프로젝트 개요
- **프로젝트명**: WTJ (Welcome to Jinju)
- **타입**: Jekyll 기반 다국어 개인 블로그
- **목적**: 경남 진주를 중심으로 한 개인 여행 블로그 및 문화 분석
- **지원 언어**: 한국어(ko), 영어(en), 일본어(ja)
- **배포**: GitHub Pages (`https://jih4855.github.io/WTJ`)

## 기술 스택
- **정적 사이트 생성**: Jekyll
- **CSS**: SCSS
- **배포**: GitHub Pages 자동 배포
- **분석**: Google Tag Manager (GTM-PV39J3NR)

## 프로젝트 구조
```
/
├── _config.yml              # Jekyll 설정
├── _includes/               # 공통 컴포넌트
│   ├── head.html           # GTM 스크립트 포함
│   ├── header.html         # 헤더
│   └── footer.html         # 푸터
├── _layouts/               # 레이아웃 템플릿
│   ├── default.html        # 기본 레이아웃 (GTM noscript 포함)
│   └── post.html           # 포스트 레이아웃
├── _posts/                 # 블로그 포스트
│   ├── ko/                 # 한국어 포스트
│   ├── en/                 # 영어 포스트
│   └── ja/                 # 일본어 포스트
├── image/                  # 이미지 리소스
├── assets/                 # CSS, JS 파일
└── [언어별 페이지들]
```

## 중요 설정값
- **baseurl**: `/WTJ`
- **url**: `https://jih4855.github.io`
- **GTM ID**: `GTM-PV39J3NR`
- **기본 언어**: `en`
- **지원 언어**: `["ko", "en", "ja"]`

## 개발 가이드

### 로컬 실행
```bash
bundle exec jekyll serve
# 또는 초안 포함
bundle exec jekyll serve --drafts
```

### 새 포스트 작성
1. 파일명 형식: `YYYY-MM-DD-title.md`
2. 위치: `_posts/[언어코드]/`
3. Front Matter 필수값:
```yaml
---
layout: post
title: "포스트 제목"
date: YYYY-MM-DD
categories: [카테고리1, 카테고리2]
lang: ko  # 또는 en, ja
---
```

### 이미지 사용
- 위치: `/image/` 폴더
- 마크다운에서 참조: `![설명]({{ site.baseurl }}/image/파일명.png)`
- 새창 링크: `<a href="URL" target="_blank">텍스트</a>`

### 다국어 지원
- 각 언어별로 별도 폴더에 포스트 작성
- 동일한 내용은 같은 날짜로 작성 권장
- 언어별 About 페이지: `/ko/about.md`, `/en/about.md`, `/ja/about.md`

## 배포 프로세스
1. **개발**: 로컬에서 `bundle exec jekyll serve`로 테스트
2. **커밋**: `git add . && git commit -m "메시지"`
3. **배포**: `git push origin main`
4. **확인**: 1-2분 후 GitHub Pages에 자동 반영

## 분석 및 추적
- **Google Tag Manager**: 모든 페이지에 자동 설치됨
- **GTM ID**: `GTM-PV39J3NR`
- **적용 범위**: 모든 레이아웃 사용 페이지 (자동)

## 현재 콘텐츠
### 포스트 현황 (2025-08-03 기준)
- **케데헌 문화 분석**: 한/영/일 3개 언어로 작성
  - 저승사자와 무당의 전통문화 분석
  - K-Pop Demon Hunters 배경 설명
  - 관련 영화/드라마 추천 포함

### 이미지 리소스
- `전설의 고향 저승사자.png`
- `이동욱 도깨비.png`  
- `파묘 김고은.png`

## 주의사항
- **이미지 경로**: 반드시 `{{ site.baseurl }}/image/파일명` 형식 사용
- **외부 링크**: 새창 띄우기 위해 `target="_blank"` 속성 사용
- **언어 코드**: 파일명과 front matter의 `lang` 값 일치 필수
- **커밋 메시지**: 한국어로 작성, 변경사항 구체적으로 명시

## 트러블슈팅
### 이미지가 안 보일 때
- 경로 확인: `{{ site.baseurl }}/image/파일명` 형식인지
- 파일 존재 확인: `/image/` 폴더에 파일이 있는지
- 브라우저 캐시 새로고침

### 빌드 실패 시
- `_config.yml` 문법 확인
- Front Matter YAML 형식 확인
- GitHub Actions 탭에서 에러 로그 확인

## 향후 계획
- [ ] 진주 여행 관련 포스트 추가
- [ ] 카테고리별 페이지 구성
- [ ] 검색 기능 추가
- [ ] 댓글 시스템 도입 검토