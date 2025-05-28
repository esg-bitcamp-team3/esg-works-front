import React from "react";

const ESGHexLogo: React.FC = () => {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
    >
      {/* 육각형 배경 */}
      <path
        d="M100,10 
           C105,10 168,45 173,50 
           C178,55 178,125 173,130 
           C168,135 105,170 100,170 
           C95,170 32,135 27,130 
           C22,125 22,55 27,50 
           C32,45 95,10 100,10 Z"
        fill="#2F6EEA"
        stroke="none"
      />

      {/* 나뭇잎 도형 */}
      <path
        d="M70 60 C50 90, 50 130, 80 135 C110 140, 115 100, 95 75 C85 60, 75 55, 70 60 Z"
        fill="white"
      />
      {/* 나뭇잎 가운데 줄기 */}
      <path
        d="M72 65 L95 115"
        stroke="#2F6EEA"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* 사람 - 머리 */}
      <circle cx="135" cy="75" r="12" fill="white" />

      {/* 사람 - 몸통 (둥근 사각형 형태) */}
      <rect x="120" y="95" width="30" height="35" rx="8" ry="8" fill="white" />
    </svg>
  );
};

export default ESGHexLogo;
