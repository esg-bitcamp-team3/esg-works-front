"use client";

import React, { KeyboardEvent, MouseEvent, useCallback, useMemo } from "react";
import imageExtensions from "image-extensions";
import {
  Descendant,
  Editor,
  Element as SlateElement,
  Transforms,
  createEditor,
} from "slate";
import { withHistory } from "slate-history";
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  useFocused,
  useSelected,
  useSlate,
  useSlateStatic,
  withReact,
} from "slate-react";
import { Button, Icon, Toolbar } from "@/lib/editor/components";
import {
  ChartElement,
  CustomEditor,
  CustomElement,
  CustomElementType,
  CustomElementWithAlign,
  CustomTextKey,
  ImageElement,
  ParagraphElement,
  RenderElementPropsFor,
} from "./custom-types.d";
import { Chart as ChartJSComponent } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  registerables,
} from "chart.js";
import { Box } from "@chakra-ui/react";

const HOTKEYS: Record<string, CustomTextKey> = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"] as const;
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"] as const;

type AlignType = (typeof TEXT_ALIGN_TYPES)[number];
type ListType = (typeof LIST_TYPES)[number];
type CustomElementFormat = CustomElementType | AlignType | ListType;

// Function to check if a keyboard event matches a hotkey
const isKeyHotkey = (hotkey: string, event: KeyboardEvent): boolean => {
  const keys = hotkey.split("+");
  const modifierMap: Record<string, boolean> = {
    mod: event.metaKey || event.ctrlKey, // 'mod' works for both Mac and Windows
    ctrl: event.ctrlKey,
    alt: event.altKey,
    shift: event.shiftKey,
    meta: event.metaKey,
  };

  // The last key is the actual key (not a modifier)
  const mainKey = keys[keys.length - 1].toLowerCase();

  // Check if all modifiers are pressed
  const modifiersPressed = keys
    .slice(0, -1)
    .every((modifier) => modifierMap[modifier.toLowerCase()]);

  // Compare the main key (convert key to lowercase for case-insensitivity)
  const keyPressed =
    event.key.toLowerCase() === mainKey ||
    event.code.toLowerCase() === `key${mainKey}`;

  return modifiersPressed && keyPressed;
};

const RichTextExample = () => {
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );
  const editor = useMemo(
    () => withChart(withImages(withHistory(withReact(createEditor())))),
    []
  );

  return (
    <Box
      justifyContent="center"
      width="100%"
      height="100%"
      direction="column"
      borderRadius="md"
      boxShadow={"md"}
      padding={5}
    >
      <Slate editor={editor} initialValue={initialValue}>
        <Toolbar>
          <MarkButton format="bold" icon="format_bold" />
          <MarkButton format="italic" icon="format_italic" />
          <MarkButton format="underline" icon="format_underlined" />
          <MarkButton format="code" icon="code" />
          <InsertImageButton />
          <BlockButton format="heading-one" icon="looks_one" />
          <BlockButton format="heading-two" icon="looks_two" />
          <BlockButton format="block-quote" icon="format_quote" />
          <BlockButton format="numbered-list" icon="format_list_numbered" />
          <BlockButton format="bulleted-list" icon="format_list_bulleted" />
          <BlockButton format="left" icon="format_align_left" />
          <BlockButton format="center" icon="format_align_center" />
          <BlockButton format="right" icon="format_align_right" />
          <BlockButton format="justify" icon="format_align_justify" />
        </Toolbar>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some rich text…"
          spellCheck
          autoFocus
          onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
            for (const hotkey in HOTKEYS) {
              if (isKeyHotkey(hotkey, event)) {
                event.preventDefault();
                const mark = HOTKEYS[hotkey];
                toggleMark(editor, mark);
              }
            }

            if (event.key === "Enter" && !event.shiftKey) {
              const { selection } = editor;
              if (selection) {
                const [node] = Editor.node(editor, selection.focus.path);
                const [parent] = Editor.parent(editor, selection.focus.path);
                const [grandParent, grandParentPath] = Editor.above(editor, {
                  at: selection.focus.path,
                  match: (n) =>
                    SlateElement.isElement(n) && n.type === "chart-block",
                }) || [null, null];

                // Check if we're in a paragraph inside a chart-block
                if (
                  SlateElement.isElement(parent) &&
                  parent.type === "paragraph" &&
                  grandParent &&
                  SlateElement.isElement(grandParent) &&
                  grandParent.type === "chart-block"
                ) {
                  event.preventDefault();

                  // Insert a new paragraph after the chart-block
                  const path = [
                    ...grandParentPath.slice(0, -1),
                    grandParentPath[grandParentPath.length - 1] + 1,
                  ];
                  Transforms.insertNodes(
                    editor,
                    { type: "paragraph", children: [{ text: "" }] },
                    { at: path }
                  );
                  // Move selection to the new paragraph
                  Transforms.select(editor, path);
                  return;
                }
              }
            } else if (event.key === "Enter" && event.shiftKey) {
              const { selection } = editor;
              if (selection) {
                const [node] = Editor.node(editor, selection.focus.path);
                const [parent] = Editor.parent(editor, selection.focus.path);
                const [grandParent] = Editor.above(editor, {
                  at: selection.focus.path,
                  match: (n) =>
                    SlateElement.isElement(n) && n.type === "chart-block",
                }) || [null, null];

                // Check if we're in a paragraph inside a chart-block
                if (
                  SlateElement.isElement(parent) &&
                  parent.type === "paragraph" &&
                  grandParent
                ) {
                  event.preventDefault();
                  // Insert a newline character within the text
                  Editor.insertText(editor, "\n");
                  return;
                }
              }
            }
          }}
        />
      </Slate>
    </Box>
  );
};

const toggleBlock = (editor: CustomEditor, format: CustomElementFormat) => {
  const isActive = isBlockActive(
    editor,
    format,
    isAlignType(format) ? "align" : "type"
  );
  const isList = isListType(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      isListType(n.type) &&
      !isAlignType(format),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (isAlignType(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor: CustomEditor, format: CustomTextKey) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (
  editor: CustomEditor,
  format: CustomElementFormat,
  blockType: "type" | "align" = "type"
) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => {
        if (!Editor.isEditor(n) && SlateElement.isElement(n)) {
          if (blockType === "align" && isAlignElement(n)) {
            return n.align === format;
          }
          return n.type === format;
        }
        return false;
      },
    })
  );

  return !!match;
};

const isMarkActive = (editor: CustomEditor, format: CustomTextKey) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const Element = (props: RenderElementProps) => {
  const { attributes, children, element } = props;
  const style: React.CSSProperties = {};
  if (isAlignElement(element)) {
    style.textAlign = element.align as AlignType;
  }
  switch (element.type) {
    case "block-quote":
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case "heading-one":
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case "numbered-list":
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    case "image":
      return <Image {...props} />;
    case "chart":
      return <Chart {...props} />;
    case "chart-block":
      return <ChartBlock {...props} />;
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const withImages = (editor: CustomEditor) => {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === "image" ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");
    const { files } = data;

    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        const [mime] = file.type.split("/");

        if (mime === "image") {
          reader.addEventListener("load", () => {
            const url = reader.result;
            insertImage(editor, url as string);
          });

          reader.readAsDataURL(file);
        }
      });
    } else if (isImageUrl(text)) {
      insertImage(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const withChart = (editor: CustomEditor): CustomEditor => {
  const { isVoid, normalizeNode } = editor;

  editor.isVoid = (element) => {
    if (element.type === "chart") return true;
    return isVoid(element);
  };

  editor.normalizeNode = ([node, path]) => {
    if (SlateElement.isElement(node) && node.type === "chart-block") {
      // Ensure chart-block always has the expected structure
      const children = node.children;

      // Add normalization logic if needed, but simplified to avoid type errors
      if (children.length === 0) {
        // Add default structure if empty, using paragraphs instead of chart-text
        Transforms.insertNodes(
          editor,
          [
            { type: "paragraph", children: [{ text: "" }] },
            {
              type: "chart",
              chartType: "bar",
              data: { labels: [], datasets: [] },
              options: {},
              children: [{ text: "" }],
            },
            { type: "paragraph", children: [{ text: "" }] },
          ],
          { at: [...path, 0] }
        );
      }
    }

    // Fall back to the original normalization
    normalizeNode([node, path]);
  };

  return editor;
};

const insertImage = (editor: CustomEditor, url: string) => {
  const text = { text: "" };
  const image: ImageElement = { type: "image", url, children: [text] };
  Transforms.insertNodes(editor, image);
  const paragraph: ParagraphElement = {
    type: "paragraph",
    children: [{ text: "" }],
  };
  Transforms.insertNodes(editor, paragraph);
};

const Image = ({
  attributes,
  children,
  element,
}: RenderElementPropsFor<ImageElement>) => {
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);
  const selected = useSelected();
  const focused = useFocused();

  return (
    <div {...attributes}>
      {children}
      <div contentEditable={false} style={{ position: "relative" }}>
        <img
          src={element.url}
          style={{
            display: "block",
            maxWidth: "100%",
            maxHeight: "20em",
            boxShadow: selected && focused ? "0 0 0 3px #B4D5FF" : "none",
          }}
        />
        <Button
          active
          onClick={() => Transforms.removeNodes(editor, { at: path })}
          style={{
            display: selected && focused ? "inline" : "none",
            position: "absolute",
            top: "0.5em",
            left: "0.5em",
            backgroundColor: "white",
          }}
        >
          <Icon>delete</Icon>
        </Button>
      </div>
    </div>
  );
};

const InsertImageButton = () => {
  const editor = useSlateStatic();
  return (
    <Button
      onMouseDown={(event: MouseEvent) => {
        event.preventDefault();
        const url = window.prompt("Enter the URL of the image:");
        if (url && !isImageUrl(url)) {
          alert("URL is not an image");
          return;
        }
        url && insertImage(editor, url);
      }}
    >
      <Icon>image</Icon>
    </Button>
  );
};

const isImageUrl = (url: string): boolean => {
  if (!url) return false;
  // if (!isUrl(url)) return false
  const ext = new URL(url).pathname.split(".").pop();
  return imageExtensions.includes(ext!);
};

interface BlockButtonProps {
  format: CustomElementFormat;
  icon: string;
}

{
  /* Custom Element Format Types */
}
const insertChart = (editor: CustomEditor, url: string) => {
  const text = { text: "" };
  const chart: ChartElement = {
    type: "chart",
    chartType: "bar",
    data: {},
    options: {},
    children: [text],
  };
  Transforms.insertNodes(editor, chart);
  const paragraph: ParagraphElement = {
    type: "paragraph",
    children: [{ text: "" }],
  };
  Transforms.insertNodes(editor, paragraph);

  //   const chartNode = {
  //     type: 'chart',
  //     chartType,
  //     data,
  //     options,
  //     children: [{ text: '' }],
  //   };
  //   Transforms.insertNodes(editor, chartNode);
};

ChartJS.register(...registerables);

// const Chart = ({
//   attributes,
//   children,
//   element,
// }: RenderElementPropsFor<ChartElement>) => {
//   const { chartType, data, options } = element;
//   const editor = useSlateStatic();
//   const path = ReactEditor.findPath(editor, element);
//   const selected = useSelected();
//   const focused = useFocused();

//   return (
//     <div {...attributes}>
//       {children}
//       <div {...attributes} contentEditable={false} style={{ flex: 2 }}>
//         <ChartJSComponent type={chartType} data={data} options={options} />
//         <Button
//           active
//           onClick={() => Transforms.removeNodes(editor, { at: path })}
//           style={{
//             display: selected && focused ? "inline" : "none",
//             position: "absolute",
//             top: "0.5em",
//             left: "0.5em",
//             backgroundColor: "white",
//           }}
//         >
//           <Icon>delete</Icon>
//         </Button>
//       </div>
//     </div>
//   );
// };

const Chart = ({
  attributes,
  children,
  element,
}: RenderElementPropsFor<ChartElement>) => {
  const { chartType, data, options } = element;
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);
  const selected = useSelected();
  const focused = useFocused();
  // Set default size that's larger
  const [size, setSize] = React.useState({ width: 100, height: 300 });
  const isResizingRef = React.useRef(false);
  const chartContainerRef = React.useRef<HTMLDivElement>(null);
  const resizeRef = React.useRef<HTMLDivElement>(null);
  const [startX, setStartX] = React.useState(0);
  const [startY, setStartY] = React.useState(0);
  const [startWidth, setStartWidth] = React.useState(0);
  const [startHeight, setStartHeight] = React.useState(0);

  const onMouseDown = (e: globalThis.MouseEvent) => {
    console.log("Resize started");
    e.preventDefault();
    e.stopPropagation();
    isResizingRef.current = true;

    // Store initial position and size
    setStartX(e.clientX);
    setStartY(e.clientY);
    setStartWidth(chartContainerRef.current?.offsetWidth || 0);
    setStartHeight(chartContainerRef.current?.offsetHeight || 0);

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e: globalThis.MouseEvent) => {
    if (!isResizingRef.current) return;
    console.log("Resizing...");

    // 마우스 이동 거리 계산
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    // 새 너비와 높이 계산 (최소 크기 적용)
    const newWidth = Math.max(200, startWidth + deltaX);
    const newHeight = Math.max(150, startHeight + deltaY);

    // 상태를 픽셀 단위로 저장
    setSize({
      width: newWidth, // 픽셀(px) 단위
      height: newHeight, // 픽셀(px) 단위
    });

    // Update size state
    console.log("Resizing to:", newWidth, newHeight);
  };

  const onMouseUp = () => {
    isResizingRef.current = false;

    console.log("Resize ended");
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  // Handle resize interactions
  React.useEffect(() => {
    if (!resizeRef.current || !chartContainerRef.current) return;

    const resizeElement = resizeRef.current;

    resizeElement.addEventListener("mousedown", onMouseDown);

    return () => {
      resizeElement.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [resizeRef.current, chartContainerRef.current]);

  return (
    <div {...attributes}>
      {children}
      <div
        ref={chartContainerRef}
        contentEditable={false}
        style={{
          flex: "none", // flex-grow 0으로 고정 크기
          width: `${size.width}px`, // 픽셀 단위로 변경
          height: `${size.height}px`,
          position: "relative",
          transition: isResizingRef.current
            ? "none"
            : "width 0.2s, height 0.2s",
          boxShadow: selected && focused ? "0 0 0 2px #B4D5FF" : "none",
          minWidth: "300px",
          backgroundColor: "#f9f9f9",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div style={{ width: "100%", height: "100%", padding: "8px" }}>
          <ChartJSComponent
            type={chartType}
            data={
              data || {
                labels: ["A", "B", "C"],
                datasets: [{ label: "Example", data: [10, 20, 30] }],
              }
            }
            options={{
              ...options,
              maintainAspectRatio: false,
              responsive: true,
            }}
          />
        </div>

        {selected && (
          <>
            <Button
              active
              onClick={() => Transforms.removeNodes(editor, { at: path })}
              style={{
                position: "absolute",
                top: "0.5em",
                left: "0.5em",
                backgroundColor: "white",
                zIndex: 10,
              }}
            >
              <Icon>delete</Icon>
            </Button>

            <div
              ref={resizeRef}
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: "16px",
                height: "16px",
                cursor: "nwse-resize",
                backgroundColor: "#B4D5FF",
                borderRadius: "2px",
                zIndex: 100,
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

// const ChartBlock = ({ attributes, children }: RenderElementProps) => {
//   return (
//     <div
//       {...attributes}
//       style={{
//         display: "flex",
//         gap: "16px",
//         width: "100%",
//       }}
//     >
//       {children}
//     </div>
//   );
// };

const ChartBlock = ({ attributes, children }: RenderElementProps) => {
  return (
    <div
      {...attributes}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        width: "100%",
        minHeight: "200px",
        marginBottom: "24px",
      }}
    >
      {children}
    </div>
  );
};

const ChartText = ({ attributes, children }: RenderElementProps) => {
  const editor = useSlateStatic();

  // Handle key down events specific to chart text areas
  const handleKeyDown = (event: React.KeyboardEvent) => {
    // For Shift+Enter, insert a soft break
    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      Editor.insertText(editor, "\n");
      return;
    }
  };

  return (
    <div
      {...attributes}
      style={{
        flex: 1,
        minWidth: 0,
        whiteSpace: "pre-wrap", // Preserve line breaks
      }}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
};

const BlockButton = ({ format, icon }: BlockButtonProps) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        isAlignType(format) ? "align" : "type"
      )}
      onMouseDown={(event: MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

interface MarkButtonProps {
  format: CustomTextKey;
  icon: string;
}

const MarkButton = ({ format, icon }: MarkButtonProps) => {
  const editor = useSlate();
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event: MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

const isAlignType = (format: CustomElementFormat): format is AlignType => {
  return TEXT_ALIGN_TYPES.includes(format as AlignType);
};

const isListType = (format: CustomElementFormat): format is ListType => {
  return LIST_TYPES.includes(format as ListType);
};

const isAlignElement = (
  element: CustomElement
): element is CustomElementWithAlign => {
  return "align" in element;
};

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [
      { text: "This is editable " },
      { text: "rich", bold: true },
      { text: " text, " },
      { text: "much", italic: true },
      { text: " better than a " },
      { text: "<textarea>", code: true },
      { text: "!" },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Since it's rich text, you can do things like turn a selection of text ",
      },
      { text: "bold", bold: true },
      {
        text: ", or add a semantically rendered block quote in the middle of the page, like this:",
      },
    ],
  },

  {
    type: "block-quote",
    children: [{ text: "A wise quote." }],
  },
  {
    type: "paragraph",
    align: "center",
    children: [{ text: "Try it out for yourself!" }],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "이 차트는 예시로 삽입된 것입니다. 아래에 내용을 이어서 작성해보세요.",
      },
    ],
  },
  {
    type: "chart-block",
    children: [
      {
        type: "paragraph", // Use a special type for text sections
        children: [
          { text: "왼쪽 설명을 입력하세요.\n여러 줄 입력이 가능합니다." },
        ],
      },
      {
        type: "chart",
        chartType: "bar",
        data: {
          labels: ["A", "B", "C"],
          datasets: [{ label: "Example", data: [10, 20, 30] }],
        },
        options: {},
        children: [{ text: "" }],
      },
    ],
  },
];

export default RichTextExample;
