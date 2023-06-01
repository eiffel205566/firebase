import React from "react";

/**
 * taken from my own repo: https://github.com/eiffel205566/portfolio/blob/main/privatePortfolio/web/src/pages/HomePage/SectionOne.js
 */
const BurgerMenu = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: (nextOpenValue: boolean) => void;
}) => {
  return (
    <div
      onClick={e => {
        e.stopPropagation();
        onClick(!isOpen);
      }}
      className='fixed burgerContainer h-10 w-10 top-0 left-0 cursor-pointer z-10'
    >
      <div className='transform transition-all h-full translate-y-1/2'>
        <div className={`burgerline ${isOpen ? "open" : ""}`}></div>
      </div>
    </div>
  );
};

export default BurgerMenu;
