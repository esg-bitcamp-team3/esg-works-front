"use client";
import ChartModal from "@/lib/components/modal/chart-modal";
import ReportModal from "@/lib/components/modal/document-modal";
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
        <ChartModal />
      </DndProvider>
    </div>
  );
};
export default Page;
