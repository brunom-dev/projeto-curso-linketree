
import {getFirestore} from "firebase/firestore"
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC3f4GR7cMegAiDt4KEwHF56LAbaZE9h_s",
  authDomain: "linktree-5f776.firebaseapp.com",
  projectId: "linktree-5f776",
  storageBucket: "linktree-5f776.appspot.com",
  messagingSenderId: "950769149053",
  appId: "1:950769149053:web:b89f19b4e661dbfa8ffd14"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

export {auth, db}