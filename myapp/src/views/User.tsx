import React from "react";

const User = ({
  className,
  width = 20,
  height = 20,
  onClick,
}: {
  className: string;
  width?: number;
  height?: number;
  onClick?: () => void;
}) => {
  return (
    <svg
      onClick={onClick}
      className={className}
      width={`${width}px`}
      height={`${height}px`}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <g id='User / User_01'>
        <path
          id='Vector'
          d='M19 21C19 17.134 15.866 14 12 14C8.13401 14 5 17.134 5 21M12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7C16 9.20914 14.2091 11 12 11Z'
        />
      </g>
    </svg>
  );
};

export default User;