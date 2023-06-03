import React from "react";

const Exit = ({
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
      height={`${height}px`}
      width={`${width}px`}
      version='1.1'
      id='Layer_1'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 512 512'
    >
      <path
        d='M469.3,469.3H42.7V42.7H256L298.7,0h-256C19.1,0,0,19.1,0,42.7v426.7C0,492.9,19.1,512,42.7,512h426.7
	c23.6,0,42.7-19.1,42.7-42.7V320l-42.7,42.7V469.3z M85.3,426.7C149.1,255.7,234.7,256,362.7,256v85.3L512,192L362.7,42.7V128
	C85.3,128,85.1,341.1,85.3,426.7z'
      />
    </svg>
  );
};

export default Exit;
