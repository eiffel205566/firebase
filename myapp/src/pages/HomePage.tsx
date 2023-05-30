import React from "react";
import { query } from "firebase/database";
import {
  useAuth,
  SigninCheckResult,
  useFirestore,
  useFirestoreCollectionData,
} from "reactfire";
import { collection } from "firebase/firestore";

const HomePage = ({
  user,
  signOut,
}: {
  user?: SigninCheckResult["user"];
  signOut: (auth: ReturnType<typeof useAuth>) => void;
}): React.ReactElement => {
  const auth = useAuth();
  const firestore = useFirestore();
  const onlineUsersRef = collection(firestore, "onlineUsers");
  const onlineUsersQuery = query(onlineUsersRef);
  const onlineUsersQueryResult = useFirestoreCollectionData(onlineUsersQuery);

  return (
    <div title='Sign Out'>
      {user && <div>{`Hello, ${user.displayName}`}</div>}
      <button onClick={() => signOut(auth)}>Sign out</button>
      {(onlineUsersQueryResult?.data ?? []).map((d, index) => (
        <div key={index}>{d.userName}</div>
      ))}
    </div>
  );
};

export default HomePage;
