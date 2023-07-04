import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  onSnapshot,
  serverTimestamp,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyDDPGLkjYiDNIgvembAgzx2YrKmn8m96KY",
  authDomain: "first-code-74ad5.firebaseapp.com",
  projectId: "first-code-74ad5",
  storageBucket: "first-code-74ad5.appspot.com",
  messagingSenderId: "734728706649",
  appId: "1:734728706649:web:5c28e4ba34b257cd22ef48",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const signUp = document.querySelector("#signUp");
signUp.addEventListener("click", () => {
  document.querySelector(".signUpForm").style.display = "flex";
});
const signUpForm = document.querySelector(".signUpForm");
signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const signUpEmail = document.querySelector("#signUpEmail").value;
  const signUpPassword = document.querySelector("#signUpPassword").value;
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
      document.querySelector(".signUpForm").style.display = "none";
      e.target.reset();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(error);
      // ..
    });
});
const signIn = document.querySelector("#signIn");
signIn.addEventListener("click", () => {
  document.querySelector(".signInForm").style.display = "flex";
});
const signInForm = document.querySelector(".signInForm");
signInForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const signInEmail = document.querySelector("#signInEmail").value;
  const signInPassword = document.querySelector("#signInPassword").value;
  const auth = getAuth();
  signInWithEmailAndPassword(auth, signInEmail, signInPassword)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
      document.querySelector(".signInForm").style.display = "none";
      e.target.reset();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(error);
      // ..
    });
});

const form = document.querySelector("#form");
const todoList = document.querySelector("#todoList");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let formValue = document.querySelector("#formValue").value;
  try {
    const docRef = await addDoc(collection(db, "todo"), {
      value: formValue,
      createdAt: serverTimestamp(),
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }

  //   const article = document.createElement("article");
  //   const articleSpan = `<span>${formValue}</span>`;
  //   article.innerHTML = articleSpan;
  //   todoList.appendChild(article);
  e.target.reset();
});

window.addEventListener("load", () => {
  const q = query(collection(db, "todo"), orderBy("createdAt"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    todoList.innerHTML = "";
    querySnapshot.forEach((doc) => {
      //   console.log("todo: ", doc.data());
      const article = document.createElement("article");
      const articleSpan = `<div id='${doc.id}'><span>${doc.data().value}</span>
      <button id='deleteBtn'> Delete </button>
      <button id='editBtn'> Edit </button> </div>`;
      article.innerHTML = articleSpan;
      todoList.appendChild(article);

      article
        .querySelector("#deleteBtn")
        .addEventListener("click", () => deleteFunc(doc.id));
      article
        .querySelector("#editBtn")
        .addEventListener("click", (e) => editFunc(e, doc.id));
    });
  });
});

const deleteFunc = async (id) => {
  await deleteDoc(doc(db, "todo", id));
};
// const editFunc = (e, id) => {
//   document.querySelector(".popup").style.display = "block";

//   document.querySelector("#popupEditInput").value =
//     e.target.previousElementSibling.previousElementSibling.textContent;
//   document.querySelector(".popup").addEventListener("submit", async (e) => {
//     e.preventDefault();
//     console.log(e.target.edit);
//     await updateDoc(doc(db, "todo", id), {
//       value: e.target.edit.value,
//       //   value: e.target.firstChild.nextElementSibling.value,
//     });
//     document.querySelector(".popup").style.display = "none";
//   });
// };
const editFunc = (e, id) => {
  const onEditFormSubmit = async (e) => {
    e.preventDefault();
    const editedValue = popupForm.elements.edit.value;
    await updateDoc(doc(db, "todo", id), {
      value: editedValue,
    });
    document.querySelector(".popup").style.display = "none";
    popupForm.removeEventListener("submit", onEditFormSubmit);
  };
  document.querySelector(".popup").style.display = "block";

  document.querySelector("#popupEditInput").value =
    e.target.previousElementSibling.previousElementSibling.textContent;

  const popupForm = document.querySelector("#popup");

  popupForm.addEventListener("submit", onEditFormSubmit);
};
