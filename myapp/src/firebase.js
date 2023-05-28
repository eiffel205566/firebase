// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDqfbPmzqrOXOJ8uExsvR4LEuWeRHPxdUQ",

  authDomain: "nnnn-5269d.firebaseapp.com",

  projectId: "nnnn-5269d",

  storageBucket: "nnnn-5269d.appspot.com",

  messagingSenderId: "1013498764474",

  appId: "1:1013498764474:web:0c41e0c52ac5055bc8f683",

  measurementId: "G-DFCPW7L211",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
