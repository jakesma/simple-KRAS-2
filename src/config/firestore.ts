import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  Query,
  DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';
import { RiskAssessment } from '../types';

// Firestore collection paths
const ASSESSMENTS_COLLECTION = 'assessments';
const USERS_COLLECTION = 'users';

/**
 * Save or update an assessment in Firestore
 */
export const saveAssessment = async (
  userId: string,
  assessment: RiskAssessment
): Promise<{ success: boolean; error?: string; id?: string }> => {
  try {
    const assessmentRef = doc(db, ASSESSMENTS_COLLECTION, assessment.id);

    await setDoc(assessmentRef, {
      ...assessment,
      userId, // Store userId for filtering
      updatedAt: new Date().toISOString(),
    });

    return { success: true, id: assessment.id };
  } catch (error) {
    console.error('Error saving assessment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '저장 실패',
    };
  }
};

/**
 * Get all assessments for a specific user
 */
export const getUserAssessments = async (
  userId: string
): Promise<{ success: boolean; assessments?: RiskAssessment[]; error?: string }> => {
  try {
    const q = query(
      collection(db, ASSESSMENTS_COLLECTION),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    const assessments: RiskAssessment[] = [];

    querySnapshot.forEach((doc) => {
      assessments.push({
        ...doc.data(),
        id: doc.id,
      } as RiskAssessment);
    });

    // Sort by updatedAt descending
    assessments.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return { success: true, assessments };
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '조회 실패',
    };
  }
};

/**
 * Get a single assessment by ID
 */
export const getAssessmentById = async (
  assessmentId: string
): Promise<{ success: boolean; assessment?: RiskAssessment; error?: string }> => {
  try {
    const docRef = doc(db, ASSESSMENTS_COLLECTION, assessmentId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return {
        success: false,
        error: '평가서를 찾을 수 없습니다.',
      };
    }

    return {
      success: true,
      assessment: { ...docSnap.data(), id: docSnap.id } as RiskAssessment,
    };
  } catch (error) {
    console.error('Error fetching assessment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '조회 실패',
    };
  }
};

/**
 * Delete an assessment
 */
export const deleteAssessment = async (
  assessmentId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const docRef = doc(db, ASSESSMENTS_COLLECTION, assessmentId);
    await deleteDoc(docRef);

    return { success: true };
  } catch (error) {
    console.error('Error deleting assessment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '삭제 실패',
    };
  }
};

/**
 * Save user profile information
 */
export const saveUserProfile = async (
  userId: string,
  profileData: {
    displayName: string;
    email: string;
    companyName?: string;
    department?: string;
  }
): Promise<{ success: boolean; error?: string }> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);

    await setDoc(
      userRef,
      {
        displayName: profileData.displayName,
        email: profileData.email,
        companyName: profileData.companyName || '',
        department: profileData.department || '',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return { success: true };
  } catch (error) {
    console.error('Error saving user profile:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '프로필 저장 실패',
    };
  }
};

/**
 * Get user profile
 */
export const getUserProfile = async (
  userId: string
): Promise<{
  success: boolean;
  profile?: { displayName: string; email: string; companyName?: string; department?: string };
  error?: string;
}> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { success: false, error: '사용자를 찾을 수 없습니다.' };
    }

    return {
      success: true,
      profile: userSnap.data() as {
        displayName: string;
        email: string;
        companyName?: string;
        department?: string;
      },
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '프로필 조회 실패',
    };
  }
};

/**
 * Migrate assessments from localStorage to Firestore
 * This should be called on first login
 */
export const migrateLocalStorageToFirestore = async (
  userId: string,
  assessments: RiskAssessment[]
): Promise<{ success: boolean; count: number; error?: string }> => {
  try {
    let count = 0;

    for (const assessment of assessments) {
      const result = await saveAssessment(userId, assessment);
      if (result.success) {
        count++;
      }
    }

    return { success: true, count };
  } catch (error) {
    console.error('Error migrating data:', error);
    return {
      success: false,
      count: 0,
      error: error instanceof Error ? error.message : '마이그레이션 실패',
    };
  }
};
