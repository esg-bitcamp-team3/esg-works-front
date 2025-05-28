"use client";

import { useState, useRef, useCallback } from "react";
import {
  Box,
  Link,
  VStack,
  Icon,
  Text,
  Image,
  Heading,
} from "@chakra-ui/react";
import { FaFileCirclePlus, FaHouse, FaPen, FaUser } from "react-icons/fa6";
import { usePathname, useRouter } from "next/navigation";
import ESGWorksLogo from "./Logo";

interface MenuItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

const menuItems: MenuItem[] = [
  { label: "홈", icon: FaHouse, path: "/main" },
  { label: "데이터 입력", icon: FaPen, path: "/data" },
  { label: "보고서 작성", icon: FaFileCirclePlus, path: "/report" },
];

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const pathName = usePathname();

  return (
    <Box
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      w={isExpanded ? "200px" : "70px"}
      h="100vh"
      bg="white"
      color="white"
      transition="width 0.1s ease-out"
      overflow="hidden"
      boxShadow="md"
      position="relative"
    >
      <Box
        display="flex"
        alignItems="center"
        p={4}
        borderBottom="1px"
        borderColor="gray.200"
        h="80px"
        w="80px"
      >
        {/* <Image
          as="img"
          src="/logo3.png"
          alt="Logo"
          maxH="40px"
          maxW={isExpanded ? "160px" : "50px"}
        /> */}
        <ESGWorksLogo />
        {isExpanded && (
          <Heading
            ml={4}
            position="absolute"
            color="gray.600"
            left="50px"
            fontSize="xl"
            fontWeight="bold"
            transition="opacity 0.05s ease-out"
            whiteSpace="nowrap"
          >
            ESG Works
          </Heading>
        )}
      </Box>

      <VStack
        alignItems={isExpanded ? "flex-start" : "center"}
        px={4}
        gap={4}
        mt={8}
      >
        {menuItems.map(({ label, icon, path }) => {
          const isSelected = pathName === path;
          return (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="start"
              cursor="pointer"
              w="100%"
              bg={isSelected ? "#2F6EEA" : "transparent"}
              p={2}
              borderRadius="md"
              _hover={{ bg: isSelected ? "#2F6EEA" : "gray.200" }}
              onClick={() => router.push(path)}
            >
              <Icon
                as={icon}
                boxSize={6}
                color={isSelected ? "white" : "#2F6EEA"}
              />
              {isExpanded && (
                <Text
                  ml={4}
                  position="absolute"
                  left="50px"
                  fontSize="md"
                  fontWeight="medium"
                  transition="opacity 0.05s ease-out"
                  whiteSpace="nowrap"
                  color={isSelected ? "white" : "gray.700"}
                >
                  {label}
                </Text>
              )}
            </Box>
          );
        })}
      </VStack>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="start"
        cursor="pointer"
        w="100%"
        p={2}
        borderRadius="md"
      >
        <Icon as={FaUser} boxSize={6} color="#2F6EEA" />
        {isExpanded && (
          <Text
            ml={4}
            position="absolute"
            left="50px"
            fontSize="md"
            fontWeight="medium"
            transition="opacity 0.05s ease-out"
            whiteSpace="nowrap"
          ></Text>
        )}
      </Box>
    </Box>
  );
};

export default Sidebar;
