import { auth, createUserWithEmailAndPassword , signInWithEmailAndPassword , onAuthStateChanged , signOut, sendEmailVerification , 
    db , doc, addDoc, setDoc ,collection} from "./firebase.js";
import { Addtodo , renderTodosFromFirebase } from "./todo.js";

window.doc = doc;
window.setDoc = setDoc;
window.db = db;


const loginbtn = document.querySelector('.login');
const modal = document.querySelector('.modal');
const backdrop = document.querySelector('.backdrop');
const Form = document.getElementById('login-form');
const LoginLink = document.querySelector('.login-link');
const loginRegisterText = document.querySelectorAll('.lr');
const bottomLink = document.querySelector('.bottomLink');
const userNav = document.querySelector('.user');
const logout = document.querySelector('.logout');
const loggedIn = document.querySelector('.loggedIn');
const msg = document.querySelector('.msg');
const submit = document.querySelector('.submit');
const navLoad = document.querySelector('.navLoad');



let isSignUp = true;
export let user;

Addtodo();






loginbtn.addEventListener("click" , () => {
    // console.log(h)
    modal.classList.remove('hide');
    msg.innerHTML = ``;
});

backdrop.addEventListener("click" , () => {
    modal.classList.add('hide');
})

LoginLink.addEventListener("click" , toggleLoginRegister)

function toggleLoginRegister() {
    // e.preventDefault();
    msg.innerHTML = ``;


    isSignUp = !isSignUp;
    loginRegisterText.forEach((e) => {
        e.innerHTML = isSignUp ? 'Register' : 'Login';
    });

    bottomLink.innerHTML = isSignUp
        ? `Already Registered ? <a href="#" class="login-link">Login</a>`
        : `Don't have an account ? <a href="#" class="login-link">Register</a>`;

    // 🧠 Reattach listener to the new link
    const newLoginLink = document.querySelector('.login-link');
    newLoginLink.addEventListener('click', toggleLoginRegister);
}

async function signUpUser() {
    try {
        submit.innerHTML = `<div class="loader"></div>`;

        const { email, password } = getCredentials();
        const userCredential = await createUserWithEmailAndPassword(auth , email , password);
        const actionCodeSettings = {
            url: 'http://127.0.0.1:5500/index.html',
            handleCodeInApp: false  // we are NOT handling the code in the app, just redirecting
        };

        await sendEmailVerification(auth.currentUser, actionCodeSettings);
        modal.classList.add('hide'); // Hides the modal
        Form.reset();  
        window.location.href = `/vertify.html`;
        msg.innerHTML = `Email Vertification Sent!`     
        return userCredential.user;
    } catch (error) {
        submit.innerHTML = `Register`;
        console.log(error);
        console.log("hahaha");
        msg.innerHTML = error.code;
        }
}

async function loginUser() {
    try {
        submit.innerHTML = `<div class="loader"></div>`;
        const { email, password } = getCredentials();
        await signInWithEmailAndPassword(auth , email , password);
        modal.classList.add('hide'); // Hides the modal
        Form.reset();       
        return userCredential.user;
    } catch (error) {
        submit.innerHTML = `login`;
        console.log(error);
        console.log("hahaha");
        msg.innerHTML = error.code;
        }
}

async function handlLoginAndSignUp() {
    if(isSignUp){
        user = await signUpUser();
        console.log(user);
        submit.innerHTML = `Register`;
        // updateUIOnLogin();
    }else {
        await loginUser();
        submit.innerHTML = `login`;
    }
}

function getCredentials() {
    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value;
    return { email, password };
}

Form.addEventListener('submit', (e) => {
    e.preventDefault(); // prevent reload
    msg.innerHTML = '';
    handlLoginAndSignUp();
    
});


export async function updateUIOnLogin() {
    loginbtn.classList.add('hide');
    userNav.innerHTML = ` Hello - ${user.email}`;
    logout.classList.remove('hide');
    loggedIn.classList.remove('hide');
    await renderTodosFromFirebase()
}

export function updateUIOnLogout() {
    userNav.innerHTML = ``;
    loginbtn.classList.remove('hide');
    logout.classList.add('hide');
    loggedIn.classList.add('hide');
    const list = document.getElementById('todo-list');
    list.innerHTML = ``;
}

async function logoutUser() {
    try {
      await signOut(auth);
      user = null;          // clear your global user variable
      updateUIOnLogout();   // update the UI accordingly
      // alert('Logged out successfully!');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

logout.addEventListener("click" ,async () => {
    logoutUser();
})


// const btn = document.querySelector('.btn');

// btn.addEventListener("click" , async () => {

//     const todosRef = collection(db, "users", user.uid, "todos");

//     // Add a new todo document with auto-generated ID
//     await addDoc(todosRef, {
//     title: "Finish homework",
//     completed: false,
//     createdAt: Date.now(), // or use serverTimestamp()
//     });
    
//     console.log(user.uid);
// })




onAuthStateChanged(auth, async (firebaseUser) => {
    user = firebaseUser;
    console.log(user)
    await user?.reload();
    navLoad.classList.add('loader');
    if (user?.emailVerified) {
      // ✅ User is signed in
      navLoad.classList.remove('loader');
      updateUIOnLogin();
    } else {
      // 🚪 User is signed out
      navLoad.classList.remove('loader');
      updateUIOnLogout();
    }
  });