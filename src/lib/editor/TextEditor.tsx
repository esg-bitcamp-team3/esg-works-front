import { Flex } from "@chakra-ui/react";
import RichTextExample from "./example";

const TextEditor = () => {
  return (
    <Flex
      justify={"center"}
      direction="column"
      align="center"
      height="100vh"
      padding={12}
    >
      <RichTextExample />
    </Flex>
  );
};

export default TextEditor;
