"use client";

import React, {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import imageExtensions from "image-extensions";
import {
  Descendant,
  Editor,
  Element as SlateElement,
  Range,
  Transforms,
  createEditor,
  Point,
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
  ButtonElement,
  ChartBlockElement,
  ChartElement,
  CustomEditor,
  CustomElement,
  CustomElementType,
  CustomElementWithAlign,
  CustomTextKey,
  ImageElement,
  LinkElement,
  ParagraphElement,
  RenderElementPropsFor,
  TableElement,
} from "./custom-types.d";
import { Chart as ChartJSComponent } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  registerables,
} from "chart.js";
import { useDrop } from "react-dnd";
import {
  Box,
  Flex,
  HStack,
  Separator,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import SaveButton from "./components/SaveButton";
import { apiClient } from "../api/client";
import EditorLoadingState from "./components/EditorLoadingState";
import EditableTitle from "./components/EditableTitle";
import FileBar from "./components/FileBar";
import { ChartDetail } from "../api/interfaces/chart";
import { LuStar } from "react-icons/lu";
import isUrl from "is-url";
import { data } from "react-router-dom";
import { ESGData } from "../api/interfaces/esgData";

export interface Report {
  id: string;
  title: string;
  content: string; // Serialized content
}

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

type ChartLayout = "full" | "left" | "right" | "center";

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

const RichTextExample = ({ documentId }: { documentId?: string }) => {
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );
  const editor = useMemo(
    () =>
      withInlines(
        withTables(
          withChart(withImages(withHistory(withReact(createEditor()))))
        )
      ),
    []
  );
  //Drag & Drop
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "CHART_ICON",
    drop: (item: { chartType: string; data: ChartDetail }) => {
      // Get proper chart type from properties
      const chartType = item.data.dataSets[0]?.chartProperties?.type || "bar";

      // For pie/doughnut charts, use category IDs as labels
      const isPieOrDoughnut = chartType === "pie" || chartType === "doughnut";

      let labels = [];
      if (isPieOrDoughnut) {
        // For pie/doughnut, use category IDs as labels
        labels = item.data.labels;
      } else {
        // For other chart types, use years as labels
        const allYears = item.data.dataSets.flatMap((dataset) =>
          dataset.esgDataList.map((item: ESGData) => item.year)
        );
        labels = [...new Set(allYears)].sort();
      }

      const chartData = {
        labels: labels,
        datasets: item.data.dataSets.map((dataset) => {
          // Get properties from chartProperties object if it exists
          const properties = dataset.chartProperties || {};

          // Create base dataset with required properties
          const chartDataset: any = {
            label: properties.label || dataset.label,
            data: dataset.esgDataList.map((item: ESGData) =>
              parseFloat(item.value)
            ),
          };

          // Only add backgroundColor if it exists
          if (properties.backgroundColor) {
            chartDataset.backgroundColor = Array.isArray(
              properties.backgroundColor
            )
              ? properties.backgroundColor
              : [properties.backgroundColor];
          }

          // Only add borderColor if it exists
          if (properties.borderColor) {
            chartDataset.borderColor = Array.isArray(properties.borderColor)
              ? properties.borderColor
              : [properties.borderColor];
          }

          // Add other properties only if they exist and have values
          if (properties.borderWidth) {
            chartDataset.borderWidth = parseFloat(properties.borderWidth);
          }

          if (properties.fill === "true") {
            chartDataset.fill = true;
          } else if (properties.fill === "false") {
            chartDataset.fill = false;
          }

          // Add line chart specific properties only if they exist
          if (properties.tension) {
            chartDataset.tension = parseFloat(properties.tension);
          }

          if (properties.pointBackgroundColor) {
            chartDataset.pointBackgroundColor = properties.pointBackgroundColor;
          }

          if (properties.pointBorderColor) {
            chartDataset.pointBorderColor = properties.pointBorderColor;
          }

          if (properties.pointHoverBackgroundColor) {
            chartDataset.pointHoverBackgroundColor =
              properties.pointHoverBackgroundColor;
          }

          if (properties.pointHoverBorderColor) {
            chartDataset.pointHoverBorderColor =
              properties.pointHoverBorderColor;
          }

          if (properties.pointRadius) {
            chartDataset.pointRadius = parseFloat(properties.pointRadius);
          }

          if (properties.pointHoverRadius) {
            chartDataset.pointHoverRadius = parseFloat(
              properties.pointHoverRadius
            );
          }

          if (properties.pointStyle) {
            chartDataset.pointStyle = properties.pointStyle;
          }

          // Pie/Doughnut specific fields
          if (properties.hoverOffset) {
            chartDataset.hoverOffset = parseFloat(properties.hoverOffset);
          }

          if (properties.offset) {
            chartDataset.offset = parseFloat(properties.offset);
          }

          if (properties.circumference) {
            chartDataset.circumference = parseFloat(properties.circumference);
          }

          if (properties.rotation) {
            chartDataset.rotation = parseFloat(properties.rotation);
          }

          if (properties.cutout) {
            chartDataset.cutout = properties.cutout;
          }

          if (properties.weight) {
            chartDataset.weight = parseFloat(properties.weight);
          }

          return chartDataset;
        }),
      };

      // Parse options and add formatter
      const parsedOptions = item.data.options
        ? JSON.parse(item.data.options)
        : {};
      const chartOptions = {
        ...parsedOptions,
        plugins: {
          ...parsedOptions.plugins,
          datalabels: {
            ...parsedOptions.plugins?.datalabels,
            formatter: (value: number, context: any) => {
              const datalabelsOptions = parsedOptions.plugins?.datalabels || {};

              // Extract format options from the parsed options
              const format = datalabelsOptions.format || "number";
              const prefix = datalabelsOptions.prefix || "";
              const postfix = datalabelsOptions.postfix || "";
              const decimals = datalabelsOptions.decimals || 2;
              const digits = datalabelsOptions.digits || 0;

              let formattedValue: string | number = value;

              // 숫자 단위 적용
              let divider = 1;
              let unitSuffix = "";

              switch (digits) {
                case 1: // 천 단위
                  divider = 1000;
                  unitSuffix = "K";
                  break;
                case 2: // 백만 단위
                  divider = 1000000;
                  unitSuffix = "M";
                  break;
                case 3: // 십억 단위
                  divider = 1000000000;
                  unitSuffix = "B";
                  break;
              }

              // 단위 변환 적용
              if (divider > 1) {
                formattedValue = value / divider;
              }

              // 포맷 적용
              switch (format) {
                case "percent":
                  const total = context.dataset.data.reduce(
                    (sum: number, val: number) => sum + val,
                    0
                  );
                  formattedValue = ((value / total) * 100).toFixed(decimals);
                  if (!postfix && unitSuffix === "") {
                    unitSuffix = "%";
                  }
                  break;
                case "currency":
                  formattedValue = new Intl.NumberFormat("ko-KR", {
                    style: "currency",
                    currency: "KRW",
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals,
                  }).format(formattedValue as number);
                  // 이미 통화 형식에 포함된 경우 단위 접미사는 추가하지 않음
                  unitSuffix = "";
                  break;
                case "number":
                  formattedValue = new Intl.NumberFormat("ko-KR", {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals,
                  }).format(formattedValue as number);
                  break;
                default:
                  formattedValue = (formattedValue as number).toFixed(decimals);
              }

              return `${prefix}${formattedValue}${unitSuffix}${postfix}`;
            },
          },
        },
      };

      const chartElement: ChartElement = {
        type: "chart",
        chartType: chartType,
        data: chartData,
        options: chartOptions,
        children: [{ text: "" }],
      };
      const chartBlock: ChartBlockElement = {
        type: "chart-block",
        layout: "full", // Default to full layout
        children: [chartElement],
      };
      console.log("Inserting chart block:", chartBlock);
      Transforms.insertNodes(editor, chartBlock);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));
  const [title, setTitle] = useState<string>("제목 없는 문서");
  const [value, setValue] = useState<Descendant[]>();
  const [isLoading, setIsLoading] = useState(documentId ? true : false);
  // 페이지 관련 상태 추가
  const [pageHeights, setPageHeights] = useState<number[]>([]);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  // A4 페이지 크기 (mm 단위)
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;
  // 화면 DPI에 따른 픽셀 변환 (96dpi 기준, 1mm = 3.78px)
  const MM_TO_PX = 3.78;
  const A4_WIDTH_PX = A4_WIDTH_MM * MM_TO_PX;
  const A4_HEIGHT_PX = A4_HEIGHT_MM * MM_TO_PX;

  // 페이지 높이 계산 함수
  const calculatePageBreaks = useCallback(() => {
    if (!editorContainerRef.current) return;

    const container = editorContainerRef.current;
    const containerHeight = container.scrollHeight;
    const pageCount = Math.ceil(containerHeight / A4_HEIGHT_PX);

    const heights = [];
    for (let i = 0; i < pageCount; i++) {
      heights.push(A4_HEIGHT_PX);
    }

    setPageHeights(heights);
  }, [A4_HEIGHT_PX]);

  // 편집기 내용이 변경될 때마다 페이지 계산
  useEffect(() => {
    if (value && !isLoading) {
      // 내용이 변경되면 약간의 지연 후 페이지 계산 (렌더링 완료 후)
      const timer = setTimeout(() => {
        calculatePageBreaks();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [value, isLoading, calculatePageBreaks]);

  // 창 크기가 변경될 때 페이지 계산
  useEffect(() => {
    window.addEventListener("resize", calculatePageBreaks);
    return () => window.removeEventListener("resize", calculatePageBreaks);
  }, [calculatePageBreaks]);

  // 문서 ID가 있으면 문서 불러오기
  useEffect(() => {
    if (documentId) {
      loadDocument(documentId);
    }
  }, [documentId]);

  const deserializeContent = (serialized: string): Descendant[] => {
    try {
      return JSON.parse(serialized);
    } catch (error) {
      console.error("Failed to parse editor content:", error);
      return initialValue; // 기본값으로 대체`
    }
  };

  const loadDocument = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<Report>(`/reports/${id}`);
      const data = response.data;
      console.log("Loaded document data:", data);
      // 편집기 내용 설정
      setValue(deserializeContent(data.content));
      setTitle(data.title || "제목 없는 문서");
    } catch (error) {
      console.error("Error loading document:", error);
      alert("문서를 불러오는데 실패했습니다.");
      setValue(initialValue); // 오류 시 기본값으로 설정
    } finally {
      setIsLoading(false);
    }
  };

  if (!value) {
    return null;
  }

  return (
    <Slate
      editor={editor}
      initialValue={value}
      onChange={(newValue) => {
        setValue(newValue);
      }}
    >
      <VStack justifyContent="center" w="100vw" h="100vh" mt={12}>
        <VStack
          w="100vw"
          h="auto"
          position="sticky"
          top={0}
          zIndex={150}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Box w="80%" justifyContent={"center"} alignItems={"center"}>
            <HStack justifyContent="start" alignItems="center" w="100%">
              {isLoading ? (
                <Skeleton height="48px" width="sm">
                  <EditableTitle title={title} onChange={setTitle} />
                </Skeleton>
              ) : (
                <EditableTitle title={title} onChange={setTitle} />
              )}
              <Icon
                style={{
                  cursor: "pointer",
                  marginLeft: "8px",
                  fontSize: "32px",
                  color: "#718096", // gray.400 equivalent
                }}
                onClick={() => {
                  // Toggle favorite status
                  // You can implement this functionality later
                  console.log("Toggle favorite for document:", documentId);
                }}
              >
                star_outline
              </Icon>
            </HStack>

            <FileBar
              id={documentId}
              title={title}
              content={value}
              editor={editor}
            />
          </Box>
          <Box
            px={10}
            py={2}
            w={"82%"}
            boxShadow={"md"}
            bg="gray.50"
            borderRadius="full"
            justifyContent="center"
            alignItems={"center"}
            m={2}
          >
            <Toolbar>
              <MarkButton format="bold" icon="format_bold" />
              <MarkButton format="italic" icon="format_italic" />
              <MarkButton format="underline" icon="format_underlined" />
              <MarkButton format="code" icon="code" />
              <BlockButton format="heading-one" icon="looks_one" />
              <BlockButton format="heading-two" icon="looks_two" />
              <BlockButton format="block-quote" icon="format_quote" />
              <BlockButton format="numbered-list" icon="format_list_numbered" />
              <BlockButton format="bulleted-list" icon="format_list_bulleted" />
              <BlockButton format="left" icon="format_align_left" />
              <BlockButton format="center" icon="format_align_center" />
              <BlockButton format="right" icon="format_align_right" />
              <BlockButton format="justify" icon="format_align_justify" />
              <ChartLayoutButton layout="full" icon="crop_7_5" />
              <ChartLayoutButton layout="right" icon="vertical_split" />
              <ChartLayoutButton
                layout="left"
                icon="vertical_split"
                flipped={true}
              />
              <ChartLayoutButton layout="center" icon="view_week" />
            </Toolbar>
          </Box>
        </VStack>
        <Box
          boxShadow={"md"}
          borderWidth="1px"
          borderColor="gray.300"
          borderStyle="solid"
          bg="white"
          height="100%"
          width="80%"
          overflow="auto"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            ref={drop}
            justifyContent="center"
            width="auto"
            height="100%"
            direction="column"
            bg="#fafafa"
            p={12}
          >
            <Box
              ref={editorContainerRef}
              p={4}
              flex="1"
              bg="white"
              minH="100%"
              width={`${A4_WIDTH_PX}px`}
              border={"1px solid #ddd"}
              style={{
                background: isOver ? "#E3F2FD" : "white",
                position: "relative",
              }}
            >
              {/* 페이지 구분선 렌더링 */}
              {/* {pageHeights.map((height, index) =>
                index > 0 ? (
                  <Box
                    key={`page-break-${index}`}
                    position="absolute"
                    left={0}
                    top={`${index * A4_HEIGHT_PX}px`}
                    width="100%"
                    height="20px"
                    zIndex={5}
                    style={{
                      borderTop: "1px dashed #aaa",
                      marginTop: "-10px",
                      pointerEvents: "none",
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0) 100%)",
                    }}
                  >
                    <Text
                      position="absolute"
                      right="10px"
                      top="3px"
                      fontSize="xs"
                      color="gray.500"
                    >
                      Page {index + 1}
                    </Text>
                  </Box>
                ) : null
              )} */}

              {isLoading ? (
                <EditorLoadingState />
              ) : (
                <Editable
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                  placeholder="Enter some rich text…"
                  spellCheck
                  autoFocus
                  style={{
                    width: "100%",
                    maxWidth: "100%",
                    minHeight: `${A4_HEIGHT_PX}px`,
                    // 페이지 규격에 맞는 여백 설정
                    padding: "25px",
                  }}
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
                        const [node] = Editor.node(
                          editor,
                          selection.focus.path
                        );
                        const [parent] = Editor.parent(
                          editor,
                          selection.focus.path
                        );
                        const [grandParent, grandParentPath] = Editor.above(
                          editor,
                          {
                            at: selection.focus.path,
                            match: (n) =>
                              SlateElement.isElement(n) &&
                              n.type === "chart-block",
                          }
                        ) || [null, null];

                        // Check if we're in a paragraph inside a chart-block
                        if (grandParent && grandParent.type === "chart-block") {
                          if (
                            SlateElement.isElement(node) &&
                            node.type === "chart"
                          ) {
                            event.preventDefault();

                            // Find the chart-block parent
                            const [chartBlock, chartBlockPath] = Editor.above(
                              editor,
                              {
                                at: selection.focus.path,
                                match: (n) =>
                                  SlateElement.isElement(n) &&
                                  n.type === "chart-block",
                              }
                            ) || [null, null];

                            if (chartBlock && chartBlockPath) {
                              // Insert a new paragraph after the chart-block
                              const path = [
                                ...chartBlockPath.slice(0, -1),
                                chartBlockPath[chartBlockPath.length - 1] + 1,
                              ];

                              // Create a new paragraph element
                              const paragraph: ParagraphElement = {
                                type: "paragraph",
                                children: [{ text: "" }],
                              };

                              // Insert the new paragraph after the chart-block
                              Transforms.insertNodes(editor, paragraph, {
                                at: path,
                              });

                              // Move the selection to the new paragraph
                              Transforms.select(
                                editor,
                                Editor.start(editor, path)
                              );
                            }

                            return;
                          } else {
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
                      }
                    } else if (event.key === "Enter" && event.shiftKey) {
                      const { selection } = editor;
                      if (selection) {
                        const [node] = Editor.node(
                          editor,
                          selection.focus.path
                        );
                        const [parent] = Editor.parent(
                          editor,
                          selection.focus.path
                        );
                        const [grandParent] = Editor.above(editor, {
                          at: selection.focus.path,
                          match: (n) =>
                            SlateElement.isElement(n) &&
                            n.type === "chart-block",
                        }) || [null, null];

                        // Check if we're in a paragraph inside a chart-block
                        if (
                          SlateElement.isElement(parent) &&
                          parent.type !== "chart" &&
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
              )}
            </Box>
          </Box>
        </Box>
      </VStack>
    </Slate>
  );
};

export const toggleBlock = (
  editor: CustomEditor,
  format: CustomElementFormat
) => {
  const isActive = isBlockActive(
    editor,
    format,
    isAlignType(format) ? "align" : "type"
  );
  const isList = isListType(format);

  // Check if we're in a chart-block
  const { selection } = editor;
  if (!selection) return;

  // Find if we're inside a chart-block
  const [chartBlockEntry] = Editor.nodes(editor, {
    at: selection,
    match: (n) => SlateElement.isElement(n) && n.type === "chart-block",
  }) || [null, null];

  const isInChartBlock = !!chartBlockEntry;

  // Special handling for chart-block paragraphs
  if (isInChartBlock) {
    // Get the current node (paragraph)
    const [currentNode, currentPath] = Editor.above(editor, {
      match: (n) =>
        SlateElement.isElement(n) &&
        n.type !== "chart-block" &&
        n.type !== "chart",
    }) || [null, null];

    if (currentNode && currentPath) {
      if (isAlignType(format)) {
        // For alignment, simply set the align property
        Transforms.setNodes(
          editor,
          { align: isActive ? undefined : format },
          { at: currentPath }
        );
      } else if (!isList) {
        // For non-list block types (headings, quotes, etc.)
        Transforms.setNodes(
          editor,
          { type: isActive ? "paragraph" : format },
          { at: currentPath }
        );
      } else {
        // For list items, we need special handling
        // First convert to list-item
        Transforms.setNodes(
          editor,
          { type: isActive ? "paragraph" : "list-item" },
          { at: currentPath }
        );

        if (!isActive) {
          // Wrap in appropriate list type
          Transforms.wrapNodes(
            editor,
            { type: format, children: [] },
            { at: currentPath }
          );
        }
      }
      return;
    }
  }

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

const setChartLayout = (editor: CustomEditor, layout: ChartLayout) => {
  const { selection } = editor;
  if (!selection) return;

  // Find the chart-block element (if any) that contains the current selection
  const [chartBlock, chartBlockPath] = Editor.above(editor, {
    at: selection,
    match: (n) => SlateElement.isElement(n) && n.type === "chart-block",
  }) || [null, null];

  if (!chartBlock || !chartBlockPath) {
    // No chart block found at the current selection
    return;
  }

  // Apply the new layout to the chart-block
  Transforms.setNodes(editor, { layout }, { at: chartBlockPath });

  // Restructure the chart-block's children based on the new layout
  const chartBlockElement = chartBlock as any; // Using any temporarily for easier restructuring
  const currentLayout = chartBlockElement.layout;
  const chartBlockChildren = Array.from(chartBlockElement.children);

  // Find chart element index
  const chartIndex = chartBlockChildren.findIndex(
    (child) => SlateElement.isElement(child) && child.type === "chart"
  );

  if (chartIndex === -1) return; // No chart found

  const paragraphs = chartBlockChildren.filter(
    (child, idx) =>
      idx !== chartIndex &&
      SlateElement.isElement(child) &&
      child.type === "paragraph"
  );

  // Create default paragraph if needed
  const defaultParagraph = {
    type: "paragraph",
    children: [{ text: "" }],
  };

  // Create new children array based on layout
  let newChildren: any[] = [];

  switch (layout) {
    case "full":
      newChildren = [chartBlockChildren[chartIndex]];
      break;
    case "left":
      newChildren = [
        chartBlockChildren[chartIndex],
        paragraphs[0] || defaultParagraph,
      ];
      break;
    case "right":
      newChildren = [
        paragraphs[0] || defaultParagraph,
        chartBlockChildren[chartIndex],
      ];
      break;
    case "center":
      newChildren = [
        paragraphs[0] || defaultParagraph,
        chartBlockChildren[chartIndex],
        paragraphs[1] || defaultParagraph,
      ];
      break;
  }

  // Remove the old chart block
  Transforms.removeNodes(editor, { at: chartBlockPath });

  // Insert the new chart block with the updated children
  Transforms.insertNodes(
    editor,
    {
      ...chartBlockElement,
      layout,
      children: newChildren,
    },
    { at: chartBlockPath }
  );
};

export const toggleMark = (editor: CustomEditor, format: CustomTextKey) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isChartBlockActive = (editor: CustomEditor) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: selection,
      match: (n) => SlateElement.isElement(n) && n.type === "chart-block",
    })
  );

  return !!match;
};

const isBlockActive = (
  editor: CustomEditor,
  format: CustomElementFormat,
  blockType: "type" | "align" = "type"
) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Editor.nodes(editor, {
    at: selection,
    match: (n) => {
      if (!Editor.isEditor(n) && SlateElement.isElement(n)) {
        if (blockType === "align" && isAlignElement(n)) {
          return n.align === format;
        }
        return n.type === format;
      }
      return false;
    },
    mode: "lowest", // Get the deepest matching node
  });

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
    case "table":
      return (
        <table
          style={{
            position: "relative",
          }}
        >
          <tbody {...attributes}>{children}</tbody>
        </table>
      );
    case "table-row":
      return <tr {...attributes}>{children}</tr>;
    case "table-cell":
      return <td {...attributes}>{children}</td>;
    case "link":
      return <LinkComponent {...props} />;
    case "button":
      return <EditableButtonComponent {...props} />;
    case "badge":
      return <BadgeComponent {...props} />;

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

const withTables = (editor: CustomEditor) => {
  const { deleteBackward, deleteForward, insertBreak } = editor;

  editor.deleteBackward = (unit: "character" | "word" | "line" | "block") => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [cell] = Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n.type === "table-cell",
      });

      if (cell) {
        const [, cellPath] = cell;
        const start = Editor.start(editor, cellPath);

        if (Point.equals(selection.anchor, start)) {
          return;
        }
      }
    }

    deleteBackward(unit);
  };

  editor.deleteForward = (unit) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [cell] = Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n.type === "table-cell",
      });

      if (cell) {
        const [, cellPath] = cell;
        const end = Editor.end(editor, cellPath);

        if (Point.equals(selection.anchor, end)) {
          return;
        }
      }
    }

    deleteForward(unit);
  };

  editor.insertBreak = () => {
    const { selection } = editor;

    if (selection) {
      const [table] = Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n.type === "table",
      });

      if (table) {
        return;
      }
    }

    insertBreak();
  };

  return editor;
};

export const insertImage = (editor: CustomEditor, url: string) => {
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

const InsertChartButton = () => {
  const editor = useSlateStatic();
  return (
    <Button
      onMouseDown={(event: MouseEvent) => {
        event.preventDefault();
        insertChart(editor);
      }}
    >
      <Icon>bar_chart</Icon>
    </Button>
  );
};

const InsertTableButton = () => {
  const editor = useSlateStatic();
  return (
    <Button
      onMouseDown={(event: MouseEvent) => {
        event.preventDefault();
        insertTable(editor);
      }}
    >
      <Icon>table_chart</Icon>
    </Button>
  );
};

interface ChartLayoutButtonProps {
  layout: ChartLayout;
  icon: string;
  flipped?: boolean;
}

const ChartLayoutButton = ({
  layout,
  icon,
  flipped,
}: ChartLayoutButtonProps) => {
  const editor = useSlate();

  // Check if the current chart-block has the specified layout
  const isLayoutActive = () => {
    const { selection } = editor;
    if (!selection) return false;

    const [chartBlock] = Array.from(
      Editor.nodes(editor, {
        at: selection,
        match: (n) => SlateElement.isElement(n) && n.type === "chart-block",
      })
    );

    if (!chartBlock) return false;

    return (chartBlock[0] as any).layout === layout;
  };

  return (
    <Button
      active={isChartBlockActive(editor) && isLayoutActive()}
      onMouseDown={(event: MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        setChartLayout(editor, layout);
      }}
    >
      <Icon flipped={flipped ? "true" : undefined}>{icon}</Icon>
    </Button>
  );
};

const isImageUrl = (url: string): boolean => {
  if (!url) return false;
  if (!isUrl(url)) return false;
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
export const insertChart = (editor: CustomEditor) => {
  // Create chart element with sample data
  const chartElement: ChartElement = {
    type: "chart",
    chartType: "bar",
    data: {
      labels: ["A", "B", "C"],
      datasets: [{ label: "Example", data: [10, 20, 30] }],
    },
    options: {},
    width: 300, // Add default width
    height: 300, // Add default height
    children: [{ text: "" }],
  };

  // Create chart-block wrapper with appropriate layout
  const chartBlock: ChartBlockElement = {
    type: "chart-block",
    layout: "full", // Default to full layout
    children: [chartElement],
  };

  // Insert the chart block at the current selection
  Transforms.insertNodes(editor, chartBlock);

  // Add a paragraph after the chart block
  const paragraph: ParagraphElement = {
    type: "paragraph",
    children: [{ text: "" }],
  };

  // Insert the paragraph after the chart block
  Transforms.insertNodes(editor, paragraph);

  // Move selection to the new paragraph
  const point = Editor.end(editor, []);
  Transforms.select(editor, point);
};

ChartJS.register(...registerables);

export const insertTable = (editor: CustomEditor, rows = 3, cols = 3) => {
  const tableRows = [];

  // Create header row
  const headerCells = [];
  for (let j = 0; j < cols; j++) {
    headerCells.push({
      type: "table-cell",
      children: [
        {
          text: String.fromCharCode(65 + j),
          bold: true,
        },
      ],
    });
  }
  tableRows.push({
    type: "table-row",
    children: headerCells,
  });

  // Create data rows
  for (let i = 0; i < rows - 1; i++) {
    const cells = [];
    for (let j = 0; j < cols; j++) {
      cells.push({
        type: "table-cell",
        children: [{ text: "" }],
      });
    }
    tableRows.push({
      type: "table-row",
      children: cells,
    });
  }

  // Insert the table
  const table: TableElement = {
    type: "table",
    children: tableRows,
  };

  Transforms.insertNodes(editor, table);

  // Move selection to a point after the table
  const point = Editor.after(editor, Editor.end(editor, []));

  // Only if we have a valid point, insert paragraph after the table
  if (point) {
    // Insert a new paragraph after the table, not inside it
    Transforms.insertNodes(
      editor,
      { type: "paragraph", children: [{ text: "" }] },
      { at: point }
    );

    // Move selection to the new paragraph
    Transforms.select(editor, point);
  }
};

// const Chart = ({
//   attributes,
//   children,
//   element,
// }: RenderElementPropsFor<ChartElement>) => {
//   const { chartType, data, options } = element;ㄴ
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
  const [size, setSize] = React.useState({
    width: element.width,
    height: element.height,
  });
  const isResizingRef = React.useRef(false);
  const chartContainerRef = React.useRef<HTMLDivElement>(null);
  const resizeRef = React.useRef<HTMLDivElement>(null);
  const [startX, setStartX] = React.useState(0);
  const [startY, setStartY] = React.useState(0);
  const [startWidth, setStartWidth] = React.useState(0);
  const [startHeight, setStartHeight] = React.useState(0);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = React.useRef<ChartJS | null>(null);

  // Create a memoized and safe version of the chart data
  const safeChartData = React.useMemo(() => {
    // Create deep clone of data to avoid reference issues
    return {
      labels: [...(data?.labels || ["A", "B", "C"])],
      datasets: (
        data?.datasets || [{ label: "Example", data: [10, 20, 30] }]
      ).map((dataset: { label?: string; data?: number[] }) => ({
        ...dataset,
        data: [...(dataset.data || [])],
      })),
    };
  }, [data]);

  // Create options with formatter
  const chartOptions = React.useMemo(() => {
    const baseOptions = {
      ...options,
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        ...options.plugins,
        datalabels: {
          ...options.plugins?.datalabels,
          formatter: (value: number, context: any) => {
            const datalabelsOptions = options.plugins?.datalabels || {};

            // Extract format options from the options
            const format = datalabelsOptions.format || "number";
            const prefix = datalabelsOptions.prefix || "";
            const postfix = datalabelsOptions.postfix || "";
            const decimals = datalabelsOptions.decimals || 2;
            const digits = datalabelsOptions.digits || 0;

            let formattedValue: string | number = value;

            // 숫자 단위 적용
            let divider = 1;
            let unitSuffix = "";

            switch (digits) {
              case 1: // 천 단위
                divider = 1000;
                unitSuffix = "K";
                break;
              case 2: // 백만 단위
                divider = 1000000;
                unitSuffix = "M";
                break;
              case 3: // 십억 단위
                divider = 1000000000;
                unitSuffix = "B";
                break;
            }

            // 단위 변환 적용
            if (divider > 1) {
              formattedValue = value / divider;
            }

            // 포맷 적용
            switch (format) {
              case "percent":
                const total = context.dataset.data.reduce(
                  (sum: number, val: number) => sum + val,
                  0
                );
                formattedValue = ((value / total) * 100).toFixed(decimals);
                if (!postfix && unitSuffix === "") {
                  unitSuffix = "%";
                }
                break;
              case "currency":
                formattedValue = new Intl.NumberFormat("ko-KR", {
                  style: "currency",
                  currency: "KRW",
                  minimumFractionDigits: decimals,
                  maximumFractionDigits: decimals,
                }).format(formattedValue as number);
                // 이미 통화 형식에 포함된 경우 단위 접미사는 추가하지 않음
                unitSuffix = "";
                break;
              case "number":
                formattedValue = new Intl.NumberFormat("ko-KR", {
                  minimumFractionDigits: decimals,
                  maximumFractionDigits: decimals,
                }).format(formattedValue as number);
                break;
              default:
                formattedValue = (formattedValue as number).toFixed(decimals);
            }

            return `${prefix}${formattedValue}${unitSuffix}${postfix}`;
          },
        },
      },
    };
    return baseOptions;
  }, [options]);

  // Add cleanup for Chart.js instances
  React.useEffect(() => {
    if (canvasRef.current) {
      // Destroy previous instance if it exists
      if (chartInstanceRef.current) {
        try {
          chartInstanceRef.current.destroy();
        } catch (e) {
          console.warn("Error destroying chart:", e);
        }
        chartInstanceRef.current = null;
      }

      // Create new chart instance
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        chartInstanceRef.current = new ChartJS(ctx, {
          type: chartType,
          data: safeChartData,
          options: chartOptions,
        });
      }
    }

    return () => {
      if (chartInstanceRef.current) {
        try {
          chartInstanceRef.current.destroy();
        } catch (e) {
          console.warn("Error destroying chart during cleanup:", e);
        }
        chartInstanceRef.current = null;
      }
    };
  }, [safeChartData, chartType, chartOptions]);

  const onMouseDown = (e: globalThis.MouseEvent) => {
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
    Transforms.setNodes(
      editor,
      { width: newWidth, height: newHeight },
      { at: path }
    );
  };

  const onMouseUp = () => {
    isResizingRef.current = false;

    const point = Editor.point(editor, path);
    Transforms.select(editor, point);

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
            data={safeChartData}
            options={chartOptions}
            ref={(chartInstance) => {
              if (chartInstance) {
                chartInstanceRef.current = chartInstance;
              }
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

const ChartBlock = ({ attributes, children, element }: RenderElementProps) => {
  const layout = (element as any).layout || "full";

  // Base container styles
  let containerStyle: React.CSSProperties = {
    display: "flex",
    gap: "16px",
    width: "100%",
    minHeight: "200px",
    marginBottom: "24px",
  };

  // Create styles for different layout types
  switch (layout) {
    case "full":
      containerStyle.flexDirection = "column";
      containerStyle.alignItems = "center";
      break;

    case "left":
      containerStyle.flexDirection = "row";
      containerStyle.justifyContent = "space-between";
      containerStyle.alignItems = "flex-start";
      break;

    case "right":
      containerStyle.flexDirection = "row";
      containerStyle.justifyContent = "space-between";
      containerStyle.alignItems = "flex-start";
      break;

    case "center":
      containerStyle.flexDirection = "row";
      containerStyle.justifyContent = "space-between";
      containerStyle.alignItems = "flex-start";
      break;
  }

  // Wrap children with appropriate styling based on layout
  const wrappedChildren = React.Children.map(children, (child, index) => {
    let childStyle: React.CSSProperties = {};

    if (layout === "right") {
      // First child in right layout (text) - start from center
      if (index === 0) {
        childStyle = { flex: 1, maxWidth: "50%" };
      } else {
        // Chart in right layout
        childStyle = {
          flex: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "50%",
        };
      }
    } else if (layout === "left") {
      // First child in left layout (text) - start from center
      if (index === 1) {
        childStyle = {
          flex: 1,
          width: "50%",
        };
      } else {
        // Chart in left layout
        childStyle = {
          flex: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "50%",
          maxWidth: "50%",
        };
      }
    } else if (layout === "center") {
      if (index === 0) {
        // Left text
        childStyle = {
          flex: 1,
          display: "flex",
          alignItems: "flex-start", // Center vertically
        };
      } else if (index === 2) {
        // Right text
        childStyle = {
          flex: 1,
          display: "flex",
          alignItems: "flex-start", // Center vertically
        };
      } else {
        // Chart in center
        childStyle = {
          flex: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "50%",
        };
      }
    } else {
      // Default flex for other cases
      childStyle = { flex: 1 };
    }

    return (
      <div key={`chart-block-child-${index}`} style={childStyle}>
        {child}
      </div>
    );
  });

  return (
    <div {...attributes} style={containerStyle}>
      {wrappedChildren}
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

const withInlines = (editor: CustomEditor) => {
  const { insertData, insertText, isInline, isElementReadOnly, isSelectable } =
    editor;

  editor.isInline = (element: CustomElement) =>
    ["link", "button", "badge"].includes(element.type) || isInline(element);

  editor.isElementReadOnly = (element: CustomElement) =>
    element.type === "badge" || isElementReadOnly(element);

  editor.isSelectable = (element: CustomElement) =>
    element.type !== "badge" && isSelectable(element);

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");

    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

export const insertLink = (editor: CustomEditor, url: string) => {
  if (editor.selection) {
    wrapLink(editor, url);
  }
};

export const insertButton = (editor: CustomEditor) => {
  if (editor.selection) {
    wrapButton(editor);
  }
};

const isLinkActive = (editor: CustomEditor): boolean => {
  const [link] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
  });
  return !!link;
};

const isButtonActive = (editor: CustomEditor): boolean => {
  const [button] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "button",
  });
  return !!button;
};

const unwrapLink = (editor: CustomEditor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
  });
};

const unwrapButton = (editor: CustomEditor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "button",
  });
};

const wrapLink = (editor: CustomEditor, url: string) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link: LinkElement = {
    type: "link",
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};

const wrapButton = (editor: CustomEditor) => {
  if (isButtonActive(editor)) {
    unwrapButton(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const button: ButtonElement = {
    type: "button",
    children: isCollapsed ? [{ text: "Edit me!" }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, button);
  } else {
    Transforms.wrapNodes(editor, button, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};

// Put this at the start and end of an inline component to work around this Chromium bug:
// https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
const InlineChromiumBugfix = () => (
  <span contentEditable={false} style={{ fontSize: 0 }}>
    {String.fromCodePoint(160) /* Non-breaking space */}
  </span>
);

const allowedSchemes = ["http:", "https:", "mailto:", "tel:"];

const LinkComponent = ({
  attributes,
  children,
  element,
}: RenderElementPropsFor<LinkElement>) => {
  const selected = useSelected();
  const safeUrl = useMemo(() => {
    let parsedUrl: URL | null = null;
    try {
      parsedUrl = new URL(element.url);
      // eslint-disable-next-line no-empty
    } catch {}
    if (parsedUrl && allowedSchemes.includes(parsedUrl.protocol)) {
      return parsedUrl.href;
    }
    return "about:blank";
  }, [element.url]);

  return (
    <a
      {...attributes}
      href={safeUrl}
      style={selected ? { boxShadow: "0 0 0 3px #ddd" } : undefined}
    >
      <InlineChromiumBugfix />
      {children}
      <InlineChromiumBugfix />
    </a>
  );
};

const EditableButtonComponent = ({
  attributes,
  children,
}: RenderElementProps) => {
  return (
    /*
      Note that this is not a true button, but a span with button-like CSS.
      True buttons are display:inline-block, but Chrome and Safari
      have a bad bug with display:inline-block inside contenteditable:
      - https://bugs.webkit.org/show_bug.cgi?id=105898
      - https://bugs.chromium.org/p/chromium/issues/detail?id=1088403
      Worse, one cannot override the display property: https://github.com/w3c/csswg-drafts/issues/3226
      The only current workaround is to emulate the appearance of a display:inline button using CSS.
    */
    <span
      {...attributes}
      onClick={(ev) => ev.preventDefault()}
      style={{
        margin: "0 0.1em",
        backgroundColor: "#efefef",
        padding: "2px 6px",
        border: "1px solid #767676",
        borderRadius: "2px",
        fontSize: "0.9em",
      }}
    >
      <InlineChromiumBugfix />
      {children}
      <InlineChromiumBugfix />
    </span>
  );
};

const BadgeComponent = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  const selected = useSelected();

  return (
    <span
      {...attributes}
      contentEditable={false}
      style={{
        backgroundColor: "green",
        color: "white",
        padding: "2px 6px",
        borderRadius: "2px",
        fontSize: "0.9em",
        boxShadow: selected ? "0 0 0 3px #ddd" : "none",
      }}
      data-playwright-selected={selected}
    >
      <InlineChromiumBugfix />
      {children}
      <InlineChromiumBugfix />
    </span>
  );
};

const AddLinkButton = () => {
  const editor = useSlate();
  return (
    <Button
      active={isLinkActive(editor)}
      onMouseDown={(event: MouseEvent) => {
        event.preventDefault();
        const url = window.prompt("Enter the URL of the link:");
        if (!url) return;
        insertLink(editor, url);
      }}
    >
      <Icon>link</Icon>
    </Button>
  );
};

const RemoveLinkButton = () => {
  const editor = useSlate();

  return (
    <Button
      active={isLinkActive(editor)}
      onMouseDown={(event: MouseEvent) => {
        if (isLinkActive(editor)) {
          unwrapLink(editor);
        }
      }}
    >
      <Icon>link_off</Icon>
    </Button>
  );
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
    layout: "center", // Set default layout
    children: [
      {
        type: "chart",
        chartType: "bar",
        data: {
          labels: ["A", "B", "C"],
          datasets: [{ label: "Example", data: [10, 20, 30] }],
        },
        children: [{ text: "" }],
      },
    ],
  },
];

export default RichTextExample;
