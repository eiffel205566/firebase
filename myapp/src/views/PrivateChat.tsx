import { User } from "firebase/auth";
import { query } from "firebase/database";
import {
  collection,
  doc,
  orderBy,
  setDoc,
  where,
  or,
  and,
  updateDoc,
} from "firebase/firestore";
import React, { useState } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import UserIcon from "./UserIcon.tsx";

const PrivateChat = ({
  user,
  otherUid,
  otherName,
}: {
  user: User;
  otherUid: string;
  otherName: string;
}) => {
  const [message, setMessage] = useState<string>("");
  const firestore = useFirestore();
  const privateMessagesRef = collection(firestore, "privateMessages");
  const privateMessagesQueryResult = useFirestoreCollectionData<{
    NO_ID_FIELD: string;
    messages: Array<{ message: string; timestamp: number; uid: string }>;
    participants: string[];
  }>(
    query(
      privateMessagesRef,
      or(
        where("participants", "in", [[otherUid, user.uid]]),
        where("participants", "in", [[user.uid, otherUid]])
      )
    )
  );
  const { status, data } = privateMessagesQueryResult;
  const chatId = (data ?? [])[0]?.NO_ID_FIELD;
  const currentMessages = (data ?? [])[0]?.messages ?? [];
  const isSubmitDisabled =
    status === "loading" || message === "" || message == null || chatId == null;

  const handleSubmit = async e => {
    if (isSubmitDisabled) {
      return;
    }
    e.preventDefault();

    if (!chatId) {
      await setDoc(doc(privateMessagesRef), {
        participants: [user.uid, otherUid],
        messages: [
          {
            uid: user.uid,
            message,
            timestamp: Date.now(),
          },
        ],
      });
    } else {
      await updateDoc(doc(privateMessagesRef, chatId), {
        ...data,
        messages: [
          ...currentMessages,
          { uid: user.uid, message, timestamp: Date.now() },
        ],
      });
    }
    setMessage("");
  };

  console.log(privateMessagesQueryResult);

  const buttonClass = `hover:bg-gray-700 text-white py-2 px-4 rounded ${
    isSubmitDisabled ? "cursor-not-allowed" : ""
  }`;

  return (
    <div className='chatContainer relative bg-gray-500 w-full px-[100px] py-[50px]'>
      {currentMessages.map(message => {
        const personName =
          message.uid === user.uid ? user.displayName : otherName;

        const splittedName = (personName ?? "").split(" ");
        const firstLetter = splittedName[0]?.[0] ?? "";
        const secondLetter = splittedName?.[1]?.[0] ?? "";

        return (
          <div
            key={message.timestamp}
            className='singleMessageContainer flex mb-4'
          >
            <div className='pr-10'>
              <UserIcon
                isMe={message.uid === user.uid}
                name={{ firstLetter, secondLetter }}
              />
            </div>
            <div className='h-fit'>{message.message}</div>
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
            className={buttonClass}
            type='submit'
            disabled={isSubmitDisabled}
          >
            Private Message Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default PrivateChat;
