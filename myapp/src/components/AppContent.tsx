import React from "react";
import { useSigninCheck, SigninCheckResult } from "reactfire";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import HomePage from "../pages/HomePage.tsx";
import LoginPage from "../pages/LoginPage.tsx";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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

export const signOut = auth =>
  auth.signOut().then(() => console.log("signed out"));
export const signIn = async auth => {
  const provider = new GoogleAuthProvider();

  await signInWithPopup(auth, provider);
};
