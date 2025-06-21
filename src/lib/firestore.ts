import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  addDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { User, SupportDiary, WorkDiary, Shift, MessageTemplate } from '@/types';

// ユーザー関連の操作
export const getUserRole = async (uid: string): Promise<string | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data().role || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting user role:', error);
    throw error;
  }
};

export const createOrUpdateUser = async (userData: User): Promise<void> => {
  try {
    await setDoc(doc(db, 'users', userData.uid), {
      ...userData,
      updatedAt: Timestamp.now(),
    }, { merge: true });
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw error;
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    return usersSnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data(),
    })) as User[];
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

// 支援日誌関連の操作
export const createSupportDiary = async (diaryData: Omit<SupportDiary, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'support_diaries'), {
      ...diaryData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating support diary:', error);
    throw error;
  }
};

export const getSupportDiaries = async (date: string): Promise<SupportDiary[]> => {
  try {
    const q = query(
      collection(db, 'support_diaries'),
      where('date', '==', date),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as SupportDiary[];
  } catch (error) {
    console.error('Error getting support diaries:', error);
    throw error;
  }
};

// 業務日誌関連の操作
export const createWorkDiary = async (diaryData: Omit<WorkDiary, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'work_diaries'), {
      ...diaryData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating work diary:', error);
    throw error;
  }
};

// シフト関連の操作
export const createShift = async (shiftData: Omit<Shift, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'shifts'), {
      ...shiftData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating shift:', error);
    throw error;
  }
};

export const getShifts = async (month: string): Promise<Shift[]> => {
  try {
    const q = query(
      collection(db, 'shifts'),
      where('month', '==', month),
      orderBy('date', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Shift[];
  } catch (error) {
    console.error('Error getting shifts:', error);
    throw error;
  }
};

export const updateShift = async (id: string, shiftData: Partial<Shift>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'shifts', id), {
      ...shiftData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating shift:', error);
    throw error;
  }
};

export const deleteShift = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'shifts', id));
  } catch (error) {
    console.error('Error deleting shift:', error);
    throw error;
  }
};

export const getShiftsByUser = async (userId: string, month: string): Promise<Shift[]> => {
  try {
    const q = query(
      collection(db, 'shifts'),
      where('userId', '==', userId),
      where('month', '==', month),
      orderBy('date', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Shift[];
  } catch (error) {
    console.error('Error getting shifts by user:', error);
    throw error;
  }
};

// メッセージテンプレート関連の操作
export const getMessageTemplates = async (): Promise<MessageTemplate[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'message_templates'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as MessageTemplate[];
  } catch (error) {
    console.error('Error getting message templates:', error);
    throw error;
  }
};

export const createMessageTemplate = async (templateData: Omit<MessageTemplate, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'message_templates'), {
      ...templateData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating message template:', error);
    throw error;
  }
};