"use client";
import React, { use } from "react";
import Subbar from "@/lib/components/SubBar";
import TextEditor from "@/lib/editor/TextEditor";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface Props {
  params: Promise<{ id: string }>;
}

const Page = ({ params }: Props) => {
  const { id } = use(params);
  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        {id && <TextEditor />}
        <Subbar />
      </DndProvider>
    </div>
  );
};

export default Page;
