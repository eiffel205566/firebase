import React from "react";

const MessageSubmission = ({ onSubmit, message, onChange }) => {
  return (
    <div className='w-full fixed bottom-0'>
      <div className='bg-gray-600'>
        <form onSubmit={onSubmit}>
          <div
            style={{ boxShadow: "-1px -39px 30px -22px rgba(75,85,99,1)" }}
            className='flex justify-center py-4 box-shadow-custom'
          >
            <textarea
              className='resize-none w-[400px] bg-gray-500 rounded-lg focus:outline-none p-4 overflow-y-hidden'
              id='message'
              value={message}
              onChange={onChange}
              onInput={e => {
                const element = e.target as HTMLTextAreaElement;
                element.style.height = "auto";
                element.style.height = `${element.scrollHeight}px`;
              }}
            />
            {message && (
              <button className='focus:outline-none'>
                <Chevron className='fill-stone-100 cursor-pointer hover:fill-green-300' />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageSubmission;

const Chevron = ({ className }) => {
  return (
    <svg
      className={className}
      fill='#000000'
      width='20px'
      height='20px'
      viewBox='0 0 32 32'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M8.489 31.975c-0.271 0-0.549-0.107-0.757-0.316-0.417-0.417-0.417-1.098 0-1.515l14.258-14.264-14.050-14.050c-0.417-0.417-0.417-1.098 0-1.515s1.098-0.417 1.515 0l14.807 14.807c0.417 0.417 0.417 1.098 0 1.515l-15.015 15.022c-0.208 0.208-0.486 0.316-0.757 0.316z'></path>
    </svg>
  );
};
