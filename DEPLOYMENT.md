# SIMPLE-KRAS 건설업 배포 가이드

SIMPLE-KRAS를 Vercel에 배포하는 완전한 가이드입니다.

## 📋 사전 준비 사항

1. **GitHub 계정** - 코드를 푸시할 저장소
2. **Vercel 계정** - https://vercel.com에서 가입
3. **건설업 전용 Firebase 프로젝트 설정 완료**
   - Email/Password 인증 활성화 ✅
   - 웹앱 설정값 확인

## 🔑 Step 1: Firebase 웹앱 설정값 준비

[Firebase Console](https://console.firebase.google.com)에서:

1. 제조업 원본과 다른 **건설업 전용 Firebase 프로젝트** 선택 또는 생성
2. **Project Settings** (⚙️) → **General**
3. **Web App Configuration** 찾기
4. 다음 값들을 복사합니다:
   ```
   apiKey: "AIzaSyDsX3DbwYBFHFzvZZfTghpPBSWU3oLvBbM"
   authDomain: "kras1-8da40.firebaseapp.com"
   projectId: "kras1-8da40"
   storageBucket: "kras1-8da40.appspot.com"
   messagingSenderId: "541018613242"
   appId: "1:541018613242:web:674857aae8b1775081b043"
   ```

## 📤 Step 2: 코드를 GitHub에 푸시

```bash
# 현재 프로젝트 디렉토리에서
git init
git add .
git commit -m "Initial commit: SIMPLE-KRAS app"
git remote add origin https://github.com/YOUR_USERNAME/SIMPLE-KRAS.git
git branch -M main
git push -u origin main
```

> **GitHub Repository 이름:** `SIMPLE-KRAS` (또는 원하는 이름)

## 🌐 Step 3: Vercel에 배포

### 방법 1: Vercel CLI (권장)

```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel
```

### 방법 2: Vercel 웹사이트 (간단함)

1. https://vercel.com/dashboard에 로그인
2. **"Add New"** → **"Project"** 클릭
3. GitHub 저장소 선택
4. **Configure Project**에서:
   - Framework Preset: `Vite` (자동 감지됨)
   - Build Command: `npm run build` ✅
   - Output Directory: `dist` ✅
5. **Environment Variables** 추가:
   ```
   VITE_CONSTRUCTION_FIREBASE_API_KEY = <건설 Firebase API 키>
   VITE_CONSTRUCTION_FIREBASE_AUTH_DOMAIN = <건설 Firebase 인증 도메인>
   VITE_CONSTRUCTION_FIREBASE_PROJECT_ID = <건설 Firebase 프로젝트 ID>
   VITE_CONSTRUCTION_FIREBASE_STORAGE_BUCKET = <건설 Firebase 스토리지 버킷>
   VITE_CONSTRUCTION_FIREBASE_MESSAGING_SENDER_ID = <건설 Firebase 발신자 ID>
   VITE_CONSTRUCTION_FIREBASE_APP_ID = <건설 Firebase 앱 ID>
   ```
6. **Deploy** 버튼 클릭

## 🔒 Step 4: Firebase 보안 설정 업데이트

배포 URL을 받은 후, [Firebase Console](https://console.firebase.google.com)에서:

### Authentication 설정
1. **Build → Authentication** 이동
2. **Settings** 탭
3. **Authorized domains** 섹션:
   - "Add domain" 클릭
   - 배포된 URL 추가 (예: `simple-kras.vercel.app`)

### Firestore 보안 규칙 (선택사항)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
      // 평가서는 작성자 본인만 조회·수정·삭제
      match /constructionAssessments/{assessmentId} {
         allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
         allow read, update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // 사용자 정보
   match /constructionUsers/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

## ✅ Step 5: 배포 후 확인

배포가 완료되면:

1. **배포된 URL** 방문
2. **회원가입** 테스트
3. **평가 생성** 및 **Firestore 저장** 확인
4. **모바일 반응형** 테스트

## 🔄 Step 6: 자동 배포 설정 (선택사항)

GitHub에 푸시할 때마다 자동으로 배포하려면:

1. Vercel 대시보드에서 프로젝트 선택
2. **Settings** → **Git**
3. "Automatic Deployments" 활성화 (기본값)

## 🐛 배포 문제 해결

### 빌드 실패
```bash
# 로컬에서 빌드 테스트
npm run build
npm run lint
```

### 환경 변수 오류
- Vercel 대시보드에서 모든 `VITE_*` 변수가 추가되었는지 확인
- 변수명의 오타 확인 (대소문자 구분!)

### Firebase 인증 오류
- Firebase Console에서 배포된 URL이 "Authorized domains"에 추가되었는지 확인
- Chrome DevTools → Console에서 에러 메시지 확인

## 📞 추가 도움말

- [Vercel 문서](https://vercel.com/docs)
- [Firebase 문서](https://firebase.google.com/docs)
- [Vite 배포 가이드](https://vitejs.dev/guide/deploy.html)

## 🎉 축하합니다!

SIMPLE-KRAS가 성공적으로 배포되었습니다!
