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
  Slider,
  NumberInput,
  InputGroup,
  Input,
  Checkbox,
  createListCollection,
  Select,
  Separator,
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
import { Accordion, Span } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { fill } from "lodash";
import axios from "axios";
import { chartData } from "./chartData";
import { Filler } from "chart.js";

ChartJS.register(Filler); // ✅

const backgroundPlugin = {
  id: "custom_canvas_background_color",
  beforeDraw: (chart: any, args: any, options: any) => {
    const { ctx, chartArea } = chart;
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    const colorArray = options.colors || ["#ffffff"];
    const chartIndex = chart?.$context?.index || 0; // 없으면 0번
    const selectedColor = colorArray[chartIndex % colorArray.length];
    ctx.fillStyle = selectedColor;

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

interface LineChartSettingsProps {
  chartData: ChartData<"line">;
  setChartData: (data: ChartData<"line">) => void;
  options: ChartOptions<"line">;
  setOptions: (chartOptions: ChartOptions<"line">) => void;
}

const FillToggle = ({
  fill,
  setFill,
}: {
  fill: boolean;
  setFill: (value: boolean) => void;
}) => (
  <HStack align="center" justify="space-between" mb="4" width="100%">
    <Checkbox.Root checked={fill} onCheckedChange={(e) => setFill(!!e.checked)}>
      <Checkbox.HiddenInput />
      <Checkbox.Control />
      <Checkbox.Label fontSize="sm">채우기 (Fill)</Checkbox.Label>
    </Checkbox.Root>
  </HStack>
);

const RadiusSlider = ({
  radius,
  setRadius,
}: {
  radius: number;
  setRadius: (value: number) => void;
}) => (
  <HStack align="center" justify="space-between" mb="4" w={"100%"}>
    <Slider.Root
      value={[radius]}
      onValueChange={(e) => setRadius(e.value[0])}
      w={"60%"}
      size="sm"
      min={1}
      max={500}
    >
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumbs />
      </Slider.Control>
    </Slider.Root>
    <NumberInput.Root
      defaultValue="100"
      value={radius.toString()}
      onValueChange={(e) => setRadius(Number(e.value))}
      w={"20%"}
      min={1}
      max={500}
      size={"sm"}
    >
      <NumberInput.Control />
      <NumberInput.Input />
    </NumberInput.Root>
  </HStack>
);

type Position = "top" | "bottom" | "left" | "right";

const PositionSelector = ({
  position,
  setPosition,
}: {
  position: Position;
  setPosition: (position: Position) => void;
}) => {
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
        />{" "}
      </HStack>
      <Box
        overflow="hidden"
        height={titleDisplay ? "32px" : "0"}
        transition="height 0.1s ease-in-out"
        w="100%"
        pl={4}
      >
        <Input
          size="sm"
          placeholder={"제목을 입력하세요"}
          value={titleText}
          onChange={(e) => setTitleText(e.target.value)}
        />
      </Box>
    </VStack>
    <Separator />

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

const LineChartColor = ({
  chartData,
  setChartData,
  options,
  setOptions,
}: LineChartSettingsProps) => {
  const [selectedColors, setSelectedColors] = useState<Color[]>([]);

  const [titleText, setTitleText] = useState<string>("");
  const [titleDisplay, setTitleDisplay] = useState<boolean>(true);
  const [titlePosition, setTitlePosition] = useState<Position>("top");
  const [legendDisplay, setLegendDisplay] = useState<boolean>(true);
  const [legendPosition, setLegendPosition] = useState<Position>("top");
  const [fill, setFill] = useState<boolean>(false);

  useEffect(() => {
    if (options) {
      const newOptions = { ...options };

      // Ensure plugins object exists
      if (!newOptions.plugins) {
        newOptions.plugins = {};
      }

      // Update title options
      if (!newOptions.plugins.title) {
        newOptions.plugins.title = {};
      }

      newOptions.plugins.title = {
        ...newOptions.plugins.title,
        display: titleDisplay,
        text: titleText || "Chart Title",
        position: titlePosition,
        font: {
          size: 16,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      };

      // Update legend options
      if (!newOptions.plugins.legend) {
        newOptions.plugins.legend = {};
      }

      newOptions.plugins.legend = {
        ...newOptions.plugins.legend,
        display: legendDisplay,
        position: legendPosition,
        labels: {
          font: {
            size: 12,
          },
          padding: 15,
        },
      };

      // Update the chart options
      setOptions(newOptions);
    }
  }, [titleText, titleDisplay, titlePosition, legendDisplay, legendPosition]);

  // Initialize state from options when component mounts

  // Initialize legend settings from options
  useEffect(() => {
    if (options?.plugins?.legend) {
      const legendOptions = options.plugins.legend;
      if (legendOptions.display !== undefined) {
        setLegendDisplay(!!legendOptions.display);
      }
      if (legendOptions.position) {
        setLegendPosition(legendOptions.position as Position);
      }
    }
  }, []); // ✅ 컴포넌트 마운트 시에만 실행
  // Initialize cutout value from options

  // Initialize rotation value from options

  // Initialize selectedColors from chartData when it changes
  useEffect(() => {
    if (chartData?.datasets?.[0]?.backgroundColor) {
      const apiClient = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
        withCredentials: true, // 쿠키 기반 인증이면 필요함
      });

      apiClient.interceptors.request.use((config) => {
        const token = localStorage.getItem("accessToken"); // 또는 쿠키에서 가져오기
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      });
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

  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current && chartData?.datasets?.length > 0) {
      const colors = chartData.datasets.map((dataset) => {
        const bg = Array.isArray(dataset.backgroundColor)
          ? dataset.backgroundColor[0]
          : dataset.backgroundColor;

        return typeof bg === "string" ? parseColor(bg) : parseColor("#2F6EEA");
      });

      setSelectedColors(colors);
      initializedRef.current = true;
    }
  }, [chartData]);

  const hexToRgba = (hex: string, alpha: number): string => {
    const cleanHex = hex.replace("#", "");
    const bigint = parseInt(cleanHex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const handleColorChange = (index: number, color: Color) => {
    const updatedColors = [...selectedColors];
    updatedColors[index] = color;
    setSelectedColors(updatedColors);

    if (chartData && chartData.datasets && chartData.datasets.length > 0) {
      const newChartData = {
        ...chartData,
        datasets: chartData.datasets.map((dataset, i) => {
          const hex = updatedColors[i]?.toString("hex") || "#2F6EEA";
          const rgba = hexToRgba(hex, 0.3);
          const borderRgba = hexToRgba(hex, 1.0);

          return {
            ...dataset,
            backgroundColor: Array(chartData.labels?.length || 0).fill(rgba),
            borderColor: Array(chartData.labels?.length || 0).fill(borderRgba),
          };
        }),
      };

      setChartData(newChartData);
    }
  };

  // Update radius slider to directly modify chart options

  // Update rotation slider to directly modify chart options

  function handleFillChange(value: boolean): void {
    setFill(value);
    const fallbackColor = "rgba(75, 192, 192, 0.3)";

    const newChartData = {
      ...chartData,
      datasets: chartData.datasets.map((dataset) => {
        const current = Array.isArray(dataset.borderColor)
          ? dataset.borderColor[0]
          : dataset.borderColor ?? fallbackColor;

        const rgba = current.startsWith("rgba")
          ? current.replace(/[\d\.]+\)$/g, "0.3)") // 강제 투명도 조정
          : current.replace("rgb", "rgba").replace(")", ", 0.3)");

        return {
          ...dataset,
          fill: value,
          type: "line" as const,
          backgroundColor: value
            ? Array(chartData.labels?.length || 0).fill(rgba)
            : [],
        };
      }),
    };

    setChartData(newChartData);
  }
  return (
    <Accordion.Root
      collapsible
      multiple
      defaultValue={["a"]}
      variant="enclosed"
      size="sm"
    >
      {" "}
      <Accordion.Item value="plugins">
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
      <Accordion.Item value="chart">
        <Accordion.ItemTrigger>
          <Span flex="1" fontSize="sm" fontWeight="medium" mb="1">
            차트 색상
          </Span>

          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <HStack>
          <Accordion.ItemContent marginBottom="2">
            <VStack gap={2} align="stretch">
              {chartData.datasets?.map((dataset, index) => (
                <HStack key={`chart-color-${index}`}>
                  <ColorPicker.Root
                    size="xs"
                    maxW="200px"
                    value={selectedColors[index] || parseColor("white")}
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
                  <Text w="100%">{dataset.label as string}</Text>
                </HStack>
              ))}
            </VStack>
          </Accordion.ItemContent>
          {/*  */}
        </HStack>
      </Accordion.Item>
      <Accordion.Item value="cutout">
        <Accordion.ItemTrigger>
          <Span flex="1" fontWeight="medium" mb="1">
            채우기
          </Span>

          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent marginBottom="2">
          <Box w="100%" mt={4}>
            <FillToggle fill={fill} setFill={handleFillChange} />
          </Box>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default LineChartColor;
