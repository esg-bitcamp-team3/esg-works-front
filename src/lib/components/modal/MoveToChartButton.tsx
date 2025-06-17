import { Button } from "@chakra-ui/react";
import { PiChartLine, PiNotePencil, PiTable } from "react-icons/pi";

interface MoveToTableButtonProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const MoveToChartButton = ({
  selectedTab,
  setSelectedTab,
}: MoveToTableButtonProps) => {
  const handleClick = () => {
    setSelectedTab("chart");
  };

  return (
    <Button
      size={"2xs"}
      colorPalette="blue"
      variant="outline"
      onClick={handleClick}
    >
      <PiChartLine /> 차트 편집하기
    </Button>
  );
};
export default MoveToChartButton;
