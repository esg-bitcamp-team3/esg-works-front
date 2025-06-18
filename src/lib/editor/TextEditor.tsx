"use client";
import React from "react";
import { Flex } from "@chakra-ui/react";
import RichTextExample from "./example";
import { useParams } from "next/navigation";

const TextEditor = () => {
  const params = useParams();
  const id = params.id;

  if (!id || typeof id !== "string") return null;

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
