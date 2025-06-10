import { Box, Flex, Skeleton, Spinner, Text } from "@chakra-ui/react";

const EditorLoadingState = () => {
  return (
    <Box
      justifyContent="center"
      alignItems="center"
      minW="100%"
      height="100%"
      direction="column"
      overflow={"auto"}
    >
      <Skeleton height="800px" w="100%" />
    </Box>
  );
};

export default EditorLoadingState;
