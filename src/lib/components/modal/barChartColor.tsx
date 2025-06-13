import {
  Box,
  ColorPicker,
  HStack,
  parseColor,
  Text,
  VStack,
  Flex,
  Color,
  Checkbox,
  Select,
  createListCollection,
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
  ChartData,
  ChartOptions,
} from "chart.js";
import { CategorizedESGDataList } from "@/lib/api/interfaces/categorizedEsgDataList";
import { Accordion, Span, NumberInput, Slider } from "@chakra-ui/react";
import { useEffect, useState } from "react";

type Position = "top" | "bottom" | "left" | "right";

// 타이틀/범례 위치를 선택하는 컴포넌트
const PositionSelector = ({
  position,
  setPosition,
}: {
  position: Position;
  setPosition: (position: Position) => void;
}) => {
  // 위치 선택 옵션 목록 정의
  const positions = createListCollection({
    items: [
      { label: "상단", value: "top" },
      { label: "하단", value: "bottom" },
      { label: "좌측", value: "left" },
      { label: "우측", value: "right" },
    ],
  });

  return (
    <Select.Root
      defaultValue={["top"]}
      collection={positions}
      size="xs"
      width="100px"
      value={[position]}
      onValueChange={(e) => setPosition(e.value[0] as Position)}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          {positions.items.map((position) => (
            <Select.Item item={position} key={position.value}>
              {position.label}
              <Select.ItemIndicator />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
};

// 차트 옵션(타이틀/범례 등) 설정 컴포넌트
const ChartPlugins = ({
  titleText,
  titleDisplay,
  titlePosition,
  setTitleText,
  setTitleDisplay,
  setTitlePosition,
  legendDisplay,
  legendPosition,
  setLegendDisplay,
  setLegendPosition,
}: {
  titleText: string;
  titleDisplay?: boolean;
  titlePosition?: Position;
  setTitleText: (text: string) => void;
  setTitleDisplay: (display: boolean) => void;
  setTitlePosition: (position: Position) => void;
  legendDisplay?: boolean;
  legendPosition?: Position;
  setLegendDisplay: (display: boolean) => void;
  setLegendPosition: (position: Position) => void;
}) => (
  <VStack width={"100%"} align="stretch">
    <VStack width="100%">
      <HStack justify="space-between" w="100%">
        <Checkbox.Root
          size="xs"
          checked={titleDisplay}
          onCheckedChange={(e) => setTitleDisplay(!!e.checked)}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label fontSize="xs">제목</Checkbox.Label>
        </Checkbox.Root>
        <PositionSelector
          position={titlePosition || "top"}
          setPosition={setTitlePosition}
        />
      </HStack>
      {/* 타이틀 입력 박스 (표시 여부에 따라 노출/숨김) */}
      <Box
        overflow="hidden"
        height={titleDisplay ? "32px" : "0"}
        transition="height 0.1s ease-in-out"
        w="100%"
        pl={4}
      >
        <input
          // size="xs"
          value={titleText}
          onChange={(e) => setTitleText(e.target.value)}
          style={{ width: "100%" }}
        />
      </Box>
    </VStack>
    <Box h="1px" bg="gray.200" my="3" />
    {/* 범례 옵션 */}
    <HStack justify="space-between" w="100%">
      <Checkbox.Root
        size="xs"
        checked={legendDisplay}
        onCheckedChange={(e) => setLegendDisplay(!!e.checked)}
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control />
        <Checkbox.Label fontSize="xs">범례</Checkbox.Label>
      </Checkbox.Root>
      <PositionSelector
        position={legendPosition || "top"}
        setPosition={setLegendPosition}
      />
    </HStack>
  </VStack>
);

interface ChartSettingsDrawerProps {
  categorizedEsgDataList: CategorizedESGDataList[];
  selectedColors: Color[];
  setSelectedColors: (colors: Color[]) => void;
  backgroundColor: Color;
  setBackgroundColor: (color: Color) => void;
  chartData: ChartData<"bar", (number | [number, number] | null)[], unknown>;
  setChartData: (
    data: ChartData<"bar", (number | [number, number] | null)[], unknown>
  ) => void;
  options: ChartOptions<"bar">;
  setOptions: (chartOptions: ChartOptions<"bar">) => void;
}

// export interface ChartContentProps {
//   categorizedEsgDataList: CategorizedESGDataList[];
//   charts: {
//     type: string;
//     label: string;
//     icons: React.ElementType;
//   }[];
// }

// 바 차트의 색상/옵션 (주요 상태 관리)
const BarChartColor = ({
  categorizedEsgDataList,
  selectedColors,
  setSelectedColors,
  backgroundColor,
  setBackgroundColor,
  chartData,
  setChartData,
  options,
  setOptions,
}: ChartSettingsDrawerProps) => {
  // Option 상태 관리 (타이틀, 범례 등)
  const [titleText, setTitleText] = useState<string>("");
  const [titleDisplay, setTitleDisplay] = useState<boolean>(true);
  const [titlePosition, setTitlePosition] = useState<Position>("top");
  const [legendDisplay, setLegendDisplay] = useState<boolean>(true);
  const [legendPosition, setLegendPosition] = useState<Position>("top");
  const [barRadius, setBarRadius] = useState<number>(8); // 기본 모서리 둥글기

  // 옵션 변경시 Chart.js 옵션 업데이트
  useEffect(() => {
    if (options) {
      const newOptions = { ...options };
      if (!newOptions.plugins) newOptions.plugins = {};
      if (!newOptions.plugins.title) newOptions.plugins.title = {};
      newOptions.plugins.title = {
        ...newOptions.plugins.title,
        display: titleDisplay,
        text: titleText || "Chart Title",
        position: titlePosition,
        font: { size: 16, weight: "bold" },
        padding: { top: 10, bottom: 20 },
      };
      if (!newOptions.plugins.legend) newOptions.plugins.legend = {};
      newOptions.plugins.legend = {
        ...newOptions.plugins.legend,
        display: legendDisplay,
        position: legendPosition,
        labels: { font: { size: 12 }, padding: 15 },
      };
      if (!newOptions.elements) newOptions.elements = {};
      newOptions.elements.bar = {
        ...newOptions.elements.bar,
        borderRadius: barRadius,
      };
      setOptions(newOptions);
    }
  }, [
    titleText,
    titleDisplay,
    titlePosition,
    legendDisplay,
    legendPosition,
    barRadius,
  ]);

  // 최초 진입시 옵션을 상태로 세팅 (기존 옵션 복원)
  useEffect(() => {
    if (options?.plugins?.title) {
      const titleOptions = options.plugins.title;
      if (titleOptions.text) setTitleText(titleOptions.text as string);
      if (titleOptions.display !== undefined)
        setTitleDisplay(!!titleOptions.display);
      if (titleOptions.position)
        setTitlePosition(titleOptions.position as Position);
    }
    if (options?.plugins?.legend) {
      const legendOptions = options.plugins.legend;
      if (legendOptions.display !== undefined)
        setLegendDisplay(!!legendOptions.display);
      if (legendOptions.position)
        setLegendPosition(legendOptions.position as Position);
    }
  }, []);

  // 바 색상 변경 함수 (각 막대마다 개별 색상 적용)
  const handleColorChange = (index: number, color: Color) => {
    const updatedColors = [...selectedColors];
    updatedColors[index] = color;
    setSelectedColors(updatedColors);

    if (chartData && chartData.datasets && chartData.datasets.length > 0) {
      const newChartData = { ...chartData };
      newChartData.datasets = [...chartData.datasets];

      // 모든 dataset을 순회하며 색상 업데이트(바차트는 여러 데이터셋일 수 있음)
      newChartData.datasets = newChartData.datasets.map((dataset, idx) => {
        if (Array.isArray(dataset.backgroundColor)) {
          const newBackgroundColors = [...dataset.backgroundColor];
          newBackgroundColors[index] = color.toString("hex");
          return { ...dataset, backgroundColor: newBackgroundColors };
        }
        // 만약 backgroundColor가 배열이 아니면 label 갯수만큼 배열 생성
        return {
          ...dataset,
          backgroundColor: Array(newChartData.labels?.length || 0)
            .fill(0)
            .map((_, i) =>
              i === index
                ? color.toString("hex")
                : selectedColors[i]?.toString("hex") || "#2F6EEA"
            ),
        };
      });

      setChartData(newChartData);
    }
  };

  // 차트 데이터가 바뀔 때마다 색상 동기화
  useEffect(() => {
    if (chartData?.datasets?.[0]?.backgroundColor) {
      const dataset = chartData.datasets[0];
      const colors = Array.isArray(dataset.backgroundColor)
        ? dataset.backgroundColor.map((color) =>
            typeof color === "string"
              ? parseColor(color)
              : parseColor("#2F6EEA")
          )
        : [];
      setSelectedColors(colors);
    }
  }, [chartData]);

  return (
    <Accordion.Root
      collapsible
      multiple
      defaultValue={["plugins", "chartcolor"]}
      variant="enclosed"
      size="sm"
    >
      {/* 차트 옵션 (타이틀/범례) */}
      <Accordion.Item value="plugins" bg="white">
        <Accordion.ItemTrigger>
          <Span flex="1" fontWeight="medium" mb="1">
            차트 옵션
          </Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent marginBottom="2">
          <ChartPlugins
            titleText={titleText}
            titleDisplay={titleDisplay}
            titlePosition={titlePosition}
            setTitleText={setTitleText}
            setTitleDisplay={setTitleDisplay}
            setTitlePosition={setTitlePosition}
            legendDisplay={legendDisplay}
            legendPosition={legendPosition}
            setLegendDisplay={setLegendDisplay}
            setLegendPosition={setLegendPosition}
          />
        </Accordion.ItemContent>
      </Accordion.Item>

      {/* 차트 색상 개별 지정 */}
      <Accordion.Item value="chartcolor" bg="white">
        <Accordion.ItemTrigger>
          <Span flex="1" fontWeight="medium" mb="1">
            차트 색상
          </Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent marginBottom="2">
          <VStack gap={2} align="stretch">
            {/* 각 막대별 색상 Picker */}
            {Array.isArray(chartData?.labels) &&
              chartData.labels.map((label, index) => (
                <HStack key={`chart-color-${index}`}>
                  <ColorPicker.Root
                    size="xs"
                    maxW="200px"
                    value={selectedColors[index] || parseColor("#2F6EEA")}
                    onValueChange={(e) => handleColorChange(index, e.value)}
                  >
                    <ColorPicker.HiddenInput />
                    <ColorPicker.Control>
                      <ColorPicker.Trigger>
                        <ColorPicker.ValueSwatch
                          rounded="inherit"
                          padding={2}
                        />
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
                  <Text w="100%">{label as string}</Text>
                </HStack>
              ))}
          </VStack>
        </Accordion.ItemContent>
      </Accordion.Item>

      {/* 차트 모서리 설정 */}
      <Accordion.Item value="chartradius" bg="white">
        <Accordion.ItemTrigger>
          <Span flex="1" fontWeight="medium" mb="1">
            차트 모서리
          </Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent marginBottom="2">
          <VStack gap={2} align="stretch">
            <Slider.Root
              aria-label={["bar radius slider"]}
              min={0}
              max={50}
              step={1}
              value={[barRadius]}
              onValueChange={(v) => {
                const num = Array.isArray(v.value) ? v.value[0] : v.value;
                if (!isNaN(num)) setBarRadius(num);
              }}
              width="120px"
            >
              <Slider.Control>
                <Slider.Track>
                  <Slider.Range />
                </Slider.Track>
                <Slider.Thumbs />
              </Slider.Control>
            </Slider.Root>
            <NumberInput.Root
              size="sm"
              min={0}
              max={50}
              value={barRadius.toString()}
              onValueChange={(v) => {
                const num = Number(v.value);
                if (!isNaN(num)) setBarRadius(num);
              }}
              width="100px"
            >
              <NumberInput.Control />
              <NumberInput.Input />
            </NumberInput.Root>
          </VStack>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default BarChartColor;
