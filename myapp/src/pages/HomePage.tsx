import { v4 } from "uuid";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { query } from "firebase/database";
import { useAuth, useFirestore, useFirestoreCollectionData } from "reactfire";
import { collection, doc, setDoc } from "firebase/firestore";
import MainChat from "../views/MainChat.tsx";
import { User } from "firebase/auth";
import PrivateChat from "../views/PrivateChat.tsx";
import "./HomePage.css";
import Exit from "../views/Exit.tsx";
import BurgerMenu from "../views/BurgerMenu.tsx";
import SlideIn from "../views/SlideIn.tsx";
import Chevron from "../views/Chevron.tsx";
import RoomChat from "../views/RoomChat.tsx";
import UserIcon from "../views/User.tsx";
import ChatRoom from "../views/ChatRoom.tsx";
import AddRoom from "../views/AddRoom.tsx";
import BackToPublic from "../views/BackToPublic.tsx";

const HomePage = ({
  user,
  signOut,
}: {
  user: User;
  signOut: (auth: ReturnType<typeof useAuth>) => void;
}): React.ReactElement => {
  const navigate = useNavigate();
  const { uid: otherUid, roomId } = useParams();
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

  const roomMessagesRef = collection(firestore, "rooms");
  const roomMessagesQuery = query(roomMessagesRef);
  const roomMessagesQueryResult = useFirestoreCollectionData(roomMessagesQuery);

  const createRoom = async () => {
    if (roomName == null || roomName === "") return;
    await setDoc(doc(roomMessagesRef), {
      messages: [],
      creatorId: user.uid,
      roomName: roomName,
    });
    setIsAddRoom(false);
    setRoomName("");
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isAddRoom, setIsAddRoom] = useState(false);
  const [roomName, setRoomName] = useState("");

  const renderUser = () =>
    (onlineUsersQueryResult?.data ?? []).map(d => {
      const className = `max-w-[180px] truncate hover:text-green-300 cursor-pointer ${
        d.status === "online" ? "text-[#d9d9d9]" : "text-slate-300"
      }`;

      return (
        user.uid !== d.uid && (
          <div className='flex gap-1'>
            <UserIcon
              className={`fill-${d.status === "online" ? "green" : "gray"}-300`}
              width={24}
              height={24}
            />
            <div
              onClick={() => navigate(`/private/${d.uid}`)}
              className={className}
              key={v4()}
            >
              {d.userName}
            </div>
          </div>
        )
      );
    });
  const renderRoom = () =>
    (roomMessagesQueryResult.data ?? []).map(room => (
      <div className='flex gap-2'>
        <ChatRoom className='fill-green-300' width={24} height={24} />
        <div
          className='cursor-pointer hover:text-green-300 truncate'
          onClick={() => navigate(`/rooms/${room.NO_ID_FIELD}`)}
          key={v4()}
        >
          {room.roomName ?? room.NO_ID_FIELD}
        </div>
      </div>
    ));

  // TODO: update the JSX
  return (
    <>
      <BurgerMenu isOpen={isOpen} onClick={setIsOpen} />
      <SlideIn isOpen={isOpen}>
        {
          <div className='flex flex-col gap-2 p-1'>
            Chat With:
            {renderUser()}
            <div className='border' />
            <div
              className='text-white hover:text-green-300 cursor-pointer'
              onClick={() => navigate("/home")}
            >
              To Public
            </div>
            <div className='border' />
            Join Room:
            {renderRoom()}
            <div className='flex flex-col justify-center cursor-pointer'>
              <Exit
                onClick={() => signOut(auth)}
                className='fill-red-300 hover:fill-red-600'
              />
            </div>
          </div>
        }
      </SlideIn>
      <div className='homePageContainer min-h-[100vh] min-w-[500px] w-full flex'>
        <div className='modalContainer min-w-[200px] bg-gray-800 px-2'>
          <div className='no-scrollbar fixed top-0 bottom-0 w-[200px] overflow-y-auto'>
            {user && <div>{`Hello, ${user.displayName}`}</div>}
            {(otherUid != null || roomId != null) && (
              <div className='flex gap-2'>
                <BackToPublic className='fill-green-300' />
                <div
                  className='text-[#d9d9d9] hover:text-green-300 cursor-pointer'
                  onClick={() => navigate("/home")}
                >
                  Back to Public Room
                </div>
              </div>
            )}
            <br />
            <div className='flex gap-2'>
              <AddRoom className='fill-green-300' />
              <div
                className='cursor-pointer hover:text-green-300'
                onClick={() => setIsAddRoom(true)}
              >
                Create A Room
              </div>
            </div>
            {isAddRoom && (
              <div>
                <input
                  className='relative bg-gray-500 rounded-lg focus:outline-none p-1 overflow-y-hidden max-w-[150px]'
                  onChange={e => {
                    setRoomName(e.target.value);
                    if (e.target.value == null || e.target.value === "") {
                      setIsAddRoom(false);
                    }
                  }}
                  value={roomName}
                />
                {roomName && (
                  <Chevron
                    onClick={createRoom}
                    className='absolute cursor-pointer fill-green-300 hover:fill-green-500 translate-y-[-26px] translate-x-[120px]'
                  />
                )}
              </div>
            )}
            <br />
            Rooms:
            {renderRoom()}
            <br />
            <br />
            <div>Chat With:</div>
            {renderUser()}
          </div>

          <div className='fixed bottom-0 w-full flex z-2 bg-gray-800 px-4 gap-2 hover:cursor-pointer'>
            <div className='flex flex-col justify-center'>
              <Exit className='fill-red-300' />
            </div>
            <button
              className='hover:text-red-300 text-[#d9d9d9] py-2 rounded'
              onClick={() => signOut(auth)}
            >
              Sign out
            </button>
          </div>
        </div>
        {/* // TODO: going forward definitely do not use HomePage to manage following */}
        {roomId ? (
          <RoomChat user={user} roomId={roomId} />
        ) : otherUid && otherName ? (
          <PrivateChat user={user} otherUid={otherUid} otherName={otherName} />
        ) : (
          <MainChat user={user} />
        )}
      </div>
    </>
  );
};

export default HomePage;
