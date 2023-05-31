import { User } from "firebase/auth";
import { query } from "firebase/database";
import { collection, doc, orderBy, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import UserIcon from "./UserIcon.tsx";

const MainChat = ({ user }: { user: User }) => {
  const firestore = useFirestore();
  const publicMessagesRef = collection(firestore, "publicMessages");
  const publicMessagesQueryResult = useFirestoreCollectionData<{
    uid: string;
    message: string;
    timestamp: number;
    userName: string;
  }>(query(publicMessagesRef, orderBy("timestamp", "asc")));
  const { status, data } = publicMessagesQueryResult;

  const [message, setMessage] = useState<string>("");

  const handleSubmit = async e => {
    e.preventDefault();
    await setDoc(doc(publicMessagesRef), {
      uid: user.uid,
      timestamp: Date.now(),
      message,
      userName: user.displayName ?? "",
    });
    setMessage("");
  };

  return (
    <div className='chatContainer relative bg-gray-500 w-full px-[100px] py-[50px]'>
      {(data ?? []).map(d => {
        const splittedName = (d.userName ?? "").split(" ");
        const firstLetter = splittedName[0]?.[0] ?? "";
        const secondLetter = splittedName?.[1]?.[0] ?? "";

        return (
          <div key={d.timestamp} className='singleMessageContainer flex mb-4'>
            <div className='pr-10'>
              <UserIcon
                isMe={d.uid === user.uid}
                name={{ firstLetter, secondLetter }}
              />
            </div>
            <div className='h-fit'>{d.message}</div>
          </div>
        );
      })}
      <div className='absolute bottom-[10%] left-[50%] bg-gray-600'>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='message'>Message:</label>
            <textarea
              className='text-gray-700'
              id='message'
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </div>
          <button
            className='hover:bg-gray-700 text-white py-2 px-4 rounded'
            type='submit'
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default MainChat;
