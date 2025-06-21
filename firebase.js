import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js';
import { getAuth , createUserWithEmailAndPassword , signInWithEmailAndPassword , onAuthStateChanged , signOut, sendEmailVerification} from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';
import { getFirestore , doc , setDoc , addDoc , collection , getDocs , deleteDoc } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js'
import {updateUIOnLogin , updateUIOnLogout} from './index.js';

const firebaseConfig = {
    apiKey: "AIzaSyBbIQhofI7BrJJCvK87oFV6HyIJPs0qat0",
    authDomain: "todo-app-js-64f71.firebaseapp.com",
    projectId: "todo-app-js-64f71",
    storageBucket: "todo-app-js-64f71.firebasestorage.app",
    messagingSenderId: "1031300400368",
    appId: "1:1031300400368:web:78cbc854dda74863cc2e35"
  };
  

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);




export {app , auth , createUserWithEmailAndPassword , signInWithEmailAndPassword , onAuthStateChanged ,
   signOut, sendEmailVerification , doc , addDoc, setDoc , db , collection , getDocs , deleteDoc};