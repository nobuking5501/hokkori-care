// 部屋の初期データを作成するスクリプト
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

const firebaseConfig = {
  // 環境変数から取得するか、直接設定
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 24時間ステイホーム施設の部屋データ
const roomsData = [
  {
    roomNumber: '101',
    roomName: '個室A',
    capacity: 1,
    currentOccupancy: 0,
    roomType: 'private',
    facilities: ['トイレ', '洗面所', 'ベッド', 'クローゼット'],
    notes: '24時間ステイホーム用個室'
  },
  {
    roomNumber: '102',
    roomName: '個室B',
    capacity: 1,
    currentOccupancy: 0,
    roomType: 'private',
    facilities: ['トイレ', '洗面所', 'ベッド', 'クローゼット'],
    notes: '24時間ステイホーム用個室'
  },
  {
    roomNumber: '103',
    roomName: '個室C',
    capacity: 1,
    currentOccupancy: 0,
    roomType: 'private',
    facilities: ['トイレ', '洗面所', 'ベッド', 'クローゼット'],
    notes: '24時間ステイホーム用個室'
  },
  {
    roomNumber: '201',
    roomName: '2人部屋A',
    capacity: 2,
    currentOccupancy: 0,
    roomType: 'shared',
    facilities: ['共用トイレ', '洗面所', 'ベッド×2', 'クローゼット×2'],
    notes: '24時間ステイホーム用2人部屋'
  },
  {
    roomNumber: '202',
    roomName: '2人部屋B',
    capacity: 2,
    currentOccupancy: 0,
    roomType: 'shared',
    facilities: ['共用トイレ', '洗面所', 'ベッド×2', 'クローゼット×2'],
    notes: '24時間ステイホーム用2人部屋'
  },
  {
    roomNumber: 'Day1',
    roomName: 'デイサービス室1',
    capacity: 10,
    currentOccupancy: 0,
    roomType: 'common',
    facilities: ['机・椅子', 'テレビ', 'エアコン', 'トイレ'],
    notes: '放課後デイサービス用'
  },
  {
    roomNumber: 'Day2',
    roomName: 'デイサービス室2',
    capacity: 8,
    currentOccupancy: 0,
    roomType: 'common',
    facilities: ['机・椅子', 'PC', 'プロジェクター', 'トイレ'],
    notes: '放課後デイサービス用（学習室）'
  },
  {
    roomNumber: 'Common',
    roomName: '共用リビング',
    capacity: 20,
    currentOccupancy: 0,
    roomType: 'common',
    facilities: ['ソファ', 'テレビ', 'ダイニングテーブル', 'キッチン'],
    notes: '全利用者共用スペース'
  }
];

async function setupRooms() {
  try {
    console.log('部屋データの作成を開始します...');
    
    for (const room of roomsData) {
      const docRef = await addDoc(collection(db, 'rooms'), room);
      console.log(`部屋 ${room.roomNumber} (${room.roomName}) を作成しました。ID: ${docRef.id}`);
    }
    
    console.log('すべての部屋データの作成が完了しました！');
  } catch (error) {
    console.error('部屋データの作成中にエラーが発生しました:', error);
  }
}

setupRooms();