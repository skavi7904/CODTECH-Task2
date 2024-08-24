import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { addDoc,onSnapshot,getFirestore,deleteDoc,collection,doc,setDoc ,getDocs,getDoc,query,where} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
let firebaseConfig = {
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let db = getFirestore(app);
let auth = getAuth(app);
const provider = new GoogleAuthProvider();
const logoutUser = () => {
  auth.signOut();
  location.reload();
}
export {
  db,logoutUser,deleteDoc,
  collection,query,where,
  doc,
  setDoc,
  getDocs,
  getDoc,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,auth,provider,
  onAuthStateChanged,onSnapshot,addDoc
};
