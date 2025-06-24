"use client";
import React, { use } from "react";
import Subbar from "@/lib/components/SubBar";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TextEditor from "@/lib/editor/CreateNewReport";

interface Props {
  params: Promise<{ title: string }>;
}

const Page = ({ params }: Props) => {
  const { title } = use(params);
  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <Subbar />
        <TextEditor />
      </DndProvider>
    </div>
  );
};

export default Page;
