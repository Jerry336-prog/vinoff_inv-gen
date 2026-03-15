import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { app } from "../firebase";

// Firebase Auth
const auth = getAuth(app);

// Google provider
const provider = new GoogleAuthProvider();


// ------------------------
// Email/Password Sign Up
// ------------------------
export const signUp = async (email, password) => {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User created:", userCred.user);
    return userCred;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
};


// ------------------------
// Email/Password Sign In
// ------------------------
export const signIn = async (email, password) => {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    console.log("User signed in:", userCred.user);
    return userCred;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
};


// ------------------------
// Google Sign-In
// ------------------------
export const googleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("Google sign-in success:", result.user);
    return result;
  } catch (error) {
    console.error("Google sign-in error:", error.message);
    throw error;
  }
};
