import React from "react";

const SignUpCard = ({ title, paragraph, btnText, onClick }) => {
  return (
    <div className="rounded-lg bg-white py-[2.5rem] px-[1.2rem] flex flex-col gap-5 justify-center items-center lg:w-[40%] md:w-[60%] w-[100%] hover:scale-[1.009] transition-all duration-150 ease-linear cursor-pointer">
      <h2 className="text-[1.4rem] font-mainFont capitalize">{title}</h2>
      <p className="text-[16px] w-[90%] text-center text-zinc-600 md:text-[.9rem] lg:text-[1rem]">
        {paragraph}
      </p>
      <button
        onClick={onClick}
        className="mt-2 bg-indigo text-white md:text-[.9rem] md:py-[.9rem] md:px-[1.9rem] lg:text-[1rem] lg:py-[.75vw] lg:px-[1.75vw] py-[2.7vw] px-[4vw] rounded-lg outline-none border-none hover:bg-indigoHover duration-200 transition-all ease-linear"
      >
        {btnText}
      </button>
    </div>
  );
};

export default SignUpCard;
