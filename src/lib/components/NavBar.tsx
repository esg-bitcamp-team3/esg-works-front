"use client";

import { Box, Link, Text, Image, Button } from "@chakra-ui/react";

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
      <Link href="/report" gap="3" color="white" outlineColor="white">
        <Image src="/logo-colored.png" alt="Logo" maxH="36px" />
        <Text
          fontSize="xl"
          color="gray.700"
          fontWeight="bold"
          alignItems={"center"}
        >
          ESG Works
        </Text>
      </Link>

      {/* Right: Profile Icon */}
      <Link href="/login" color="white">
        <Button
          variant="ghost"
          p={3}
          _hover={{ bg: "gray.100" }}
        >
          로그인
        </Button>
      </Link>
    </Box>
  );
};

export default Navbar;
