import { Box, Flex } from "@chakra-ui/react";
import { BsFillHexagonFill } from "react-icons/bs";
import { FaCoffee, FaSmile } from "react-icons/fa";
import { FaLeaf } from "react-icons/fa6";

const OverlappingIcons = () => {
  return (
    <Flex
      position="relative"
      width="100px"
      height="100px"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        justifyContent={"center"}
        alignItems="center"
        display="flex"
        width="100%"
        height="100%"
      >
        <BsFillHexagonFill color="blue" />
      </Box>
      <Box position={"absolute"} top="0" left="0">
        <FaLeaf color="green" />
      </Box>
    </Flex>
  );
};

export default OverlappingIcons;
