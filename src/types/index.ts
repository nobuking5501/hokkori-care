import { Timestamp } from 'firebase/firestore';

// ユーザーロール定義
export type UserRole = 'admin' | 'manager' | 'staff';

// ユーザー情報
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  facility: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// シフト記号定義
export type ShiftSymbol = 
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O'
  | '夜勤1' | '夜勤2' | '夜勤3' | '夜勤4'
  | '希望休' | '';

// シフト情報
export interface Shift {
  id: string;
  userId: string;
  userName: string;
  date: string; // YYYY-MM-DD形式
  month: string; // YYYY-MM形式
  symbol: ShiftSymbol;
  startTime?: string;
  endTime?: string;
  isHoliday: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 利用者情報
export interface Client {
  id: string;
  name: string;
  age: number;
  disability?: string;
  medicalInfo?: string;
  emergencyContact?: string;
  familyContact?: string;
  notes?: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// バイタル情報
export interface VitalSigns {
  temperature?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  pulse?: number;
  notes?: string;
}

// 支援日誌
export interface SupportDiary {
  id: string;
  clientId: string;
  clientName: string;
  date: string; // YYYY-MM-DD形式
  staffId: string;
  staffName: string;
  
  // 起床・就寝
  wakeUpTime?: string;
  bedTime?: string;
  sleepQuality?: 'good' | 'fair' | 'poor';
  
  // 食事
  breakfast?: {
    intake: 'full' | 'half' | 'little' | 'none';
    notes?: string;
  };
  lunch?: {
    intake: 'full' | 'half' | 'little' | 'none';
    notes?: string;
  };
  dinner?: {
    intake: 'full' | 'half' | 'little' | 'none';
    notes?: string;
  };
  
  // 排泄
  urination?: {
    frequency: number;
    notes?: string;
  };
  defecation?: {
    frequency: number;
    condition: 'normal' | 'soft' | 'hard' | 'loose';
    notes?: string;
  };
  
  // バイタル
  vitalSigns?: VitalSigns;
  
  // 活動・様子
  activities?: string;
  mood?: 'good' | 'fair' | 'anxious' | 'irritable' | 'depressed';
  socialInteraction?: string;
  
  // 特記事項
  specialNotes?: string;
  
  // 家族への報告内容
  familyReport?: string;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 業務日誌
export interface WorkDiary {
  id: string;
  staffId: string;
  staffName: string;
  date: string; // YYYY-MM-DD形式
  
  // 時間帯別業務
  timeSlots: {
    startTime: string;
    endTime: string;
    location: string;
    task: string;
    notes?: string;
  }[];
  
  // 申し送り事項
  handover?: string;
  
  // 特記事項
  specialNotes?: string;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 連絡帳エントリー
export interface CommunicationLog {
  id: string;
  clientId: string;
  clientName: string;
  date: string; // YYYY-MM-DD形式
  
  // 家族からの連絡
  familyMessage?: {
    morningCondition?: string;
    requests?: string;
    concerns?: string;
    timestamp: Timestamp;
  };
  
  // 職員からの報告
  staffReport?: {
    dailyActivities: string;
    mood: string;
    meals: string;
    health: string;
    specialNotes?: string;
    staffId: string;
    staffName: string;
    timestamp: Timestamp;
    // Claude APIで整形された文章
    formattedMessage?: string;
  };
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ねぎらいメッセージテンプレート
export interface MessageTemplate {
  id: string;
  message: string;
  category: 'greeting' | 'encouragement' | 'appreciation' | 'motivation';
  isActive: boolean;
  createdAt: Timestamp;
}

// フォーム関連の型
export interface SupportDiaryFormData {
  clientId: string;
  date: string;
  wakeUpTime: string;
  bedTime: string;
  sleepQuality: 'good' | 'fair' | 'poor';
  
  breakfastIntake: 'full' | 'half' | 'little' | 'none';
  breakfastNotes: string;
  lunchIntake: 'full' | 'half' | 'little' | 'none';
  lunchNotes: string;
  dinnerIntake: 'full' | 'half' | 'little' | 'none';
  dinnerNotes: string;
  
  urinationFrequency: number;
  urinationNotes: string;
  defecationFrequency: number;
  defecationCondition: 'normal' | 'soft' | 'hard' | 'loose';
  defecationNotes: string;
  
  temperature: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  pulse: number;
  vitalNotes: string;
  
  activities: string;
  mood: 'good' | 'fair' | 'anxious' | 'irritable' | 'depressed';
  socialInteraction: string;
  specialNotes: string;
}

// API レスポンス型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 利用者管理用の型をエクスポート
export * from './resident';