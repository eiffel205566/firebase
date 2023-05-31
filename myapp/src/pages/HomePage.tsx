import React from "react";
import { query } from "firebase/database";
import { useAuth, useFirestore, useFirestoreCollectionData } from "reactfire";
import { collection } from "firebase/firestore";
import MainChat from "../views/MainChat.tsx";
import { User } from "firebase/auth";

const HomePage = ({
  user,
  signOut,
}: {
  user: User;
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
          const className =
            d.status === "online" ? "text-white" : "text-slate-300";
          return (
            <div className={className} key={index}>
              {d.userName}
            </div>
          );
        })}
      </div>
      <MainChat user={user} />
    </div>
  );
};

export default HomePage;
