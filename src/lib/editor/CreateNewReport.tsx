"use client";
import React from "react";
import { Flex } from "@chakra-ui/react";
import RichTextExample from "./CreateEditor";
import { useParams } from "next/navigation";

const TextEditor = ({ title }: { title: string }) => {
  return (
    <Flex
      justifyContent={"center"}
      direction="column"
      alignItems="center"
      width="100vw"
      height="100vh"
    >
      <RichTextExample documentTitle={title} />
    </Flex>
  );
};

export default TextEditor;
