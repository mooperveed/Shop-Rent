import { initializeApp } from "@firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBVUxfx_QtLPzlV2n9cu_t2bFC1aaPWLao",
  authDomain: "todo-app-95485.firebaseapp.com",
  projectId: "todo-app-95485",
  storageBucket: "todo-app-95485.appspot.com",
  messagingSenderId: "888414820480",
  appId: "1:888414820480:web:036067527696edaf6a2e65"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
