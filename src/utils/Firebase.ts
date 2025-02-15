import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.FBS_API_KEY,
  authDomain: process.env.FBS_AUTH_DOMAIN,
  projectId: process.env.FBS_PROJECT_ID,
  storageBucket: process.env.FBS_STORAGE_BUCKET,
  messagingSenderId: process.env.FBS_MESSAGING_SENDER_ID,
  appId: process.env.FBS_APP_ID,
  measurementId: process.env.FBS_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app , process.env.FBS_STORAGE_URL);