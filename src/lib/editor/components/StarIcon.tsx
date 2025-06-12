import { PiStar, PiStarFill } from "react-icons/pi";

interface StarToggleIconProps {
  filled: boolean; // 부모가 상태 직접 관리
  onToggle?: (filled: boolean) => void;
  size?: number | string;
  title?: string;
}

export default function StarToggleIcon({
  filled,
  onToggle,
  size = 20,
  title = "관심 설정",
}: StarToggleIconProps) {
  const handleClick = () => {
    if (onToggle) {
      onToggle(!filled);
    }
  };

  const iconProps = {
    size,
    title,
    onClick: handleClick,
    style: {
      color: filled ? "#FFD700" : "#ccc",
      cursor: "pointer",
      transition: "transform 0.2s",
    },
    onMouseEnter: (e: any) => (e.currentTarget.style.transform = "scale(1.1)"),
    onMouseLeave: (e: any) => (e.currentTarget.style.transform = "scale(1)"),
  };

  return filled ? <PiStarFill {...iconProps} /> : <PiStar {...iconProps} />;
}
