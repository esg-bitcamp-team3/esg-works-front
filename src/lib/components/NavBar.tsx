"use client";

import { Box, Link, Text, Image, Flex, Button } from "@chakra-ui/react";

const Navbar = () => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      h="70px"
      bg="white"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      px={20}
      zIndex={1000}
      boxShadow="sm"
    >
      {/* Left: Logo & Brand */}
      <Flex align="center" gap={4}>
        <Link href="/report">
          <Button backgroundColor="white" p={0}>
            <Image src="/logo-colored.png" alt="Logo" maxH="36px" />
          </Button>
        </Link>
        <Text
          fontSize="xl"
          color="gray.700"
          fontWeight="bold"
          alignItems={"center"}
        >
          ESGworks
        </Text>
      </Flex>

      {/* Center: Menu Items */}

      {/* Right: Profile Icon */}
      <Flex align="center" gap={4}>
        <Link href="/login">
          <Button
            variant="ghost"
            borderRadius="full"
            p={2}
            _hover={{ bg: "gray.100" }}
          >
            로그인
          </Button>
        </Link>
      </Flex>
    </Box>
  );
};

export default Navbar;
