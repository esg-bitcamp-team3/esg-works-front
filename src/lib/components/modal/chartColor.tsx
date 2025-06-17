import {
  Box,
  Button,
  CloseButton,
  ColorPicker,
  Drawer,
  HStack,
  parseColor,
  Portal,
  Text,
  VStack,
  Flex,
  Color,
} from "@chakra-ui/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { CategorizedESGDataList } from "@/lib/api/interfaces/categorizedEsgDataList";
import { Accordion, Span } from "@chakra-ui/react";

const backgroundPlugin = {
  id: "custom_canvas_background_color",
  beforeDraw: (chart: any, args: any, options: any) => {
    const { ctx, chartArea } = chart;
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = options.color || "#ffff"; // 블랙 대신 미드나잇 그레이
    // 배경 컬러를 차트 영역보다 약간 작게 적용
    if (chartArea) {
      const padding = {
        top: 12,
        bottom: 12,
        left: 12,
        right: 12,
      };
      ctx.fillRect(
        chartArea.left + padding.left,
        chartArea.top + padding.top,
        chartArea.right - chartArea.left - padding.left - padding.right,
        chartArea.bottom - chartArea.top - padding.top - padding.bottom
      );
    }
    ctx.restore();
  },
};
ChartJS.register(backgroundPlugin);

interface ChartSettingsDrawerProps {
  categorizedEsgDataList: CategorizedESGDataList[];
  selectedColors: Color[];
  setSelectedColors: (colors: Color[]) => void;
  backgroundColor: Color;
  setBackgroundColor: (color: Color) => void;
}

const Seperator = () => <Box h="1px" bg="gray.200" my="3" />;

const ChartColor = ({
  categorizedEsgDataList,
  selectedColors,
  setSelectedColors,
  backgroundColor,
  setBackgroundColor,
}: ChartSettingsDrawerProps) => {
  return (
      <Accordion.Root collapsible defaultValue={["a"]} variant="enclosed" bg={"white"}>
        <Accordion.Item value="b">
          <Accordion.ItemTrigger>
            <Span flex="1" fontWeight="medium" mb="1">
              차트 배경
            </Span>

            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>

          <Accordion.ItemContent marginBottom="2">
            {/* <input
              type="color"
              value={backgroundColor || "#ffffff"}
              onChange={(e) => setBackgroundColor(e.target.value)}
              defaultValue="#ffffff"
            /> */}
          </Accordion.ItemContent>
        </Accordion.Item>
        <Accordion.Item value="b">
          <Accordion.ItemTrigger>
            <Span flex="1" fontWeight="medium" mb="1">
              차트 색상
            </Span>

            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent marginBottom="2">
            <VStack gap={2} align="stretch">
              {categorizedEsgDataList.map((category, index) => (
                <HStack key={category.categoryDetailDTO.categoryId}>
                  {/* <input
                              type="color"
                              value={selectedColors[index] || "#2F6EEA"}
                              onChange={(e) => {
                                const updated = [...selectedColors];
                                updated[index] = e.target.value;
                                setSelectedColors(updated);
                              }}
                              defaultValue="#2F6EEA"
                            /> */}
                  <ColorPicker.Root
                    size="xs"
                    defaultValue={parseColor("#eb5e41")}
                    maxW="200px"
                  >
                    <ColorPicker.HiddenInput />
                    <ColorPicker.Control>
                      <ColorPicker.Trigger data-fit-content rounded="full">
                        <ColorPicker.ValueSwatch rounded="inherit" />
                      </ColorPicker.Trigger>
                    </ColorPicker.Control>
                    <ColorPicker.Positioner>
                      <ColorPicker.Content>
                        <ColorPicker.Area />
                        <HStack>
                          <ColorPicker.EyeDropper
                            size="2xs"
                            variant="outline"
                          />
                          <ColorPicker.Sliders />
                        </HStack>
                      </ColorPicker.Content>
                    </ColorPicker.Positioner>
                  </ColorPicker.Root>
                  <Text w="100%">
                    {category.categoryDetailDTO.categoryName}
                  </Text>
                </HStack>
              ))}
            </VStack>
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>
  );
};

export default ChartColor;
