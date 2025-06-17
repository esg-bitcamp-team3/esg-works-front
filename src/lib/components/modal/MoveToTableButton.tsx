import { Button } from "@chakra-ui/react";
import { PiNotePencil, PiTable } from "react-icons/pi";

interface MoveToTableButtonProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const MoveToTableButton = ({
  selectedTab,
  setSelectedTab,
}: MoveToTableButtonProps) => {
  const handleClick = () => {
    setSelectedTab("table");
  };

  return (
    <Button
      size={"2xs"}
      colorPalette="blue"
      variant="outline"
      onClick={handleClick}
    >
      <PiNotePencil /> 데이터 편집하기
    </Button>
  );
};
export default MoveToTableButton;
