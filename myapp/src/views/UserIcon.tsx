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

  return isPlaceholder ? (
    <div className='h-[30px] w-[30px] rounded-full bg-gray-700 flex items-center justify-center'>
      <span className='text-white text-[10px] font-bold'>{finalName}</span>
    </div>
  ) : (
    <div className='h-[30px] w-[30px]' />
  );
};

export default UserIcon;
