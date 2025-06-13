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
import { useEffect, useState } from "react";

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
  chartData: ChartData<"pie" | "doughnut">;
  setChartData: (data: ChartData<"pie" | "doughnut">) => void;
  options: ChartOptions<"pie" | "doughnut">;
  setOptions: (chartOptions: ChartOptions<"pie" | "doughnut">) => void;
}

const Seperator = () => <Box h="1px" bg="gray.200" my="3" />;

const CutoutSlider = ({
  cutout,
  setCutout,
}: {
  cutout: number;
  setCutout: (value: number) => void;
}) => (
  <HStack align="center" justify="space-between" mb="4" width="100%">
    <Slider.Root
      value={[cutout]}
      onValueChange={(e) => setCutout(e.value[0])}
      width={"60%"}
      size={"sm"}
    >
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumbs />
      </Slider.Control>
    </Slider.Root>
    <Text fontSize="sm" color="gray.600" width={"15%"}>
      {cutout}%
    </Text>
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

const RotateSlider = ({
  rotation,
  setRotation,
}: {
  rotation: number;
  setRotation: (value: number) => void;
}) => (
  <HStack align="center" justify="space-between" mb="4" w={"100%"}>
    <Slider.Root
      value={[rotation]}
      onValueChange={(e) => setRotation(e.value[0])}
      w={"60%"}
      size="sm"
      min={0}
      max={360}
    >
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumbs />
      </Slider.Control>
    </Slider.Root>
    <InputGroup endElement="°" w={"20%"}>
      <Input
        defaultValue="0"
        value={rotation.toString()}
        onChange={(e) => setRotation(Number(e.target.value))}
        min={0}
        max={360}
        size={"sm"}
      />
    </InputGroup>
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
        />
      </HStack>
      <Box
        overflow="hidden"
        height={titleDisplay ? "32px" : "0"}
        transition="height 0.1s ease-in-out"
        w="100%"
        pl={4}
      >
        <Input
          size="xs"
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

const PieChartColor = ({
  chartData,
  setChartData,
  options,
  setOptions,
}: ChartSettingsDrawerProps) => {
  const [selectedColors, setSelectedColors] = useState<Color[]>([]);
  const [cutout, setCutout] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [radius, setRadius] = useState<number>(100);
  const [titleText, setTitleText] = useState<string>("");
  const [titleDisplay, setTitleDisplay] = useState<boolean>(true);
  const [titlePosition, setTitlePosition] = useState<Position>("top");
  const [legendDisplay, setLegendDisplay] = useState<boolean>(true);
  const [legendPosition, setLegendPosition] = useState<Position>("top");

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
  useEffect(() => {
    // Initialize title settings from options
    if (options?.plugins?.title) {
      const titleOptions = options.plugins.title;
      if (titleOptions.text) {
        setTitleText(titleOptions.text as string);
      }
      if (titleOptions.display !== undefined) {
        setTitleDisplay(!!titleOptions.display);
      }
      if (titleOptions.position) {
        setTitlePosition(titleOptions.position as Position);
      }
    }

    // Initialize legend settings from options
    if (options?.plugins?.legend) {
      const legendOptions = options.plugins.legend;
      if (legendOptions.display !== undefined) {
        setLegendDisplay(!!legendOptions.display);
      }
      if (legendOptions.position) {
        setLegendPosition(legendOptions.position as Position);
      }
    }
    // Initialize cutout value from options
    if (options?.cutout !== undefined) {
      const cutoutValue =
        typeof options.cutout === "string"
          ? parseInt(options.cutout)
          : typeof options.cutout === "function"
          ? 0 // Default value for function case
          : (options.cutout as number);
      console.log("cutoutValue", cutoutValue);
      setCutout(cutoutValue || 0);
    }

    // Initialize rotation value from options
    if (options?.rotation !== undefined) {
      // Convert radians to degrees (Chart.js uses radians)
      const rotationDegrees = ((options.rotation as number) * 180) / Math.PI;
      setRotation(rotationDegrees || 0);
    }

    // Initialize radius from options
    if (options?.radius !== undefined) {
      setRadius((options.radius as number) || 100);
    }
  }, []);

  // Initialize selectedColors from chartData when it changes
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

  const handleColorChange = (index: number, color: Color) => {
    const updatedColors = [...selectedColors];
    updatedColors[index] = color;
    setSelectedColors(updatedColors);

    // Update the chart data directly
    if (chartData && chartData.datasets && chartData.datasets.length > 0) {
      // Create a deep copy of the chart data to avoid reference issues
      const newChartData = { ...chartData };
      newChartData.datasets = [...chartData.datasets];

      // Clone the dataset we want to modify
      const newDataset = { ...newChartData.datasets[0] };

      // Update backgroundColor
      if (Array.isArray(newDataset.backgroundColor)) {
        const newBackgroundColors = [...newDataset.backgroundColor];
        newBackgroundColors[index] = color.toString("hex");
        newDataset.backgroundColor = newBackgroundColors;
      } else {
        // If backgroundColor is not an array, make it one
        newDataset.backgroundColor = Array(chartData.labels?.length || 0)
          .fill(0)
          .map((_, i) =>
            i === index
              ? color.toString("hex")
              : selectedColors[i]?.toString("hex") || "#2F6EEA"
          );
      }

      // Update borderColor if it exists
      if (newDataset.borderColor) {
        if (Array.isArray(newDataset.borderColor)) {
          const newBorderColors = [...newDataset.borderColor];
          newBorderColors[index] = color.toString("hex");
          newDataset.borderColor = newBorderColors;
        } else {
          newDataset.borderColor = Array(chartData.labels?.length || 0)
            .fill(0)
            .map((_, i) =>
              i === index
                ? color.toString("hex")
                : selectedColors[i]?.toString("hex") || "#2F6EEA"
            );
        }
      }

      // Update the dataset in the chartData
      newChartData.datasets[0] = newDataset;

      // Set the updated chart data
      setChartData(newChartData);
    }
  };

  const handleCutoutChange = (value: number) => {
    setCutout(value);
    const newOptions = { ...options };
    newOptions.cutout = `${value}%`;
    setOptions(newOptions);
  };

  // Update radius slider to directly modify chart options
  const handleRadiusChange = (value: number) => {
    setRadius(value);
    const newOptions = { ...options };
    newOptions.radius = value;
    setOptions(newOptions);
  };

  // Update rotation slider to directly modify chart options
  const handleRotateChange = (value: number) => {
    setRotation(value);
    const newOptions = { ...options };
    newOptions.rotation = value;
    setOptions(newOptions);
  };

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
        <Accordion.ItemContent marginBottom="2">
          <VStack gap={2} align="stretch">
            {chartData.labels?.map((label, index) => (
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
                      <ColorPicker.ValueSwatch rounded="inherit" padding={2} />
                    </ColorPicker.Trigger>
                  </ColorPicker.Control>
                  <ColorPicker.Positioner>
                    <ColorPicker.Content>
                      <ColorPicker.Area />
                      <HStack>
                        <ColorPicker.EyeDropper size="2xs" variant="outline" />
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
      <Accordion.Item value="cutout">
        <Accordion.ItemTrigger>
          <Span flex="1" fontWeight="medium" mb="1">
            내부 반경
          </Span>

          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent marginBottom="2">
          <CutoutSlider cutout={cutout} setCutout={handleCutoutChange} />
        </Accordion.ItemContent>
      </Accordion.Item>
      <Accordion.Item value="radius">
        <Accordion.ItemTrigger>
          <Span flex="1" fontWeight="medium" mb="1">
            반경
          </Span>

          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent marginBottom="2">
          <RadiusSlider radius={radius} setRadius={handleRadiusChange} />
        </Accordion.ItemContent>
      </Accordion.Item>
      <Accordion.Item value="rotate">
        <Accordion.ItemTrigger>
          <Span flex="1" fontWeight="medium" mb="1">
            회전
          </Span>

          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent marginBottom="2">
          <RotateSlider rotation={rotation} setRotation={handleRotateChange} />
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default PieChartColor;
