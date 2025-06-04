import { Box, Flex, Spinner, Text } from "@chakra-ui/react";

const EditorLoadingState = () => {
  return (
    <Box
      justifyContent="center"
      minW="100%"
      height="100%"
      direction="column"
      borderRadius="md"
      boxShadow={"md"}
      overflow={"auto"}
      p={10}
      bg="white"
    >
      <Flex direction="column" align="center" justify="center" minH="300px">
        <Spinner borderWidth="4px" color="blue.500" size="xl" mb={4} />
        <Text fontSize="lg" color="gray.600">
          문서를 불러오는 중...
        </Text>
      </Flex>
    </Box>
  );
};

export default EditorLoadingState;
