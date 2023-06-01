import React, { ReactNode } from "react";

const SlideIn = ({
  children,
  isOpen,
}: {
  children: ReactNode;
  isOpen: boolean;
}) => {
  return (
    <div
      style={{
        transform: `translateY(${isOpen ? "0px" : "40px"})`,
      }}
      className={`slideIn bg-gray-800 flex flex-col w-24 fixed top-[40px] left-[10] transform transition-all duration-500 ease-in-out ${
        isOpen ? "z-10" : "40 bg-opacity-0 text-transparent -z-10"
      }`}
    >
      {children}
    </div>
  );
};

export default SlideIn;
