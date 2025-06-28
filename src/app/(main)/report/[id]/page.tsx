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
<<<<<<< HEAD
      <DndProvider backend={HTML5Backend}>
        {id && <TextEditor />}
        <Subbar />
      </DndProvider>
=======
      {/* 서브바에 DndProvider 직접 걸어줄 예정 */}
      {/* <DndProvider backend={HTML5Backend}> */}
      {id && <TextEditor id={id} />}
      <Subbar />
      {/* </DndProvider> */}
>>>>>>> 6a30be6a4403270d2140c839f10ad0877162b4e8
    </div>
  );
};

export default Page;
