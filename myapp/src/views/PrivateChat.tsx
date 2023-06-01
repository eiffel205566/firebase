import { User } from "firebase/auth";
import { query } from "firebase/database";
import {
  collection,
  doc,
  setDoc,
  where,
  or,
  updateDoc,
} from "firebase/firestore";
import React, { useState } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import UserIcon from "./UserIcon.tsx";
import MessageSubmission from "./MessageSubmission.tsx";

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
      <MessageSubmission
        onSubmit={handleSubmit}
        onChange={e => setMessage(e.target.value)}
        message={message}
      />
    </div>
  );
};

export default PrivateChat;
