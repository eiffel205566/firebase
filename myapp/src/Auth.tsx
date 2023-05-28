import * as React from 'react';
import { useAuth, useUser, SuspenseWithPerf, useSigninCheck } from 'reactfire';
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";

const signOut = auth => auth.signOut().then(() => console.log('signed out'));
const signIn = async auth => {
  const provider = new GoogleAuthProvider();

  await signInWithPopup(auth, provider);
}

export const AuthWrapper = ({ children, fallback }: React.PropsWithChildren<{ fallback: JSX.Element }>): JSX.Element => {
  const { data: signInCheckResult } = useSigninCheck();

  if (!children) {
    throw new Error('Children must be provided');
  }

  if (signInCheckResult && signInCheckResult.signedIn === true) {
    return children as JSX.Element;
  } else {
    return fallback;
  }
};

const UserDetails = () => {
  const auth = useAuth();
  const {data: user} = useUser();

  return (
    <>
      <div title="Displayname">{(user as User).displayName}</div>
      <div title="Providers">
        <ul>
          {(user as User).providerData?.map(profile => (
            <li key={profile?.providerId}>{profile?.providerId}</li>
          ))}
        </ul>
      </div>
      <div title="Sign Out">
        <button onClick={() => signOut(auth)} >
          Sign out
        </button>
      </div>
    </>
  );
};

const SignInForm = () => {
  const auth = useAuth();

  return (
    <div title="Sign-in form">
      <button onClick={() => signIn(auth)} >
        Sign in
      </button>
    </div>
  );
};

export const Auth = () => {
  return (
    <SuspenseWithPerf traceId={'firebase-user-wait'} fallback={<Loading/>}>
      <AuthWrapper fallback={<SignInForm />}>
        <UserDetails />
      </AuthWrapper>
    </SuspenseWithPerf>
  );
};

const Loading = (): React.JSX.Element => <div>Loading..</div>