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
      height="100vh"
      padding={12}
    >
      <RichTextExample />
    </Flex>
  );
};

export default TextEditor;
