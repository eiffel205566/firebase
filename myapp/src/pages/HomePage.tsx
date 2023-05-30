import React, { useEffect } from "react";
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
  getFirestore,
  orderBy,
  setDoc,
} from "firebase/firestore";
import { signOut } from "../components/AppContent";

const HomePage = ({
  user,
}: {
  user?: SigninCheckResult["user"];
}): React.ReactElement => {
  const database = useDatabase();
  const auth = useAuth();
  const firestore = useFirestore();
  const userCollection = collection(firestore, "onlineUsers");
  const usersQuery = query(userCollection);
  const queryResult = useFirestoreCollectionData(usersQuery);
  console.log(user);

  // const ref = firestore().collection("usersOnline");
  // const query = ref.orderBy("uid");

  // console.log(collection(firestore, "usersOnline"));
  const userCollectionref = collection(firestore, "onlineUsers");
  const addUser = async () => {
    await setDoc(doc(userCollectionref), {
      uid: "newUser2",
      userName: "name-newUser2",
    });
  };

  return (
    <div title='Sign Out'>
      {user && <div>{`Hello, ${user.displayName}`}</div>}
      <button onClick={() => signOut(auth)}>Sign out</button>
      <button onClick={() => addUser()}>add user</button>
      {queryResult.status === "success" &&
        queryResult.data.map((d, index) => <div key={index}>{d.userName}</div>)}
    </div>
  );
};

export default HomePage;
