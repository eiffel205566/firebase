import React from "react";
import { useAuth } from "reactfire";

import { Navigate } from "react-router-dom";
import { signIn } from "../components/AppContent.tsx";

const LoginPage = ({ user, status }) => {
  const auth = useAuth();
  const isUserDefined = status === "success" && user != null;
  const isSigningIn = status === "loading" && user == null;
  const isSigningOut = status === "loading" && user != null;
  const message = isSigningIn
    ? "Signing in"
    : isSigningOut
    ? "Signing out"
    : `Click to Sign ${isUserDefined ? "Out" : "In"}`;

  if (isUserDefined) {
    return <Navigate to='/home' replace />;
  } else {
    return (
      <div title='Sign-in form'>
        <button
          onClick={() => {
            signIn(auth);
          }}
          disabled={status === "loading"}
        >
          {message}
        </button>
      </div>
    );
  }
};

export default LoginPage;
