import React from "react";
import { useAuth } from "reactfire";

import { Navigate } from "react-router-dom";
import { signIn } from "../components/AppContent.tsx";
import login from "../views/login.jpg";
import Letter from "../views/Letter.js";

const LoginPage = ({ user, status }) => {
  const auth = useAuth();
  const isUserDefined = status === "success" && user != null;

  if (isUserDefined) {
    return <Navigate to='/home' replace />;
  } else {
    return (
      <div className='loginPage h-full w-full'>
        <img className='absolute h-full w-full blur-sm' src={login} />
        <div className='h-full w-full flex justify-center'>
          <button
            className='z-10'
            onClick={() => {
              signIn(auth);
            }}
            disabled={status === "loading"}
          >
            Click Here to Sign In ChatRoom
          </button>
        </div>
      </div>
    );
  }
};

export default LoginPage;
