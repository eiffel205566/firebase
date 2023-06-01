import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { query } from "firebase/database";
import { useAuth, useFirestore, useFirestoreCollectionData } from "reactfire";
import { collection } from "firebase/firestore";
import MainChat from "../views/MainChat.tsx";
import { User } from "firebase/auth";
import PrivateChat from "../views/PrivateChat.tsx";
import "./HomePage.css";
import Panel from "../views/Panel.tsx";

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
  const otherName = (onlineUsersQueryResult?.data ?? []).find(
    d => d.uid === otherUid
  )?.userName;

  return (
    <div className='homePageContainer min-h-[100vh] min-w-[500px] w-full flex'>
      <div className='modalContainer min-w-[200px] bg-gray-800'>
        <div className='no-scrollbar fixed top-0 bottom-0 w-[200px] overflow-y-auto'>
          {user && <div>{`Hello, ${user.displayName}`}</div>}
          <button
            className='hover:bg-blue-700 text-white py-2 px-4 rounded'
            onClick={() => signOut(auth)}
          >
            Sign out
          </button>
          {otherUid != null && (
            <div
              className='text-white hover:text-green-300 cursor-pointer'
              onClick={() => navigate("/home")}
            >
              Back to Public Room
            </div>
          )}
          <br />

          <div>Chat With:</div>
          {(onlineUsersQueryResult?.data ?? []).map((d, index) => {
            const className = `max-w-[150px] truncate hover:text-green-300 cursor-pointer ${
              d.status === "online" ? "text-white" : "text-slate-300"
            }`;

            return (
              user.uid !== d.uid && (
                <div
                  onClick={() => navigate(`/home/${d.uid}`)}
                  className={className}
                  key={d.uid}
                >
                  {d.userName}
                </div>
              )
            );
          })}
        </div>
      </div>
      {otherUid && otherName ? (
        <PrivateChat user={user} otherUid={otherUid} otherName={otherName} />
      ) : (
        <MainChat user={user} />
      )}
    </div>
  );
};

export default HomePage;
