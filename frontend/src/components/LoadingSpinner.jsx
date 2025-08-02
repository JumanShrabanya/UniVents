import React from "react";

const LoadingSpinner = ({ size = "w-4 h-4", color = "border-white" }) => {
  return (
    <div
      className={`${size} border-2 ${color} border-t-transparent rounded-full animate-spin`}
    ></div>
  );
};

export default LoadingSpinner;
