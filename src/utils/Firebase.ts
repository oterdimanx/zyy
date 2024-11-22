import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAikSDGRttw2aeab2IFn_RlFLvMPUsmyuw",
  authDomain: "zyysk8club-62059.firebaseapp.com",
  projectId: "zyysk8club-62059",
  storageBucket: "zyysk8club-62059.appspot.com",
  messagingSenderId: "1013297195776",
  appId: "1:1013297195776:web:97743d47952d35029ce1e5",
  measurementId: "G-PYWZPKSL20"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app , "gs://zyysk8club-62059.appspot.com");