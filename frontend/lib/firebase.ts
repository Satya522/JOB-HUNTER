import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  FacebookAuthProvider,
  OAuthProvider // Microsoft ke liye
} from "firebase/auth";

// DHYAN DEIN: Jab aap Firebase par account banayenge, 
// toh wahan se aapko apni asli details copy karke yahan daalni hongi.
// Abhi ke liye aap isko aise hi paste kar sakte hain.
const firebaseConfig = {
  apiKey: "AIzaSyDI4JPMdONR4gOd2WBA19cazC_D109oopo",
  authDomain: "ai-job-hunter-c9138.firebaseapp.com",
  projectId: "ai-job-hunter-c9138",
  storageBucket: "ai-job-hunter-c9138.firebasestorage.app",
  messagingSenderId: "835961039302",
  appId: "1:835961039302:web:ea16a362fa9a768662eac7"
};

// SSR safe initialization
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Providers setup
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const microsoftProvider = new OAuthProvider('microsoft.com');

export { auth, googleProvider, githubProvider, facebookProvider, microsoftProvider };