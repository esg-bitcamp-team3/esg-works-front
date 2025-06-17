// src/lib/components/standards/StandardsPage.tsx
import { Box, VStack, Button, Heading, Container } from "@chakra-ui/react";
import { useRouter } from "next/navigation"; // next/router 쓰는 경우도 있음

const standardList = [
  { label: "GRI", value: "gri" },
  { label: "ISO", value: "iso" },
  { label: "SASB", value: "sasb" },
  { label: "K-ESG", value: "kesg" },
];

const CARD_STYLES = {
  bg: "white",
  borderRadius: "xl",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s ease",
  _hover: {
    boxShadow: "0 6px 25px rgba(0, 0, 0, 0.12)",
  },
  overflow: "hidden",
};

const StandardsPage = () => {
  const router = useRouter();

  return (
    <Box {...CARD_STYLES} p={2} w={"120%"} maxH={"80%"}>
      <Container py={4}>
        <VStack gap={8} align="center">
          {standardList.map((std) => (
            <Button
              key={std.value}
              w="800px"
              h="60px"
              fontSize="xl"
              onClick={() => router.push(`/${std.value}`)}
              colorScheme="teal"
              variant="outline"
            >
              {std.label}
            </Button>
          ))}
        </VStack>
      </Container>
    </Box>
  );
};

export default StandardsPage;
