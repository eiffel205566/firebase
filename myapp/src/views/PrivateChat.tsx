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
import { SingleLine } from "./UserIcon.tsx";
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
    status === "loading" || message === "" || message == null;

  const handleSubmit = async e => {
    e.preventDefault();
    if (isSubmitDisabled) {
      return;
    }

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
    <div className='chatContainer relative bg-gray-600 w-full py-[50px]'>
      {currentMessages.map(message => {
        const personName =
          message.uid === user.uid ? user.displayName : otherName;

        const splittedName = (personName ?? "").split(" ");
        const firstLetter = splittedName[0]?.[0] ?? "";
        const secondLetter = splittedName?.[1]?.[0] ?? "";
        const isMe = message.uid === user.uid;
        const singleMessageClass = `singleMessageContainer flex py-4 bg-slate-${
          isMe ? "600" : "700"
        } px-[100px]`;

        return (
          <SingleLine
            key={message.timestamp}
            className={singleMessageClass}
            isMe={isMe}
            firstLetter={firstLetter}
            secondLetter={secondLetter}
            message={message.message}
          />
        );
      })}
      <div className='bottomBar w-full h-[100px]' />
      <MessageSubmission
        onSubmit={handleSubmit}
        onChange={e => setMessage(e.target.value)}
        message={message}
      />
    </div>
  );
};

export default PrivateChat;
