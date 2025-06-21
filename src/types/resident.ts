import { Timestamp } from 'firebase/firestore';

// 利用者の基本情報
export interface Resident {
  id: string;
  // 基本情報
  name: string;
  displayCode: string; // A, B, C, D, E等の表示用コード
  dateOfBirth: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  address: string;
  phoneNumber?: string;
  
  // 入所情報
  admissionDate: string;
  roomNumber: string;
  contractType: 'stay-home' | 'day-service' | 'both';
  
  // 医療・ケア情報
  medicalInfo: {
    allergies: string[];
    medications: string[];
    medicalHistory: string[];
    disabilities: string[];
    careLevel?: string;
  };
  
  // 家族情報
  familyContacts: FamilyContact[];
  
  // 緊急連絡先
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
    address?: string;
  };
  
  // システム情報
  status: 'active' | 'inactive' | 'discharged';
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

// 家族連絡先
export interface FamilyContact {
  id: string;
  name: string;
  relationship: string; // 父、母、兄弟、etc
  phoneNumber: string;
  email?: string;
  address?: string;
  isPrimary: boolean; // 主連絡先かどうか
  canReceiveNotifications: boolean; // 連絡帳や緊急連絡を受け取るか
}

// 部屋情報
export interface Room {
  id: string;
  roomNumber: string;
  roomName?: string;
  capacity: number;
  currentOccupancy: number;
  roomType: 'private' | 'shared' | 'common';
  facilities: string[]; // トイレ、洗面所、etc
  notes?: string;
}

// 利用者の日次状態
export interface ResidentDailyStatus {
  id: string;
  residentId: string;
  date: string;
  
  // バイタルサイン
  vitals: {
    bodyTemperature?: number;
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    pulseRate?: number;
    respirationRate?: number;
    oxygenSaturation?: number;
    weight?: number;
    recordedAt: Timestamp;
    recordedBy: string;
  };
  
  // 服薬記録
  medications: {
    medicationName: string;
    dosage: string;
    time: string;
    taken: boolean;
    notes?: string;
  }[];
  
  // 食事記録
  meals: {
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    consumed: 'all' | 'half' | 'little' | 'none';
    notes?: string;
  }[];
  
  // 排泄記録
  excretion: {
    time: string;
    type: 'urination' | 'defecation' | 'both';
    assistance: 'independent' | 'partial' | 'full';
    notes?: string;
  }[];
  
  // 入浴記録
  bathing?: {
    completed: boolean;
    assistanceLevel: 'independent' | 'partial' | 'full';
    notes?: string;
  };
  
  // 全般的な様子
  generalCondition: {
    mood: 'good' | 'normal' | 'poor' | 'irritable';
    activityLevel: 'active' | 'normal' | 'low' | 'bedridden';
    sleepQuality?: 'good' | 'normal' | 'poor';
    appetite: 'good' | 'normal' | 'poor';
    notes?: string;
  };
  
  // システム情報
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}