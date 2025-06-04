"use client";
import React from "react";
import Subbar from "@/lib/components/SubBar";
import TextEditor from "@/lib/editor/TextEditor";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Page = () => {
  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <TextEditor />
        <Subbar />
      </DndProvider>
    </div>
  );
};

export default Page;
