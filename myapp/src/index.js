import { FirebaseAppProvider } from "reactfire";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const firebaseConfig = {
  apiKey: "AIzaSyDqfbPmzqrOXOJ8uExsvR4LEuWeRHPxdUQ",
  authDomain: "nnnn-5269d.firebaseapp.com",
  projectId: "nnnn-5269d",
  storageBucket: "nnnn-5269d.appspot.com",
  messagingSenderId: "1013498764474",
  appId: "1:1013498764474:web:0c41e0c52ac5055bc8f683",
  measurementId: "G-DFCPW7L211",
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </FirebaseAppProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
