import { Descendant } from "slate";
import { useSlate } from "slate-react";
import { MouseEvent } from "react";
import { apiClient } from "@/lib/api/client";
import { Report } from "../example";
import { Button, Icon } from "@chakra-ui/react";
import { LuSave } from "react-icons/lu";

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "This is editable " }],
  },
];

const serializeContent = (content: Descendant[]) => {
  return JSON.stringify(content);
};

interface SaveButtonProps {
  id?: string;
  title: string;
  content: Descendant[];
}

const SaveButton = ({ id, title, content }: SaveButtonProps) => {
  const handleSave = async () => {
    const serializedContent = serializeContent(content);

    const payload = {
      content: serializedContent,
      title: title,
    };

    try {
      if (id) {
        const response = await apiClient.put(`/reports/${id}`, payload);
      } else {
        const response = await apiClient.post("/reports", payload);
      }
      alert("문서가 저장되었습니다.");
    } catch (error) {
      console.error("Error saving document:", error);
      alert("문서 저장에 실패했습니다.");
    }
  };

  return (
    <Button
      onMouseDown={(e: MouseEvent<HTMLSpanElement>) => e.preventDefault()}
      onClick={handleSave}
    >
      <LuSave />
    </Button>
  );
};

export default SaveButton;
