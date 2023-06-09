import React, { ChangeEventHandler, FormEvent } from "react";
import "./MessageSubmission.css";
import Chevron from "./Chevron.tsx";

const MessageSubmission = ({
  onSubmit,
  message,
  onChange,
  otherName,
}: {
  onSubmit: (e: FormEvent) => void;
  message: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  otherName?: string;
}) => {
  return (
    <div className='messageSubmission fixed bottom-0'>
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
              placeholder={`Chatting with ${otherName ?? "Others"}`}
            />
            <button className='focus:outline-none'>
              <Chevron
                className={`fill-stone-100 cursor-pointer hover:fill-green-300 translate-x-[-30px] ${
                  message ? "" : "fill-transparent"
                }`}
                width={24}
                height={24}
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageSubmission;
