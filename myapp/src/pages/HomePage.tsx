import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { query } from "firebase/database";
import { useAuth, useFirestore, useFirestoreCollectionData } from "reactfire";
import { collection } from "firebase/firestore";
import MainChat from "../views/MainChat.tsx";
import { User } from "firebase/auth";
import PrivateChat from "../views/PrivateChat.tsx";
import "./HomePage.css";
import Exit from "../views/Exit.tsx";
import BurgerMenu from "../views/BurgerMenu.tsx";
import SlideIn from "../views/SlideIn.tsx";

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

  const [isOpen, setIsOpen] = useState(false);

  const renderUser = () =>
    (onlineUsersQueryResult?.data ?? []).map(d => {
      const className = `max-w-[150px] truncate hover:text-green-300 cursor-pointer ${
        d.status === "online" ? "text-white" : "text-slate-300"
      }`;

      return (
        user.uid !== d.uid && (
          <div
            onClick={() => navigate(`/private/${d.uid}`)}
            className={className}
            key={d.uid}
          >
            {d.userName}
          </div>
        )
      );
    });

  return (
    <>
      <BurgerMenu isOpen={isOpen} onClick={setIsOpen} />
      <SlideIn isOpen={isOpen}>
        {
          <div className='flex flex-col gap-2 p-1'>
            Chat With:
            {renderUser()}
            <div className='flex flex-col justify-center cursor-pointer'>
              <Exit className='fill-red-300 hover:fill-red-600' />
            </div>
          </div>
        }
      </SlideIn>
      <div className='homePageContainer min-h-[100vh] min-w-[500px] w-full flex'>
        <div className='modalContainer min-w-[200px] bg-gray-800 px-2'>
          <div className='no-scrollbar fixed top-0 bottom-0 w-[200px] overflow-y-auto'>
            {user && <div>{`Hello, ${user.displayName}`}</div>}

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
            {renderUser()}
          </div>

          <div className='fixed bottom-0 w-full flex z-2 bg-gray-800 px-4 gap-2 hover:cursor-pointer'>
            <div className='flex flex-col justify-center'>
              <Exit className='fill-red-300' />
            </div>
            <button
              className='hover:text-red-300 text-white py-2 rounded'
              onClick={() => signOut(auth)}
            >
              Sign out
            </button>
          </div>
        </div>
        {otherUid && otherName ? (
          <PrivateChat user={user} otherUid={otherUid} otherName={otherName} />
        ) : (
          <MainChat user={user} />
        )}
      </div>
    </>
  );
};

export default HomePage;
