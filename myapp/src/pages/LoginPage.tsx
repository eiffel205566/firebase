import React from "react";
import { useAuth } from "reactfire";

import { useNavigate } from "react-router-dom";
import { signIn, signOut } from "../components/AppContent.tsx";

const LoginPage = ({ user, status }) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const isUserDefined = status === "success" && user != null;
  const isSigningIn = status === "loading" && user == null;
  const isSigningOut = status === "loading" && user != null;
  const message = isSigningIn
    ? "Signing in"
    : isSigningOut
    ? "Signing out"
    : `Click to Sign ${isUserDefined ? "Out" : "In"}`;

  return (
    <div title='Sign-in form'>
      <button
        onClick={() => {
          isUserDefined
            ? signOut(auth)
            : signIn(auth).then(() => navigate("/home"));
        }}
        disabled={status === "loading"}
      >
        {message}
      </button>
    </div>
  );
};

export default LoginPage;
