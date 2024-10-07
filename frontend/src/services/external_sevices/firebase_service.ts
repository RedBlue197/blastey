// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBusw6p1xYB74w7LOpoUJoieTP6CUa9fg0",
  authDomain: "blastey-d8c4c.firebaseapp.com",
  projectId: "blastey-d8c4c",
  storageBucket: "blastey-d8c4c.appspot.com",
  messagingSenderId: "30891756068",
  appId: "1:30891756068:web:626b545b478ba0195426b1",
  measurementId: "G-QYXT8DF8N8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);