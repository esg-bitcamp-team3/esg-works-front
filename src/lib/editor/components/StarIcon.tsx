"use client";

import { useState } from "react";
import { PiStar, PiStarFill } from "react-icons/pi";

interface StarToggleIconProps {
  initialFilled?: boolean;
  onToggle?: (filled: boolean) => void;
  size?: number | string;
  title?: string;
}

export default function StarToggleIcon({
  initialFilled = false,
  onToggle,
  size = 20,
  title = "관심 설정",
}: StarToggleIconProps) {
  const [filled, setFilled] = useState(initialFilled);

  const handleClick = () => {
    const newFilled = !filled;
    setFilled(newFilled);
    if (onToggle) {
      onToggle(newFilled);
    }
  };

  const iconProps = {
    size,
    title,
    onClick: handleClick,
    style: {
      color: filled ? "#FFD700" : "#ccc", // 노란색 or 회색
      cursor: "pointer",
      transition: "transform 0.2s",
    },
    onMouseEnter: (e: any) => (e.currentTarget.style.transform = "scale(1.1)"),
    onMouseLeave: (e: any) => (e.currentTarget.style.transform = "scale(1)"),
  };

  return filled ? <PiStarFill {...iconProps} /> : <PiStar {...iconProps} />;
}
