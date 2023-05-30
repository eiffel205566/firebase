import React from "react";
import { query } from "firebase/database";
import {
  useAuth,
  SigninCheckResult,
  useFirestore,
  useFirestoreCollectionData,
} from "reactfire";
import { collection } from "firebase/firestore";
import MainChat from "../views/MainChat.tsx";

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
  const onlineUsersQueryResult = useFirestoreCollectionData<{
    uid: string;
    userName: string;
    status: "online" | "offline";
  }>(onlineUsersQuery);

  return (
    <div className='homePageContainer h-full w-full flex' title='Sign Out'>
      <div className='modalContainer w-[200px] bg-gray-800'>
        {user && <div>{`Hello, ${user.displayName}`}</div>}
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          onClick={() => signOut(auth)}
        >
          Sign out
        </button>
        <div>Online Users</div>
        <br />
        {(onlineUsersQueryResult?.data ?? []).map((d, index) => {
          return d.status === "online" ? (
            <div key={index}>{d.userName}</div>
          ) : null;
        })}
      </div>
      <MainChat />
    </div>
  );
};

export default HomePage;
