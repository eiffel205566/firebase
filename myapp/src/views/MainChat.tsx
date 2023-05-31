import { User } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useFirestore } from "reactfire";

const MainChat = ({ user }: { user: User }) => {
  const firestore = useFirestore();
  const publicMessagesRef = collection(firestore, "publicMessages");

  const [message, setMessage] = useState<string>("");

  const handleSubmit = async e => {
    e.preventDefault();
    await setDoc(doc(publicMessagesRef, user.uid), {
      uid: user.uid,
      timeStamp: Date.now(),
      message,
    });
    setMessage("");
  };

  return (
    <div className='chatContainer relative bg-gray-500 flex-grow'>
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
