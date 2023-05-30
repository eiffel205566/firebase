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
    <div className='h-full w-full background-grey' title='Sign Out'>
      {user && <div>{`Hello, ${user.displayName}`}</div>}
      <button
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        onClick={() => signOut(auth)}
      >
        Sign out
      </button>
      {(onlineUsersQueryResult?.data ?? []).map((d, index) => (
        <div key={index}>{d.userName}</div>
      ))}
    </div>
  );
};

export default HomePage;
