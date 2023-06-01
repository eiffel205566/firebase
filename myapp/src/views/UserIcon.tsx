import React from "react";

const UserIcon = ({
  isMe,
  name,
  isPlaceholder,
}: {
  isMe: boolean;
  name: { firstLetter: string; secondLetter: string };
  isPlaceholder: boolean;
}) => {
  const finalName = isMe
    ? "Me"
    : `${name.firstLetter ?? ""}${
        name.secondLetter ? ` ${name.secondLetter}` : ""
      }`;
  const userClass = `h-[30px] w-[30px] rounded-full bg-gray-${
    isMe ? "700" : "600"
  } flex items-center justify-center`;

  return isPlaceholder ? (
    <div className={userClass}>
      <span className='text-white text-[10px] font-bold'>{finalName}</span>
    </div>
  ) : (
    <div className='h-[30px] w-[30px]' />
  );
};

export const SingleLine = ({
  className,
  isMe,
  firstLetter,
  secondLetter,
  message,
}: {
  className: string;
  isMe: boolean;
  firstLetter: string;
  secondLetter: string;
  message: string;
}) => {
  return (
    <div className={className}>
      <div className='pr-10'>
        <UserIcon
          isPlaceholder={isMe}
          isMe={isMe}
          name={{ firstLetter, secondLetter }}
        />
      </div>
      <div className='h-fit'>{message}</div>
      <div className='pl-10 ml-auto'>
        <UserIcon
          isMe={isMe}
          name={{ firstLetter, secondLetter }}
          isPlaceholder={!isMe}
        />
      </div>
    </div>
  );
};

export default UserIcon;
