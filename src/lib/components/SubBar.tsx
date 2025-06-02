"use client";

import { Box, HStack } from "@chakra-ui/react";
import { GoFileDirectory } from "react-icons/go";
import { TfiPieChart } from "react-icons/tfi";
import { BsBarChartLine } from "react-icons/bs";
import { RiLineChartLine } from "react-icons/ri";
import { CiViewTable } from "react-icons/ci";
import SubBarTab from "./SubBarTab";
import { useState } from "react";

interface MenuItem {
  label: string;
  icon: React.ElementType;
}

const menuItems: MenuItem[] = [
  { label: "모든파일", icon: GoFileDirectory },
  { label: "파이차트", icon: TfiPieChart },
  { label: "바차트", icon: BsBarChartLine },
  { label: "라인차트", icon: RiLineChartLine },
  { label: "테이블", icon: CiViewTable },
];

const Subbar = () => {
  const [anyOpen, setAnyOpen] = useState(false);
  return (
    <Box
      position="fixed"
      right={anyOpen ? "320px" : "0px"} // ← 여기 핵심!
      top="10"
      borderRadius="xl"
      zIndex={9999}
      transition="right 0.15s"
    >
      <Box
        w="40px"
        h="32vh"
        bg="white"
        borderTopLeftRadius={"xl"}
        borderBottomLeftRadius={"xl"}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <HStack wrap="wrap">
          {menuItems.map((item, index) => {
            const [isHovered, setIsHovered] = useState(false);
            const Icon = item.icon;
            return (
              <Box
                key={index}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                // bg={isHovered ? "gray.100" : "transparent"}
                borderRadius="md"
                p={2}
                // transition="background 0.2s"
              >
                <SubBarTab
                  label={item.label}
                  icon={item.icon}
                  onOpenChange={(open) => setAnyOpen(open)}
                />
              </Box>
            );
          })}
        </HStack>
      </Box>
    </Box>
  );
};
export default Subbar;
