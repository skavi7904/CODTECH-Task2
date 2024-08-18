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
  apiKey: "AIzaSyCclfXYabSu979d__RT9SdEOnt25W8niZg",
  authDomain: "blogwebsite-8efb5.firebaseapp.com",
  projectId: "blogwebsite-8efb5",
  storageBucket: "blogwebsite-8efb5.appspot.com",
  messagingSenderId: "795826317703",
  appId: "1:795826317703:web:73a3ad1259f2a4a8820b22",
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