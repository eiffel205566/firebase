import { User } from "firebase/auth";
import { query } from "firebase/database";
import { collection, doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { SingleLine } from "./UserIcon.tsx";
import MessageSubmission from "./MessageSubmission.tsx";

const RoomChat = ({ roomId, user }: { roomId; user: User }) => {
  const [message, setMessage] = useState<string>("");
  const firestore = useFirestore();
  const roomMessagesRef = collection(firestore, "rooms");
  const roomMessagesQueryResult = useFirestoreCollectionData<{
    NO_ID_FIELD: string;
    messages: Array<{
      message: string;
      timestamp: number;
      uid: string;
      userName: string;
    }>;
    createId: string;
    roomName: string;
  }>(query(roomMessagesRef));
  const room = (roomMessagesQueryResult.data ?? []).find(
    r => r.NO_ID_FIELD === roomId
  );

  const { status, data } = roomMessagesQueryResult;
  const currentMessages = (data ?? [])[0]?.messages ?? [];
  const isSubmitDisabled =
    status === "loading" || message === "" || message == null;

  const handleSubmit = async e => {
    e.preventDefault();
    if (isSubmitDisabled) {
      return;
    }

    if (room) {
      await setDoc(doc(roomMessagesRef, room.NO_ID_FIELD), {
        ...room,
        messages: [
          ...currentMessages,
          {
            uid: user.uid,
            userName: user.displayName,
            message,
            timestamp: Date.now(),
          },
        ],
      });
    }

    setMessage("");
  };

  return (
    <div className='chatContainer relative bg-gray-600 w-full pb-[50px]'>
      {(room?.messages ?? []).map((message, index) => {
        const personName = message?.userName ?? "";

        const splittedName = (personName ?? "").split(" ");
        const firstLetter = splittedName[0]?.[0] ?? "";
        const secondLetter = splittedName?.[1]?.[0] ?? "";
        const isMe = message.uid === user.uid;
        const singleMessageClass = `singleMessageContainer flex py-4 bg-slate-${
          index % 2 === 0 ? "700" : "600"
        } px-[100px]`;

        return (
          <SingleLine
            key={message.timestamp}
            className={singleMessageClass}
            isMe={isMe}
            firstLetter={firstLetter}
            secondLetter={secondLetter}
            message={message.message}
            isEven={index % 2 === 0}
          />
        );
      })}
      <div className='bottomBar w-full h-[100px]' />
      <MessageSubmission
        onSubmit={handleSubmit}
        onChange={e => setMessage(e.target.value)}
        message={message}
        otherName='Others'
      />
    </div>
  );
};

export default RoomChat;
