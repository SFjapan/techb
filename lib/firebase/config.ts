import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore ,collection} from 'firebase/firestore'
import { getApps,getApp } from 'firebase/app';

// .envファイルで設定した環境変数をfirebaseConfigに入れる
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_DATABASEURL,
  projectId: process.env.NEXT_PUBLIC_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_APPID
};
// Ensure Firebase is initialized only once
const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
// Get authentication and firestore instances
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

export { firebaseApp, auth, firestore };




