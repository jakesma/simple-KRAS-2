import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const account = process.argv[2]?.trim();
const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT;

if (!account) {
  console.error('사용법: npm run grant:pro -- <Firebase 이메일 또는 UID>');
  process.exit(1);
}

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('GOOGLE_APPLICATION_CREDENTIALS에 Firebase 서비스 계정 JSON 경로를 설정해야 합니다.');
  process.exit(1);
}

if (getApps().length === 0) {
  initializeApp({
    credential: applicationDefault(),
    ...(projectId ? { projectId } : {})
  });
}

const adminAuth = getAuth();
const user = account.includes('@')
  ? await adminAuth.getUserByEmail(account)
  : await adminAuth.getUser(account);

await adminAuth.setCustomUserClaims(user.uid, {
  ...user.customClaims,
  subscriptionPlan: 'Pro'
});

console.log(`PRO claim 발급 완료: ${user.email || user.uid}`);
console.log('사용자는 로그아웃 후 다시 로그인해야 새 권한이 적용됩니다.');