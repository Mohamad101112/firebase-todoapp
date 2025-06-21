import { db , doc , addDoc , setDoc , collection ,  getDocs , deleteDoc} from "./firebase.js";
import {user} from './index.js';



const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');
const modal = document.querySelector('.modal');



export function Addtodo() {

addBtn.addEventListener('click', async () => {
    try {


  if(user) {
    const task = input.value.trim();
    if (task === '') return;
      addBtn.innerHTML = `<div class="loader"></div>`;
      await writeTodos(task);
      addBtn.innerHTML = `Add`;
      const li = document.createElement('li');
      console.log('hi2');
      li.innerHTML = `
        <span>${task}</span>
        <button class="delete-btn">✖</button>
      `;
    
      li.addEventListener('click', () => {  
        li.classList.toggle('done');
      });
    
      li.querySelector('.delete-btn').addEventListener('click', async (e) => {
        e.stopPropagation(); // Prevent triggering the line-through
        li.remove();
        await deleteTodo(doc.id, li);

      });
    
      list.appendChild(li);
      input.value = '';      
  }else{
    // setInterval(() => {
    //     list.innerHTML = "login in or sign up first";

    // },2000)
    // list.innerHTML = ``;
    modal.classList.remove('hide');

  }
    } catch (error) {
        console.log(error.message)
        addBtn.innerHTML = "Add";
    }
  
}); 

}

export async function renderTodosFromFirebase() {
// get the docs
list.innerHTML = `<div class="loader"></div>`;

const querySnapshot = await getDocs(collection(db, "users" , user.uid , "todos"));
list.innerHTML = ``;
querySnapshot.forEach((doc) => {
  console.log(`${doc.id} => ${doc.data().todo}`);
  const task = doc.data().todo;

  const li = document.createElement('li');
  li.innerHTML = `
    <span>${task}</span>
    <button class="delete-btn">✖</button>
  `;

  li.addEventListener('click', () => {  
    li.classList.toggle('done');
  });

  li.querySelector('.delete-btn').addEventListener('click', async (e) => {
    e.stopPropagation(); // Prevent triggering the line-through
    li.innerHTML = `<div class="loader"></div>`;
    await deleteTodo(doc.id, li);
    li.remove();
    console.log(doc.id)
  });

  list.appendChild(li);
  input.value = '';
});



}

async function writeTodos(task) {
    // write to db
    console.log('hi ' , task)
    const docRef = doc(collection(db , "users" , user.uid , "todos"));
    console.log(doc)
    await setDoc(docRef,{
        todo: task
    });

}


export async function deleteTodo(docId, listItemElement) {
    try {
      if (!user) throw new Error("User not authenticated");
  
      // 1. Delete from Firestore
      const todoRef = doc(db, "users", user.uid, "todos", docId);
      await deleteDoc(todoRef);
  
      // 2. Remove from UI
      listItemElement.remove();
    } catch (err) {
      console.error("Failed to delete todo:", err);
    }
  }
