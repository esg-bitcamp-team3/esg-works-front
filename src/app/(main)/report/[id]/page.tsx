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
      {/* 서브바에 DndProvider 직접 걸어줄 예정 */}
      {/* <DndProvider backend={HTML5Backend}> */}
      {id && <TextEditor id={id} />}
      <Subbar />
      {/* </DndProvider> */}
    </div>
  );
};

export default Page;
