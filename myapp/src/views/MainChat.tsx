import React, { useState } from "react";

const MainChat = () => {
  const [message, setMessage] = useState<string>("");

  return (
    <div className='chatContainer relative bg-gray-500 flex-grow'>
      <div className='absolute bottom-[10%] left-[50%] bg-gray-600'>
        <form onSubmit={() => {}}>
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
