const UserIcon = ({
  isMe,
  name,
}: {
  isMe: boolean;
  name: { firstLetter: string; secondLetter: string };
}) => {
  const finalName = isMe
    ? "Me"
    : `${name.firstLetter ?? ""}${
        name.secondLetter ? ` ${name.secondLetter}` : ""
      }`;

  return (
    <div className='h-[30px] w-[30px] rounded-full bg-gray-700 flex items-center justify-center'>
      <span className='text-white text-[10px] font-bold'>{finalName}</span>
    </div>
  );
};

export default UserIcon;
