import React from "react";
import {
  useAuth,
  useUser,
  SuspenseWithPerf,
  useSigninCheck,
  SigninCheckResult,
} from "reactfire";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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
              <Home user={signInCheckResult?.user} />
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

const Home = ({
  user,
}: {
  user?: SigninCheckResult["user"];
}): React.ReactElement => {
  const auth = useAuth();

  return (
    <div title='Sign Out'>
      <button onClick={() => signOut(auth)}>Sign out</button>
    </div>
  );
};
const LoginPage = ({ user, status }) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const isUserDefined = status === "success" && user != null;

  return (
    <div title='Sign-in form'>
      <button
        onClick={() => {
          isUserDefined
            ? signOut(auth)
            : signIn(auth).then(() => navigate("/home"));
        }}
      >
        {`Click to Sign ${isUserDefined ? "Out" : "In"}`}
      </button>
    </div>
  );
};

const signOut = auth => auth.signOut().then(() => console.log("signed out"));
const signIn = async auth => {
  const provider = new GoogleAuthProvider();

  await signInWithPopup(auth, provider);
};
