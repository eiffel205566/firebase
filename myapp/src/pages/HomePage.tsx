import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { query } from "firebase/database";
import { useAuth, useFirestore, useFirestoreCollectionData } from "reactfire";
import { collection } from "firebase/firestore";
import MainChat from "../views/MainChat.tsx";
import { User } from "firebase/auth";
import PrivateChat from "../views/PrivateChat.tsx";

const HomePage = ({
  user,
  signOut,
}: {
  user: User;
  signOut: (auth: ReturnType<typeof useAuth>) => void;
}): React.ReactElement => {
  const navigate = useNavigate();
  const { uid: otherUid } = useParams();
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
    <div className='homePageContainer min-h-[100vh] w-full flex'>
      <div className='modalContainer min-w-[200px] bg-gray-800 p-4'>
        <div className='fixed top-0'>
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
            const className = `hover:text-green-300 cursor-pointer ${
              d.status === "online" ? "text-white" : "text-slate-300"
            }`;

            return (
              user.uid !== d.uid && (
                <div
                  onClick={() => navigate(`/home/${d.uid}`)}
                  className={className}
                  key={index}
                >
                  {d.userName}
                </div>
              )
            );
          })}
        </div>
      </div>
      {otherUid ? <PrivateChat user={user} /> : <MainChat user={user} />}
    </div>
  );
};

export default HomePage;
