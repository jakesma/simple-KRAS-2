# 🛡️ SIMPLE-KRAS - 위험성평가 플랫폼

AI 기반 자동 위험성평가 플랫폼입니다.
공정 정보만 입력하면 AI가 위험성평가표와 TBM 회의록을 자동으로 생성합니다.

**특징:**
- ⚡ 10초 내 위험성평가 자동 생성
- 🤖 AI 기반 위험 요소 분석
- 📋 자동 위험성평가표 작성
- 🌐 클라우드 기반 데이터 관리
- 📱 모바일 반응형 디자인

## 🚀 시작하기

### 필수 요구사항
- Node.js 16+
- npm 또는 yarn
- Firebase 프로젝트 계정

### 1️⃣ 의존성 설치
```bash
npm install
```

### 2️⃣ Firebase 설정

#### Firebase 프로젝트 생성/설정:
1. [Firebase Console](https://console.firebase.google.com)에 접속
2. 프로젝트 생성 또는 기존 프로젝트 선택
3. **"Build" → "Authentication"** 메뉴 진입
4. **"Sign-in method"** 탭에서:
   - ✅ **Email/Password** 활성화
   - ✅ **Google** (선택사항) 활성화
5. **Project settings**에서 웹 앱 설정값 복사

#### 환경 변수 설정 (.env.local):
```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# API Configuration
VITE_API_URL=http://localhost:3000
```

### 3️⃣ 개발 서버 실행
```bash
npm run dev
```
앱이 `http://localhost:3000`에서 실행됩니다.

## 📦 빌드 및 배포

### 프로덕션 빌드
```bash
npm run build
```

### 코드 품질 검사
```bash
npm run lint
```

### E2E 테스트 실행
```bash
npm run e2e
```

## 🏗️ 프로젝트 구조
```
src/
├── components/         # React 컴포넌트
│   ├── AssessmentForm.tsx
│   ├── AssessmentList.tsx
│   ├── AuthPage.tsx
│   ├── DocumentViewer.tsx
│   └── LandingPage.tsx
├── config/            # 설정 파일
│   ├── auth.ts       # Firebase 인증
│   ├── firebase.ts   # Firebase 초기화
│   └── firestore.ts  # Firestore DB
├── data/             # 데이터 파일
│   └── expertDatabase.ts
├── types.ts          # TypeScript 타입
├── App.tsx           # 메인 앱
└── main.tsx          # 진입점
```

## 📝 주요 기능

### 인증 (Authentication)
- 이메일/비밀번호 회원가입
- Firebase 기반 로그인
- 자동 로그인 유지

### 위험성평가 관리
- 평가 생성/수정/삭제
- Firestore 클라우드 저장소
- LocalStorage 자동 마이그레이션

### 문서 생성
- 위험성평가표 자동 생성
- TBM 회의록 작성
- PDF 다운로드 (개발 중)

## 🔧 개발 가이드

### TypeScript 타입 체크
```bash
npm run lint
```

### 새 컴포넌트 추가
1. `src/components/` 폴더에 파일 생성
2. React 함수형 컴포넌트 작성
3. `src/App.tsx`에 import 및 등록

### 환경 변수 추가
1. `.env.local` 파일에 `VITE_` 접두사로 추가
2. TypeScript에서 `import.meta.env.VITE_VARIABLE_NAME`으로 사용

## 🚢 Vercel 배포

1. GitHub에 코드 푸시
2. [Vercel](https://vercel.com) 계정으로 로그인
3. "New Project" → GitHub 저장소 선택
4. Environment Variables 설정:
   - Firebase 설정값 모두 추가
5. "Deploy" 클릭

### 배포 후 설정
Firebase Console에서:
- Authorized JavaScript origins에 배포된 URL 추가
- Authorized redirect URIs에 배포된 URL/callback 추가

## 📞 지원

문제가 발생하면:
1. [Firebase 문서](https://firebase.google.com/docs)
2. [Vite 문서](https://vitejs.dev)
3. [React 문서](https://react.dev)를 참고하세요.
