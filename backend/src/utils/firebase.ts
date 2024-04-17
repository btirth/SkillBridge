import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBJ4iD8lMXVyQILMjXd79IsY404gHmqLUY",
  authDomain: "skill-bridge-905b8.firebaseapp.com",
  databaseURL: "https://skill-bridge-905b8-default-rtdb.firebaseio.com",
  projectId: "skill-bridge-905b8",
  storageBucket: "skill-bridge-905b8.appspot.com",
  messagingSenderId: "431956378344",
  appId: "1:431956378344:web:1463518599f2353988bf5d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
