import React from "react";
import { useAuth, useSigninCheck, SigninCheckResult } from "reactfire";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import HomePage from "../pages/HomePage";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

export const AppContent = () => {
  const { data: signInCheckResult, status } = useSigninCheck();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={<LoginPage user={signInCheckResult?.user} status={status} />}
        />
        <Route
          path='/home'
          element={
            <ProtectedRoute user={signInCheckResult?.user} status={status}>
              <HomePage user={signInCheckResult?.user} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

const ProtectedRoute = ({
  user,
  children,
  status,
}: {
  user: SigninCheckResult["user"];
  children: React.ReactElement;
  status: "loading" | "error" | "success";
}) => {
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to='/' replace />;
  }

  return children;
};

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

export const signOut = auth =>
  auth.signOut().then(() => console.log("signed out"));
const signIn = async auth => {
  const provider = new GoogleAuthProvider();

  await signInWithPopup(auth, provider);
};
