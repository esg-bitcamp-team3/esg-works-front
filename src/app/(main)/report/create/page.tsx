"use client";
import React from "react";
import Subbar from "@/lib/components/SubBar";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TextEditor from "@/lib/editor/example";
import { useSearchParams } from "next/navigation";

interface Props {
  params: Promise<{ title: string }>;
}

const Page = ({ params }: Props) => {
  const searchParams = useSearchParams();

  const title = searchParams.get("title");
  const template = searchParams.get("template");

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <TextEditor
          documentTitle={title || ""}
          template={template || "blank"}
        />
      </DndProvider>
    </div>
  );
};

export default Page;
