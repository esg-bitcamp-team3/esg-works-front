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
  selectedColors: string[];
  setSelectedColors: (colors: Color[]) => void;
  backgroundColor: string;
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
    <Flex direction="column" padding="10px">
      {/* <Drawer.Root>
        <Drawer.Trigger asChild>
          <Button
            variant="outline"
            size="sm"
            color="#2F6EEA"
            backgroundColor="white"
            _hover={{ bg: "gray.300" }}
          >
            <Text fontSize="sm" color="#2F6EEA">
              수정하기
            </Text>
          </Button>
        </Drawer.Trigger> */}

      {/* <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner padding="4">
            <Drawer.Content rounded="md" width="360px">
              <Drawer.Header>
                <Drawer.Title fontSize="lg" fontWeight="bold">
                  차트 설정
                </Drawer.Title>
              </Drawer.Header>

              <Drawer.Body display="flex" flexDirection="column" gap="4"> */}
      <Accordion.Root collapsible defaultValue={["a"]} variant="enclosed">
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
      </Accordion.Root>

      <Accordion.Root collapsible variant="enclosed">
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
      {/* </Drawer.Body>

              <Drawer.Footer display="flex" justifyContent="flex-end" gap="2">
                <Button variant="outline">취소</Button>
                <Button colorScheme="blue">적용</Button>
              </Drawer.Footer>

              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" position="absolute" top="2" right="2" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root> */}
    </Flex>
  );
};

export default ChartColor;
