import { User } from "firebase/auth";
import { query } from "firebase/database";
import { collection, doc, orderBy, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import UserIcon from "./UserIcon.tsx";

const PrivateChat = ({ user }: { user: User }) => {
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
    </div>
  );
};

export default PrivateChat;
