import { Box, Tabs } from "@chakra-ui/react";
import { ReactNode } from "react";

interface TabContentProps {
  value: string;
  children: ReactNode;
}
const TabContent = ({ value, children }: TabContentProps) => {
  return (
    <Tabs.Content
      value={value}
      position="relative"
      _open={{
        animationName: "fade-in, scale-in",
        animationDuration: "300ms",
      }}
      height="100%"
    >
      {children}
    </Tabs.Content>
  );
};

export default TabContent;
