import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Field,
  Flex,
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
import { useRef, useState } from "react";
import {
  LuAlignCenter,
  LuAlignJustify,
  LuAlignLeft,
  LuAlignRight,
  LuBold,
  LuChartColumnBig,
  LuChartLine,
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
import {
  insertChart,
  insertImage,
  insertLink,
  insertTable,
  toggleBlock,
  toggleMark,
} from "../example";
import TableSizeSelector from "./TableSizeSelector";
import UrlDialog from "./UrlDialog";
import { exportToPdf } from "./exportToPdf";

const MenuButton = ({ label }: { label: string }) => (
  <Button
    variant="ghost"
    size="sm"
    p={2}
    _hover={{ bg: "gray.100" }}
    _active={{ bg: "gray.200" }}
    height="auto"
    minW="auto"
    fontWeight="medium"
  >
    <Text color="gray.700">{label}</Text>
  </Button>
);

const MenuItem = ({
  icon,
  value,
  label,
  shortcut,
  onClick,
  closeOnSelect = true,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  shortcut?: string;
  onClick: () => void;
  closeOnSelect?: boolean;
}) => (
  <Menu.Item
    closeOnSelect={closeOnSelect}
    value={value}
    onClick={onClick}
    py={2}
    px={3}
    borderRadius="md"
    _hover={{ bg: "gray.100" }}
    _focus={{ bg: "gray.100" }}
    width={"100%"}
  >
    <Flex justify="space-between" align="center" width="100%">
      <Flex align="center" gap={2}>
        {icon}
        <Text>{label}</Text>
      </Flex>
      {shortcut && (
        <Menu.ItemCommand fontSize="xs" color="gray.500" ml={4}>
          {shortcut}
        </Menu.ItemCommand>
      )}
    </Flex>
  </Menu.Item>
);

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

    console.log("Saving document with payload:", payload);

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
    exportToPdf(title, content);
  };
  return (
    <>
      <Menu.Root>
        <Menu.Trigger asChild>
          <Button
            variant="ghost"
            size="sm"
            p={2}
            _hover={{ bg: "gray.100" }}
            _active={{ bg: "gray.200" }}
            height="auto"
            minW="auto"
            fontWeight="medium"
          >
            <Text color="gray.700">파일</Text>
          </Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content
              minW="220px"
              p={1}
              borderRadius="md"
              boxShadow="lg"
              border="1px solid"
              borderColor="gray.200"
            >
              <Menu.ItemGroup>
                <MenuItem
                  icon={<LuFile />}
                  label="새 문서"
                  value="new_document"
                  shortcut="Ctrl+N"
                  onClick={handleNew}
                />
                <MenuItem
                  icon={<LuSave />}
                  label="저장"
                  value="save"
                  shortcut="Ctrl+S"
                  onClick={handleSave}
                />
                <MenuItem
                  icon={<LuFiles />}
                  label="복제"
                  value="duplicate"
                  onClick={() => {
                    setNewTitle(`${title} (복사본)`);
                    setOpen(true);
                  }}
                />
                <Menu.Separator my={1} />
                <Menu.Root
                  positioning={{ placement: "right-start", gutter: 2 }}
                >
                  <Menu.TriggerItem>
                    <Flex justify="space-between" align="center" width="100%">
                      <Flex align="center" gap={2}>
                        <LuDownload />
                        <Text>내보내기</Text>
                      </Flex>
                      <LuChevronRight />
                    </Flex>
                  </Menu.TriggerItem>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content
                        minW="180px"
                        p={1}
                        borderRadius="md"
                        boxShadow="lg"
                        border="1px solid"
                        borderColor="gray.200"
                      >
                        <MenuItem
                          icon={<Box boxSize={4} />}
                          label="PDF 문서"
                          value="export_pdf"
                          onClick={handleExportPDF}
                        />
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
  const dialog = useDialog();
  const [mode, setMode] = useState<"image" | "link">("image");

  const handleClickImageInsert = () => {
    dialog.setOpen(true);
    setMode("image");
  };

  const handleClickLinkInsert = () => {
    dialog.setOpen(true);
    setMode("link");
  };

  const handleImageInsert = (url: string) => {
    try {
      new URL(url);
      insertImage(editor, url);
    } catch (e) {
      alert("유효한 URL을 입력해주세요.");
    }
  };

  const handleTableSizeSelect = (rows: number, cols: number) => {
    // Use the insertTable function from example.tsx
    insertTable(editor, rows, cols);
  };

  const handleLinkInsert = (url: string) => {
    try {
      new URL(url);
      insertLink(editor, url);
    } catch (e) {
      alert("유효한 URL을 입력해주세요.");
    }
  };
  const handleChartInsert = () => {
    insertChart(editor);
  };
  return (
    <>
      <UrlDialog
        dialog={dialog}
        onSave={(url) => {
          if (mode === "image") {
            handleImageInsert(url);
          } else if (mode === "link") {
            handleLinkInsert(url);
          }
          dialog.setOpen(false);
        }}
        onCancel={() => dialog.setOpen(false)}
        mode={mode}
      />
      <Menu.Root>
        <Menu.Trigger asChild>
          <Button
            variant="ghost"
            size="sm"
            p={2}
            _hover={{ bg: "gray.100" }}
            _active={{ bg: "gray.200" }}
            height="auto"
            minW="auto"
            fontWeight="medium"
          >
            <Text color="gray.700">삽입</Text>
          </Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content
              minW="220px"
              p={1}
              borderRadius="md"
              boxShadow="lg"
              border="1px solid"
              borderColor="gray.200"
            >
              <Menu.ItemGroup>
                <MenuItem
                  icon={<LuImage />}
                  label="이미지"
                  value="insert_image"
                  shortcut="Ctrl+I"
                  onClick={handleClickImageInsert}
                />
                <TableSizeSelector
                  onSelect={handleTableSizeSelect}
                  trigger={
                    <MenuItem
                      icon={<LuTable2 />}
                      label="표"
                      value="insert_table"
                      shortcut="Ctrl+T"
                      onClick={() => {}}
                      closeOnSelect={false}
                    />
                  }
                />
                <MenuItem
                  icon={<LuChartColumnBig />}
                  label="차트"
                  value="insert_chart"
                  shortcut="Ctrl+G"
                  onClick={handleChartInsert}
                />

                <MenuItem
                  icon={<LuLink2 />}
                  label="링크"
                  value="insert_link"
                  shortcut="Ctrl+K"
                  onClick={handleClickLinkInsert}
                />
              </Menu.ItemGroup>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </>
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
        <Button
          variant="ghost"
          size="sm"
          p={2}
          _hover={{ bg: "gray.100" }}
          _active={{ bg: "gray.200" }}
          height="auto"
          minW="auto"
          fontWeight="medium"
        >
          <Text color="gray.700">서식</Text>
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.ItemGroup>
              <Menu.Root positioning={{ placement: "right-start", gutter: 2 }}>
                <Menu.TriggerItem>
                  <Flex justify="space-between" align="center" width="100%">
                    <Flex align="center" gap={2}>
                      <LuBold />
                      <Text>텍스트</Text>
                    </Flex>
                    <LuChevronRight />
                  </Flex>
                </Menu.TriggerItem>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content
                      minW="200px"
                      p={1}
                      borderRadius="md"
                      boxShadow="lg"
                      border="1px solid"
                      borderColor="gray.200"
                    >
                      <MenuItem
                        icon={<LuBold />}
                        label="굵게"
                        value="bold"
                        shortcut="Ctrl+B"
                        onClick={handleTextBold}
                      />
                      <MenuItem
                        icon={<LuItalic />}
                        label="기울임"
                        value="italic"
                        shortcut="Ctrl+I"
                        onClick={handleTextItalic}
                      />
                      <MenuItem
                        icon={<LuUnderline />}
                        label="밑줄"
                        value="underline"
                        shortcut="Ctrl+U"
                        onClick={handleTextUnderline}
                      />
                      <MenuItem
                        icon={<LuStrikethrough />}
                        label="취소선"
                        value="strikethrough"
                        shortcut="Ctrl+Shift+X"
                        onClick={handleTextStrikethrough}
                      />
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
              <Menu.Root positioning={{ placement: "right-start", gutter: 2 }}>
                <Menu.TriggerItem>
                  <Flex justify="space-between" align="center" width="100%">
                    <Flex align="center" gap={2}>
                      <LuAlignJustify />
                      <Text>정렬</Text>
                    </Flex>
                    <LuChevronRight />
                  </Flex>
                </Menu.TriggerItem>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content
                      minW="200px"
                      p={1}
                      borderRadius="md"
                      boxShadow="lg"
                      border="1px solid"
                      borderColor="gray.200"
                    >
                      <MenuItem
                        icon={<LuAlignLeft />}
                        label="왼쪽 정렬"
                        value="align_left"
                        shortcut="Ctrl+L"
                        onClick={handleTextAlignLeft}
                      />
                      <MenuItem
                        icon={<LuAlignCenter />}
                        label="중앙 정렬"
                        value="align_center"
                        shortcut="Ctrl+E"
                        onClick={handleTextAlignCenter}
                      />
                      <MenuItem
                        icon={<LuAlignRight />}
                        label="오른쪽 정렬"
                        value="align_right"
                        shortcut="Ctrl+R"
                        onClick={handleTextAlignRight}
                      />
                      <MenuItem
                        icon={<LuAlignJustify />}
                        label="양쪽 정렬"
                        value="align_justify"
                        shortcut="Ctrl+J"
                        onClick={handleTextAlignJustify}
                      />
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
    <Box width="100%" px={1}>
      <Flex align="center">
        <HStack gap={0}>
          <FileMenu id={id} title={title} content={content} editor={editor} />
          <InsertMenu editor={editor} />
          <DesignMenu editor={editor} />
        </HStack>
      </Flex>
    </Box>
  );
};

export default FileBar;
