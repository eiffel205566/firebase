import React, { useEffect, useState, useRef } from "react";
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  push,
  set,
  increment as rtdbIncrement,
} from "firebase/database";
import {
  useAuth,
  useSigninCheck,
  SigninCheckResult,
  useFirestore,
  useFirestoreDocData,
  useDatabase,
  useDatabaseListData,
  useFirestoreCollectionData,
} from "reactfire";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  collection,
  doc,
  where,
  getFirestore,
  orderBy,
  getDocs,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { signOut } from "../components/AppContent.tsx";

const HomePage = ({
  user,
}: {
  user?: SigninCheckResult["user"];
}): React.ReactElement => {
  const auth = useAuth();
  const firestore = useFirestore();
  const onlineUsersRef = collection(firestore, "onlineUsers");
  const onlineUsersQuery = query(onlineUsersRef);
  const onlineUsersQueryResult = useFirestoreCollectionData(onlineUsersQuery);

  const [isUserLoggedIn, setUserLoggedIn] = useState(false);
  const userAdditionRef = useRef(false);

  // add logged in user to db only once to ensure we can query all onlined users
  useEffect(() => {
    (async () => {
      const userQuery = query(
        collection(firestore, "onlineUsers"),
        where("uid", "==", user?.uid ?? "")
      );
      const userQuerySnapshot = await getDocs(userQuery);

      if (userQuerySnapshot.empty && !userAdditionRef.current) {
        userAdditionRef.current = true;
        const { uid, displayName: userName } = user ?? {};
        await setDoc(doc(onlineUsersRef), {
          uid,
          userName,
        });
      }
      setUserLoggedIn(true);
    })();
  }, []);

  if (!isUserLoggedIn || onlineUsersQueryResult.status === "loading")
    return <>Loading...</>;

  return (
    <div title='Sign Out'>
      {user && <div>{`Hello, ${user.displayName}`}</div>}
      <button onClick={() => signOut(auth)}>Sign out</button>
      {onlineUsersQueryResult.data.map((d, index) => (
        <div key={index}>{d.userName}</div>
      ))}
    </div>
  );
};

export default HomePage;
