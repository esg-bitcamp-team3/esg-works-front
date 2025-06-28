"use client";
import React from "react";
import { Flex } from "@chakra-ui/react";
import RichTextExample from "./example";
import { useParams } from "next/navigation";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Transforms } from "slate";

const TextEditor = () => {
  const params = useParams();
  const id = params.id;

  if (!id || typeof id !== "string") return null;

  return (
    <DndProvider backend={HTML5Backend}>
      <Flex
        justifyContent={"center"}
        direction="column"
        alignItems="center"
        width="100vw"
        height="100vh"
      >
        <RichTextExample documentId={id} />
      </Flex>
    </DndProvider>
  );
};

export default TextEditor;
