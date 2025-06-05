import {
  Button,
  CloseButton,
  Dialog,
  Field,
  HStack,
  Input,
  Menu,
  Portal,
  Text,
  useDialog,
  UseDialogReturn,
} from "@chakra-ui/react";
import SaveButton from "./SaveButton";
import { apiClient } from "@/lib/api/client";
import { Descendant } from "slate";
import { useState } from "react";
import {
  LuAlignCenter,
  LuAlignJustify,
  LuAlignLeft,
  LuAlignRight,
  LuBold,
  LuChevronRight,
  LuDownload,
  LuFile,
  LuFiles,
  LuImage,
  LuItalic,
  LuLink2,
  LuSave,
  LuStrikethrough,
  LuTable2,
  LuUnderline,
} from "react-icons/lu";
import { CustomEditor } from "../custom-types";
import { toggleBlock, toggleMark } from "../example";

interface FileBarProps {
  id?: string;
  title: string;
  content: Descendant[];
  editor: CustomEditor;
}

const DuplicateDialog = ({
  dialogProps,
  title,
  onClick,
}: {
  dialogProps: UseDialogReturn;
  title: string;
  onClick: (newTitle: string) => void;
}) => {
  const [newTitle, setNewTitle] = useState(title + " (복사본)");
  const error = newTitle.trim() === "";
  return (
    <Dialog.RootProvider value={dialogProps}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>문서 복제</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Field.Root invalid>
                <Field.Label>제목</Field.Label>
                <Input
                  placeholder="제목을 입력하세요"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                {error && (
                  <Field.ErrorText>
                    제목은 최소 한 글자 이상 입력해주세요.
                  </Field.ErrorText>
                )}
              </Field.Root>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">취소</Button>
              </Dialog.ActionTrigger>
              <Button onClick={() => onClick(newTitle)}>저장</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.RootProvider>
  );
};

const FileMenu = ({ id, title, content }: FileBarProps) => {
  const [newTitle, setNewTitle] = useState(title);
  const { open, setOpen, ...dialogProps } = useDialog();

  const handleSave = async () => {
    const serializedContent = JSON.stringify(content);

    const payload = {
      content: serializedContent,
      title: title,
    };

    try {
      if (id) {
        await apiClient.put(`/reports/${id}`, payload);
      } else {
        await apiClient.post("/reports", payload);
      }
      alert("문서가 저장되었습니다.");
    } catch (error) {
      console.error("Error saving document:", error);
      alert("문서 저장에 실패했습니다.");
    }
  };

  // Handle save as
  const handleSaveAs = async () => {
    const serializedContent = JSON.stringify(content);

    const payload = {
      content: serializedContent,
      title: newTitle,
    };

    try {
      // Always create a new document when using "Save As"
      const response = await apiClient.post("/reports", payload);
      alert("문서가 새 이름으로 저장되었습니다.");
    } catch (error) {
      console.error("Error saving document:", error);
      alert("문서 저장에 실패했습니다.");
    }
  };

  // Create new document
  const handleNew = () => {
    // Navigate to the editor page without any ID to create a new document
    window.open("/editor");
  };

  // Export as PDF (placeholder functionality)
  const handleExportPDF = () => {
    alert("PDF 내보내기 기능은 개발 중입니다.");
  };
  return (
    <>
      <Menu.Root>
        <Menu.Trigger asChild>
          <Button variant="ghost" size="sm" p={2}>
            <Text color="gray.600">파일</Text>
          </Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.ItemGroup>
                <Menu.Item value="new" onClick={handleNew}>
                  <LuFile /> 새 문서
                </Menu.Item>
                <Menu.Item value="save" onClick={handleSave}>
                  <LuSave /> 저장
                </Menu.Item>
                <Menu.Item
                  value="duplicate"
                  onClick={() => {
                    setNewTitle(`${title} (복사본)`);
                    setOpen(true);
                  }}
                >
                  <LuFiles />
                  복제
                </Menu.Item>
                <Menu.Separator />
                <Menu.Root
                  positioning={{ placement: "right-start", gutter: 2 }}
                >
                  <Menu.TriggerItem>
                    <LuDownload /> 내보내기 <LuChevronRight />
                  </Menu.TriggerItem>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content>
                        <Menu.Item value="pdf" onClick={handleExportPDF}>
                          PDF 문서
                        </Menu.Item>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
              </Menu.ItemGroup>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>

      <DuplicateDialog
        dialogProps={{ open, setOpen, ...dialogProps }}
        title={title}
        onClick={handleSaveAs}
      />
    </>
  );
};

const InsertMenu = ({ editor }: { editor: CustomEditor }) => {
  const handleImageInsert = () => {
    return;
  };
  const handleTableInsert = () => {
    return;
  };
  const handleLinkInsert = () => {
    return;
  };
  const handleChartInsert = () => {
    return;
  };
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button variant="ghost" size="sm" p={2}>
          <Text color="gray.600">삽입</Text>
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.ItemGroup>
              <Menu.Item value="image" onClick={handleImageInsert}>
                <LuImage /> 이미지
              </Menu.Item>
              <Menu.Item value="table" onClick={handleTableInsert}>
                <LuTable2 /> 표
              </Menu.Item>
              <Menu.Item value="link" onClick={handleLinkInsert}>
                <LuLink2 />
                링크
              </Menu.Item>
            </Menu.ItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

const DesignMenu = ({ editor }: { editor: CustomEditor }) => {
  const handleTextBold = () => {
    toggleMark(editor, "bold");
  };
  const handleTextItalic = () => {
    toggleMark(editor, "italic");
  };
  const handleTextUnderline = () => {
    toggleMark(editor, "underline");
  };
  const handleTextStrikethrough = () => {
    toggleMark(editor, "strikethrough");
  };
  const handleTextAlignLeft = () => {
    toggleBlock(editor, "left");
  };
  const handleTextAlignCenter = () => {
    toggleBlock(editor, "center");
  };
  const handleTextAlignRight = () => {
    toggleBlock(editor, "right");
  };
  const handleTextAlignJustify = () => {
    toggleBlock(editor, "justify");
  };
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button variant="ghost" size="sm" p={2}>
          <Text color="gray.600">서식</Text>
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.ItemGroup>
              <Menu.Root positioning={{ placement: "right-start", gutter: 2 }}>
                <Menu.TriggerItem>
                  <LuBold /> 텍스트 <LuChevronRight />
                </Menu.TriggerItem>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      <Menu.Item value="bold" onClick={handleTextBold}>
                        <LuBold /> 굵게
                      </Menu.Item>
                      <Menu.Item value="italic" onClick={handleTextItalic}>
                        <LuItalic /> 기울임
                      </Menu.Item>
                      <Menu.Item
                        value="underline"
                        onClick={handleTextUnderline}
                      >
                        <LuUnderline /> 밑줄
                      </Menu.Item>
                      <Menu.Item
                        value="strikethrough"
                        onClick={handleTextStrikethrough}
                      >
                        <LuStrikethrough /> 취소선
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
              <Menu.Root positioning={{ placement: "right-start", gutter: 2 }}>
                <Menu.TriggerItem>
                  <LuAlignJustify /> 정렬 <LuChevronRight />
                </Menu.TriggerItem>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      <Menu.Item
                        value="alignLeft"
                        onClick={handleTextAlignLeft}
                      >
                        <LuAlignLeft /> 왼쪽 정렬
                      </Menu.Item>
                      <Menu.Item
                        value="alignCenter"
                        onClick={handleTextAlignCenter}
                      >
                        <LuAlignCenter /> 중앙 정렬
                      </Menu.Item>
                      <Menu.Item
                        value="alignRight"
                        onClick={handleTextAlignRight}
                      >
                        <LuAlignRight /> 오른쪽 정렬
                      </Menu.Item>
                      <Menu.Item
                        value="alignJustify"
                        onClick={handleTextAlignJustify}
                      >
                        <LuAlignJustify /> 양쪽 정렬
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            </Menu.ItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

const FileBar = ({ id, title, content, editor }: FileBarProps) => {
  return (
    <HStack px={0} mx={4} gap={0}>
      <FileMenu id={id} title={title} content={content} editor={editor} />
      <InsertMenu editor={editor} />
      <DesignMenu editor={editor} />
    </HStack>
  );
};

export default FileBar;
