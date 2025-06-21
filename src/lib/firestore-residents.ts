import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  WriteBatch,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Resident, FamilyContact, Room, ResidentDailyStatus } from '@/types/resident';

// 利用者管理
export const createResident = async (residentData: Omit<Resident, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'residents'), {
      ...residentData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating resident:', error);
    throw error;
  }
};

export const updateResident = async (residentId: string, updates: Partial<Resident>) => {
  try {
    const residentRef = doc(db, 'residents', residentId);
    await updateDoc(residentRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating resident:', error);
    throw error;
  }
};

export const deleteResident = async (residentId: string) => {
  try {
    await deleteDoc(doc(db, 'residents', residentId));
  } catch (error) {
    console.error('Error deleting resident:', error);
    throw error;
  }
};

export const getResidents = async (status?: 'active' | 'inactive' | 'discharged'): Promise<Resident[]> => {
  try {
    let q = query(collection(db, 'residents'), orderBy('name'));
    
    if (status) {
      q = query(collection(db, 'residents'), where('status', '==', status), orderBy('name'));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Resident));
  } catch (error) {
    console.error('Error fetching residents:', error);
    throw error;
  }
};

export const getResident = async (residentId: string): Promise<Resident | null> => {
  try {
    const docRef = doc(db, 'residents', residentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Resident;
    }
    return null;
  } catch (error) {
    console.error('Error fetching resident:', error);
    throw error;
  }
};

// 部屋管理
export const createRoom = async (roomData: Omit<Room, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'rooms'), roomData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
};

export const getRooms = async (): Promise<Room[]> => {
  try {
    const q = query(collection(db, 'rooms'), orderBy('roomNumber'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Room));
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
};

export const updateRoom = async (roomId: string, updates: Partial<Room>) => {
  try {
    const roomRef = doc(db, 'rooms', roomId);
    await updateDoc(roomRef, updates);
  } catch (error) {
    console.error('Error updating room:', error);
    throw error;
  }
};

// 日次状態記録
export const createDailyStatus = async (statusData: Omit<ResidentDailyStatus, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'residentDailyStatus'), {
      ...statusData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating daily status:', error);
    throw error;
  }
};

export const updateDailyStatus = async (statusId: string, updates: Partial<ResidentDailyStatus>) => {
  try {
    const statusRef = doc(db, 'residentDailyStatus', statusId);
    await updateDoc(statusRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating daily status:', error);
    throw error;
  }
};

export const getDailyStatus = async (residentId: string, date: string): Promise<ResidentDailyStatus | null> => {
  try {
    const q = query(
      collection(db, 'residentDailyStatus'),
      where('residentId', '==', residentId),
      where('date', '==', date)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as ResidentDailyStatus;
    }
    return null;
  } catch (error) {
    console.error('Error fetching daily status:', error);
    throw error;
  }
};

export const getDailyStatusByDate = async (date: string): Promise<ResidentDailyStatus[]> => {
  try {
    const q = query(
      collection(db, 'residentDailyStatus'),
      where('date', '==', date),
      orderBy('createdAt')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as ResidentDailyStatus));
  } catch (error) {
    console.error('Error fetching daily status by date:', error);
    throw error;
  }
};

// バッチ操作
export const batchUpdateResidents = async (updates: { id: string; data: Partial<Resident> }[]) => {
  try {
    const batch = writeBatch(db);
    
    updates.forEach(({ id, data }) => {
      const residentRef = doc(db, 'residents', id);
      batch.update(residentRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error batch updating residents:', error);
    throw error;
  }
};

// 統計情報
export const getResidentStatistics = async () => {
  try {
    const residents = await getResidents();
    const rooms = await getRooms();
    
    return {
      totalResidents: residents.length,
      activeResidents: residents.filter(r => r.status === 'active').length,
      stayHomeUsers: residents.filter(r => ['stay-home', 'both'].includes(r.contractType)).length,
      dayServiceUsers: residents.filter(r => ['day-service', 'both'].includes(r.contractType)).length,
      totalRooms: rooms.length,
      occupiedRooms: rooms.filter(r => r.currentOccupancy > 0).length,
      totalCapacity: rooms.reduce((sum, room) => sum + room.capacity, 0),
      currentOccupancy: rooms.reduce((sum, room) => sum + room.currentOccupancy, 0),
    };
  } catch (error) {
    console.error('Error fetching resident statistics:', error);
    throw error;
  }
};