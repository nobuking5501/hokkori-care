const admin = require('firebase-admin');

// Firebase Admin SDKの初期化
const serviceAccount = require('./path-to-your-service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'your-project-id'
});

async function createUser() {
  try {
    // ユーザーを作成
    const userRecord = await admin.auth().createUser({
      email: 'nobuking5501@gmail.com',
      password: 'hokkori2024', // 強固なパスワードを設定
      displayName: 'nobuking5501',
      emailVerified: true,
    });

    console.log('ユーザーが正常に作成されました:', userRecord.uid);

    // Firestoreにユーザー情報を保存
    const db = admin.firestore();
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: 'nobuking5501@gmail.com',
      displayName: 'nobuking5501',
      role: 'admin', // 管理者権限を付与
      facility: 'ほっこり福祉会',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log('Firestoreにユーザー情報を保存しました');
    process.exit(0);
  } catch (error) {
    console.error('ユーザー作成エラー:', error);
    process.exit(1);
  }
}

createUser();