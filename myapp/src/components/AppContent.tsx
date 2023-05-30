import React, { useEffect, useRef } from "react";
import { useSigninCheck, SigninCheckResult, useFirestore } from "reactfire";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  collection,
  doc,
  where,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { query } from "firebase/database";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useBeforeUnload,
} from "react-router-dom";

import HomePage from "../pages/HomePage.tsx";
import LoginPage from "../pages/LoginPage.tsx";

export const AppContent = () => {
  const { data: signInCheckResult, status } = useSigninCheck();
  const firestore = useFirestore();
  const onlineUsersRef = collection(firestore, "onlineUsers");
  const userAdditionRef = useRef(false);
  const { uid, displayName: userName } = signInCheckResult?.user ?? {};

  // add logged in user to db only once to ensure we can query all onlined users
  useEffect(() => {
    (async () => {
      if (!signInCheckResult?.user) return;

      const userQuery = query(
        collection(firestore, "onlineUsers"),
        where("uid", "==", uid ?? "")
      );
      const userQuerySnapshot = await getDocs(userQuery);

      if (userQuerySnapshot.empty && !userAdditionRef.current) {
        userAdditionRef.current = true;
        await setDoc(doc(onlineUsersRef, uid), {
          uid,
          userName,
        });
      }
    })();
  }, [signInCheckResult?.user]);

  // useBeforeUnload(
  //   React.useCallback(async () => {
  //     await deleteDoc(doc(onlineUsersRef));
  //   }, [onlineUsersRef])
  // );

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
