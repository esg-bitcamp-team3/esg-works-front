"use client";
import React from "react";
import Subbar from "@/lib/components/SubBar";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TextEditor from "@/lib/editor/CreateNewReport";
import { useSearchParams } from "next/navigation";

interface Props {
  params: Promise<{ title: string }>;
}

const Page = ({ params }: Props) => {
  const searchParams = useSearchParams();

  const title = searchParams.get("title");
  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <Subbar />
        <TextEditor title={title || ""} />
      </DndProvider>
    </div>
  );
};

export default Page;
