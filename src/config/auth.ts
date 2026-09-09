import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  User,
  AuthError,
} from 'firebase/auth';
import { auth } from './firebase';

// Type definitions
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Error message mapping for better UX
const getErrorMessage = (error: AuthError): string => {
  const errorMessages: { [key: string]: string } = {
    'auth/email-already-in-use': '이미 사용 중인 이메일입니다.',
    'auth/invalid-email': '유효하지 않은 이메일 주소입니다.',
    'auth/operation-not-allowed': '이 작업은 허용되지 않습니다.',
    'auth/weak-password': '비밀번호는 최소 6자 이상이어야 합니다.',
    'auth/user-disabled': '비활성화된 계정입니다.',
    'auth/user-not-found': '등록되지 않은 이메일입니다.',
    'auth/wrong-password': '비밀번호가 잘못되었습니다.',
    'auth/too-many-requests': '너무 많은 시도가 있었습니다. 나중에 다시 시도해주세요.',
    'auth/network-request-failed': '네트워크 연결을 확인해주세요.',
    'auth/popup-closed-by-user': 'Google 로그인 창이 닫혔습니다.',
    'auth/popup-blocked': '브라우저에서 팝업이 차단되었습니다. 팝업을 허용한 뒤 다시 시도해주세요.',
    'auth/unauthorized-domain': '현재 사이트 주소가 Firebase 인증 도메인에 등록되지 않았습니다.',
    'auth/account-exists-with-different-credential': '같은 이메일이 다른 로그인 방식으로 이미 등록되어 있습니다.',
  };

  return errorMessages[error.code] || error.message || '인증 오류가 발생했습니다.';
};

// Sign up with email and password
export const signUp = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name
    await updateProfile(userCredential.user, {
      displayName: displayName,
    });

    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
      } as AuthUser,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error as AuthError),
    };
  }
};

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
      } as AuthUser,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error as AuthError),
    };
  }
};

// Sign in with Google popup
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const userCredential = await signInWithPopup(auth, provider);

    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
      } as AuthUser,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error as AuthError),
    };
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error as AuthError),
    };
  }
};

// Send password reset email
export const sendResetEmail = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: '비밀번호 재설정 이메일을 보냈습니다. 이메일을 확인해주세요.',
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error as AuthError),
    };
  }
};

// Get current user
export const getCurrentUser = (): AuthUser | null => {
  const user = auth.currentUser;
  
  if (!user) return null;

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
};

// Subscribe to auth state changes
export const onAuthStateChanged = (callback: (user: AuthUser | null) => void) => {
  return auth.onAuthStateChanged((user) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
    } else {
      callback(null);
    }
  });
};
