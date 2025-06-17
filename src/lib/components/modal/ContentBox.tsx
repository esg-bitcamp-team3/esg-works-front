import { Box, Flex, Spinner, Tabs } from "@chakra-ui/react";
import { dir } from "console";
import { ReactNode } from "react";

interface TabContentProps {
  loading: boolean;
  children: ReactNode;
  button: ReactNode;
}
const ContentBox = ({ loading, children, button }: TabContentProps) => {
  return (
    <Box
      display="flex"
      direction="column"
      justifyContent="space-between"
      width={"100%"}
    >
      {loading ? (
        <Flex justify="center" align="center" height="100%">
          <Spinner size="xl" borderWidth="4px" color="blue.500" />
        </Flex>
      ) : (
        <Box width={"100%"} alignContent={"center"}>
          {children}
          <Box
            width={"100%"}
            alignContent={"center"}
            justifyContent={"center"}
            display="flex"
            mt={4}
          >
            {button}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ContentBox;
