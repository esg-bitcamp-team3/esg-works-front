"use client";
import React from "react";
import { Flex } from "@chakra-ui/react";
import RichTextExample from "./example";
import { DndProvider } from "react-dnd";
import { Transforms } from "slate";

const TextEditor = ({ id }: { id?: string }) => {
  return (
    <Flex
      justifyContent={"center"}
      direction="column"
      alignItems="center"
      width="100vw"
      height="100vh"
    >
      <RichTextExample documentId={id} />
    </Flex>
  );
};

export default TextEditor;
