"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Box,
  Link,
  VStack,
  Icon,
  Text,
  Image,
  Heading,
  Separator,
  Flex,
} from "@chakra-ui/react";
import {
  FaCircleUser,
  FaFeatherPointed,
  FaFile,
  FaFileCirclePlus,
  FaGear,
  FaHouse,
  FaPen,
  FaRightFromBracket,
  FaUser,
} from "react-icons/fa6";
import { usePathname, useRouter } from "next/navigation";
import ESGWorksLogo from "./Logo";
import OverlappingIcons from "./LogoIcon";

interface MenuItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

const menuItems: MenuItem[] = [
  { label: "홈", icon: FaHouse, path: "/home" },
  { label: "데이터 입력", icon: FaPen, path: "/criterion" },
  { label: "보고서 작성", icon: FaFile, path: "/report" },
];

interface SidebarProps {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
}

const Sidebar = ({ isExpanded, setIsExpanded }: SidebarProps) => {
  // const [isExpanded, setIsExpanded] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    console.log("Current path:", profileMenuOpen);
  }, [profileMenuOpen]);

  return (
    <>
      <Box
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        w={isExpanded ? "200px" : "60px"}
        h="100vh"
        bg="white"
        color="white"
        transition="width 0.1s ease-out"
        overflow="hidden"
        boxShadow="md"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        position="fixed"
        left="0"
        top="0"
        zIndex="1000"
      >
        <Box>
          <Box
            display="flex"
            alignItems="center"
            borderBottom="1px"
            borderColor="gray.200"
            p={4}
            h="80px"
            w="80px"
          >
            <Image
              as="img"
              src="/logo-colored.png"
              alt="Logo"
              maxH="30px"
              maxW={isExpanded ? "160px" : "50px"}
            />
            {/* <ESGWorksLogo /> */}
            {/* <OverlappingIcons /> */}
            {isExpanded && (
              <Heading
                ml={2}
                position="absolute"
                color="gray.700"
                left="50px"
                fontSize="2xl"
                fontWeight="bold"
                transition="opacity 0.05s ease-out"
                whiteSpace="nowrap"
              >
                ESG Works
              </Heading>
            )}
          </Box>
          <Separator size="md" color="gray" w="full" />

          <VStack
            alignItems={isExpanded ? "flex-start" : "center"}
            px={3}
            gap={4}
            mt={8}
          >
            {menuItems.map(({ label, icon, path }, index) => {
              const isSelected = pathName === path;
              return (
                <Box
                  key={index}
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
                    size="md"
                    color={isSelected ? "white" : "#2F6EEA"}
                  />
                  {isExpanded && (
                    <Text
                      ml={2}
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
        </Box>

        <Box
          mb={4}
          onMouseEnter={() => setProfileMenuOpen(true)}
          onMouseLeave={() => setProfileMenuOpen(false)}
        >
          <VStack alignItems={isExpanded ? "flex-start" : "center"} px={3}>
            <Separator size="md" color="gray" w="full" />
            <Box
              display="flex"
              alignItems="center"
              justifyContent="start"
              cursor="pointer"
              w="100%"
              h="50px"
              p={1}
              borderRadius="md"
            >
              <Icon as={FaCircleUser} boxSize={6} color="#2F6EEA" />
              {isExpanded && (
                <Text
                  ml={2}
                  position="absolute"
                  left="50px"
                  fontSize="md"
                  fontWeight="medium"
                  transition="opacity 0.05s ease-out"
                  whiteSpace="nowrap"
                  color="gray.700"
                >
                  프로필
                </Text>
              )}
            </Box>
          </VStack>
        </Box>
      </Box>
      {profileMenuOpen && (
        <Box
          bg="transparent"
          position="fixed"
          left={isExpanded ? "200px" : "60px"}
          bottom="0px"
          w="180px"
          zIndex={100}
          onMouseEnter={() => {
            setIsExpanded(true);
            setProfileMenuOpen(true);
          }}
          onMouseLeave={() => {
            setIsExpanded(false);
            setProfileMenuOpen(false);
          }}
        >
          <VStack
            gap={1}
            align="stretch"
            m={1}
            bg="white"
            borderRadius="md"
            boxShadow="md"
            p="2"
          >
            <Box
              as="button"
              p={2}
              borderRadius="md"
              _hover={{ bg: "gray.100" }}
              w="full"
              textAlign="left"
              cursor="pointer"
              onClick={() => router.push("/mypage")}
            >
              <Flex alignItems="center">
                <Icon as={FaUser} color="#2F6EEA" />
                <Text ml={3} color="gray.700">
                  내 프로필
                </Text>
              </Flex>
            </Box>

            <Box
              as="button"
              p={2}
              borderRadius="md"
              _hover={{ bg: "gray.100" }}
              w="full"
              textAlign="left"
              cursor="pointer"
              onClick={() => router.push("/settings")}
            >
              <Flex alignItems="center">
                <Icon as={FaGear} color="#2F6EEA" />
                <Text ml={3} color="gray.700">
                  설정
                </Text>
              </Flex>
            </Box>

            <Separator size="md" color="gray" w="full" />

            <Box
              as="button"
              p={2}
              borderRadius="md"
              _hover={{ bg: "gray.100" }}
              w="full"
              textAlign="left"
              cursor="pointer"
              onClick={() => {
                // Add logout logic here
                router.push("/login");
              }}
            >
              <Flex alignItems="center">
                <Icon as={FaRightFromBracket} color="red.500" />
                <Text ml={3} color="red.500">
                  로그아웃
                </Text>
              </Flex>
            </Box>
          </VStack>
        </Box>
      )}
    </>
  );
};

export default Sidebar;
