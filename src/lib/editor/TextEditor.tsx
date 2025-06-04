'use client';
import React from "react";
import { Flex } from "@chakra-ui/react";
import RichTextExample from "./example";
import { DndProvider } from "react-dnd";
import { Transforms } from "slate";

const TextEditor = () => {
  return (
    <Flex
      justify={"center"}
      direction="column"
      align="center"
      width="800px"
      height="100vh"
      padding={12}
    >
      <RichTextExample documentId="683d5922e4002e992e8c754b" />
    </Flex>
  );
};

export default TextEditor;
