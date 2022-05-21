// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-app.js";
import {
    getAuth, createUserWithEmailAndPassword
    , signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup
} from  "https://www.gstatic.com/firebasejs/9.7.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAamtd96fvRhqgh6E5hDjh4Fa_I2sFmV-w",
  authDomain: "semillero-a4798.firebaseapp.com",
  projectId: "semillero-a4798",
  storageBucket: "semillero-a4798.appspot.com",
  messagingSenderId: "583002384093",
  appId: "1:583002384093:web:aa333e0443930996365d34"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const provider = new GoogleAuthProvider();

const createUser = async (email, password) => {
    const response = await createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            const user = userCredential.user;
            return { error: false, data: user }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            return { error: true, data: error }
        });

    return response;
}

const logIn = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            return { error: false, data: user }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            return { error: true, data: error }
        });
    return result;
}

const logInGoogle = async () => {
    
   const result = await signInWithPopup(auth, provider)
    .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    return {error:false,data:user};
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    return {error:true,data:error};
  });

  return result;
}

export { createUser, logIn, logInGoogle}