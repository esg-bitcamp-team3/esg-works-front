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
import { on } from "events";
import { set } from "lodash";

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
        value={rotation.toString()}
        onChange={(e) => setRotation(Number(e.target.value))}
        min={0}
        max={360}
        size={"sm"}
      />
    </InputGroup>
  </HStack>
);

type AlignType =
  | "start"
  | "center"
  | "end"
  | "right"
  | "left"
  | "bottom"
  | "top";
type AnchorType = "start" | "center" | "end";
type FormatType = "number" | "percent" | "currency";

type FormatConfig = {
  type: FormatType;
  prefix: string;
  postfix: string;
  decimals: number;
  digits: number;
};

// Add FormatSelector component
const FormatSelector = ({
  format,
  setFormat,
  disabled = false,
  prefix,
  setPrefix,
  postfix,
  setPostfix,
  decimals,
  setDecimals,
  digits,
  setDigits,
}: {
  format: FormatType;
  setFormat: (format: FormatType) => void;
  disabled?: boolean;
  decimals: number;
  setDecimals: (decimals: number) => void;
  digits: number;
  setDigits: (digits: number) => void;
  prefix: string;
  setPrefix: (prefix: string) => void;
  postfix: string;
  setPostfix: (postfix: string) => void;
}) => {
  const formatOptions: Array<{ label: string; value: FormatType }> = [
    { label: "숫자", value: "number" },
    { label: "퍼센트", value: "percent" },
    { label: "통화", value: "currency" },
  ];

  const formats = createListCollection({
    items: formatOptions,
  });

  const digitsOptions = createListCollection({
    items: [
      { label: "기본", value: "0" },
      { label: "천 (K)", value: "1" },
      { label: "백만 (M)", value: "2" },
      { label: "십억 (B)", value: "3" },
    ],
  });

  return (
    <VStack width="100%" align="stretch">
      <HStack justify="space-between" width="100%">
        <Text fontSize="xs">포맷</Text>
        <Select.Root
          defaultValue={[formatOptions[0].value]}
          collection={formats}
          size="xs"
          width="100px"
          value={[format]}
          onValueChange={(e) => setFormat(e.value[0] as FormatType)}
          disabled={disabled}
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
              {formats.items.map((item) => (
                <Select.Item item={item} key={item.value}>
                  {item.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
      </HStack>
      <HStack width={"100%"} justify="space-between">
        <VStack width={"100%"} justify="space-between">
          <Text fontSize="xs" textAlign="left" w={"100%"}>
            앞 문자
          </Text>
          <Input
            size="xs"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            disabled={disabled}
          />
        </VStack>
        <VStack width={"100%"} justify="space-between">
          <Text fontSize="xs" textAlign="left" w={"100%"}>
            뒷 문자
          </Text>
          <Input
            size="xs"
            value={postfix}
            onChange={(e) => setPostfix(e.target.value)}
            disabled={disabled}
          />
        </VStack>
      </HStack>
      <HStack justify="space-between" w="100%">
        <Text fontSize="xs">자릿수</Text>
        <NumberInput.Root
          value={decimals.toString()}
          onValueChange={(e) => setDecimals(Number(e.value))}
          min={0}
          max={10}
          size="xs"
          width="100px"
          disabled={disabled}
        >
          <NumberInput.Control />
          <NumberInput.Input />
        </NumberInput.Root>
      </HStack>
      <HStack justify="space-between" w="100%">
        <Text fontSize="xs">단위 표시</Text>
        <Select.Root
          defaultValue={["0"]}
          collection={digitsOptions}
          size="xs"
          width="100px"
          value={[digits.toString()]}
          onValueChange={(e) => setDigits(Number(e.value[0]))}
          disabled={disabled}
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
              {digitsOptions.items.map((item) => (
                <Select.Item item={item} key={item.value}>
                  {item.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
      </HStack>
    </VStack>
  );
};

const DataLabelPlugin = ({
  dataLabelDisplay,
  setDataLabelDisplay,
  dataLabelAlign,
  setDataLabelAlign,
  dataLabelAnchor,
  setDataLabelAnchor,
  dataLabelOffset,
  setDataLabelOffset,
  dataLabelColor,
  setDataLabelColor,
  dataLabelFormat,
  setDataLabelFormat,
  dataLabelPrefix,
  setDataLabelPrefix,
  dataLabelPostfix,
  setDataLabelPostfix,
  dataLabelDecimals,
  setDataLabelDecimals,
  dataLabelDigits,
  setDataLabelDigits,
  onOptionsChange,
}: {
  dataLabelDisplay: boolean;
  setDataLabelDisplay: (display: boolean) => void;
  dataLabelAlign: AlignType;
  setDataLabelAlign: (align: AlignType) => void;
  dataLabelAnchor: AnchorType;
  setDataLabelAnchor: (anchor: AnchorType) => void;
  dataLabelOffset: number;
  setDataLabelOffset: (offset: number) => void;
  dataLabelColor: string;
  setDataLabelColor: (color: string) => void;
  dataLabelFormat: FormatType;
  setDataLabelFormat: (format: FormatType) => void;
  dataLabelPrefix: string;
  setDataLabelPrefix: (prefix: string) => void;
  dataLabelPostfix: string;
  setDataLabelPostfix: (postfix: string) => void;
  dataLabelDecimals: number;
  setDataLabelDecimals: (decimals: number) => void;
  dataLabelDigits: number;
  setDataLabelDigits: (digits: number) => void;
  onOptionsChange: (
    updates: Partial<{
      display: boolean;
      align: AlignType;
      anchor: AnchorType;
      offset: number;
      color: string;
      format: FormatType;
      prefix: string;
      postfix: string;
      decimals: number;
      digits: number;
    }>
  ) => void;
}) => {
  const alignOptions: Array<{ label: string; value: AlignType }> = [
    { label: "시작", value: "start" },
    { label: "중앙", value: "center" },
    { label: "끝", value: "end" },
    { label: "왼쪽", value: "left" },
    { label: "오른쪽", value: "right" },
    { label: "상단", value: "top" },
    { label: "하단", value: "bottom" },
  ];
  const anchorOptions: Array<{ label: string; value: AnchorType }> = [
    { label: "시작", value: "start" },
    { label: "중앙", value: "center" },
    { label: "끝", value: "end" },
  ];

  const handleDisplayChange = (value: boolean) => {
    setDataLabelDisplay(value);
    onOptionsChange({
      display: value,
    });
  };

  const handleAlignChange = (value: AlignType) => {
    setDataLabelAlign(value);
    onOptionsChange({
      align: value,
    });
  };

  const handleAnchorChange = (value: AnchorType) => {
    setDataLabelAnchor(value);
    onOptionsChange({
      anchor: value,
    });
  };

  const handleOffsetChange = (value: number) => {
    setDataLabelOffset(value);
    onOptionsChange({
      offset: value,
    });
  };

  const handleColorChange = (value: string) => {
    setDataLabelColor(value);
    onOptionsChange({
      color: value,
    });
  };

  const handleDecimalsChange = (value: number) => {
    setDataLabelDecimals(value);
    onOptionsChange({
      decimals: value,
    });
  };

  const handleDigitsChange = (value: number) => {
    setDataLabelDigits(value);
    onOptionsChange({
      digits: value,
    });
  };

  const handleFormatChange = (value: FormatType) => {
    setDataLabelFormat(value);
    onOptionsChange({
      format: value,
    });
  };

  const handlePrefixChange = (value: string) => {
    setDataLabelPrefix(value);
    onOptionsChange({
      prefix: value,
    });
  };

  const handlePostfixChange = (value: string) => {
    setDataLabelPostfix(value);
    onOptionsChange({
      postfix: value,
    });
  };

  return (
    <VStack width={"100%"} align="stretch">
      <Checkbox.Root
        size="xs"
        checked={dataLabelDisplay}
        onCheckedChange={(e) => handleDisplayChange(!!e.checked)}
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control />
        <Checkbox.Label fontSize="xs">데이터 레이블</Checkbox.Label>
      </Checkbox.Root>
      <HStack justify="space-between" w="100%">
        <Text fontSize="xs">위치</Text>
        <PositionSelector
          position={dataLabelAnchor || "top"}
          setPosition={handleAnchorChange}
          options={anchorOptions}
          disabled={!dataLabelDisplay}
        />
      </HStack>

      <HStack justify="space-between" w="100%">
        <Text fontSize="xs">정렬</Text>
        <PositionSelector
          position={dataLabelAlign || "top"}
          setPosition={handleAlignChange}
          options={alignOptions}
          disabled={!dataLabelDisplay}
        />
      </HStack>
      <HStack justify="space-between" w="100%">
        <Text fontSize="xs">오프셋</Text>

        <Slider.Root
          value={[dataLabelOffset]}
          onValueChange={(e) => {
            handleOffsetChange(e.value[0]);
          }}
          width={"40%"}
          size={"sm"}
          max={50}
          disabled={!dataLabelDisplay}
        >
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumbs />
          </Slider.Control>
        </Slider.Root>
        <Text fontSize="sm" color="gray.600" width={"15%"}>
          {dataLabelOffset}
        </Text>
      </HStack>
      <HStack justify="space-between" w="100%">
        <Text fontSize="xs">색상</Text>
        <ColorPicker.Root
          size="xs"
          maxW="200px"
          value={parseColor(dataLabelColor || "#000000")}
          onValueChange={(e) => handleColorChange(e.value.toString("hex"))}
          disabled={!dataLabelDisplay}
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
      </HStack>
      <FormatSelector
        format={dataLabelFormat}
        setFormat={handleFormatChange}
        disabled={!dataLabelDisplay}
        prefix={dataLabelPrefix}
        setPrefix={handlePrefixChange}
        postfix={dataLabelPostfix}
        setPostfix={handlePostfixChange}
        decimals={dataLabelDecimals}
        setDecimals={handleDecimalsChange}
        digits={dataLabelDigits}
        setDigits={handleDigitsChange}
      />
    </VStack>
  );
};

type Position = "top" | "bottom" | "left" | "right";
type LegendPosition = "top" | "bottom" | "left" | "right" | "chartArea";

const PositionSelector = <T extends string>({
  position,
  setPosition,
  options,
  disabled = false,
}: {
  position: T;
  setPosition: (position: T) => void;
  options: Array<{ label: string; value: T }>;
  disabled?: boolean;
}) => {
  const positions = createListCollection({
    items: options,
  });

  return (
    <Select.Root
      defaultValue={[options[0].value]}
      collection={positions}
      size="xs"
      width="100px"
      value={[position]}
      onValueChange={(e) => setPosition(e.value[0] as T)}
      disabled={disabled}
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
          {positions.items.map((item) => (
            <Select.Item item={item} key={item.value}>
              {item.label}
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
  onOptionsChange,
}: {
  titleText: string;
  titleDisplay?: boolean;
  titlePosition?: Position;
  setTitleText: (text: string) => void;
  setTitleDisplay: (display: boolean) => void;
  setTitlePosition: (position: Position) => void;
  legendDisplay?: boolean;
  legendPosition?: LegendPosition;
  setLegendDisplay: (display: boolean) => void;
  setLegendPosition: (position: LegendPosition) => void;
  onOptionsChange: (
    updates: Partial<{
      titleText: string;
      titleDisplay: boolean;
      titlePosition: Position;
      legendDisplay: boolean;
      legendPosition: LegendPosition;
    }>
  ) => void;
}) => {
  const titleOptions: Array<{ label: string; value: Position }> = [
    { label: "상단", value: "top" },
    { label: "하단", value: "bottom" },
    { label: "왼쪽", value: "left" },
    { label: "오른쪽", value: "right" },
  ];
  const legendOptions: Array<{ label: string; value: LegendPosition }> = [
    { label: "상단", value: "top" },
    { label: "하단", value: "bottom" },
    { label: "왼쪽", value: "left" },
    { label: "오른쪽", value: "right" },
    { label: "차트 내부", value: "chartArea" },
  ];

  const handleTitleDisplayChange = (value: boolean) => {
    setTitleDisplay(value);
    onOptionsChange({
      titleDisplay: value,
    });
  };

  const handleTitlePositionChange = (value: Position) => {
    setTitlePosition(value);
    onOptionsChange({
      titlePosition: value,
    });
  };

  const handleTitleTextChange = (value: string) => {
    setTitleText(value);
    onOptionsChange({
      titleText: value,
    });
  };

  const handleLegendDisplayChange = (value: boolean) => {
    setLegendDisplay(value);
    onOptionsChange({
      legendDisplay: value,
    });
  };
  const handleLegendPositionChange = (value: LegendPosition) => {
    setLegendPosition(value);
    onOptionsChange({
      legendPosition: value,
    });
  };

  return (
    <VStack width={"100%"} align="stretch">
      <VStack width="100%">
        <HStack justify="space-between" w="100%">
          <Checkbox.Root
            size="xs"
            checked={titleDisplay}
            onCheckedChange={(e) => handleTitleDisplayChange(!!e.checked)}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label fontSize="xs">제목</Checkbox.Label>
          </Checkbox.Root>
          <PositionSelector
            position={titlePosition || "top"}
            setPosition={handleTitlePositionChange}
            options={titleOptions}
            disabled={!titleDisplay}
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
            onChange={(e) => handleTitleTextChange(e.target.value)}
          />
        </Box>
      </VStack>
      <Separator />

      <HStack justify="space-between" w="100%">
        <Checkbox.Root
          size="xs"
          checked={legendDisplay}
          onCheckedChange={(e) => handleLegendDisplayChange(!!e.checked)}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label fontSize="xs">레이블</Checkbox.Label>
        </Checkbox.Root>
        <PositionSelector
          position={legendPosition || "top"}
          setPosition={handleLegendPositionChange}
          options={legendOptions}
          disabled={!legendDisplay}
        />
      </HStack>
    </VStack>
  );
};

const OffsetSlider = ({
  chartData,
  offset,
  onOffsetChange,
}: {
  chartData: ChartData<"pie" | "doughnut">;
  offset: number[];
  onOffsetChange: (index: number, value: number) => void;
}) => (
  <VStack gap={2} align="stretch" w={"100%"}>
    {chartData.labels?.map((label, index) => (
      <HStack key={`offset-${index}`} justify="space-between" w="100%">
        <Text w="20%">{label as string}</Text>
        <Slider.Root
          value={[offset[index]]}
          onValueChange={(e) => {
            onOffsetChange(index, e.value[0]);
          }}
          width={"40%"}
          size={"sm"}
          max={50}
        >
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumbs />
          </Slider.Control>
        </Slider.Root>
        <Text fontSize="sm" color="gray.600" width={"15%"}>
          {offset[index]}
        </Text>
      </HStack>
    ))}
  </VStack>
);

interface ChartSettingsDrawerProps {
  chartData: ChartData<"pie" | "doughnut">;
  setChartData: (data: ChartData<"pie" | "doughnut">) => void;
  options: ChartOptions<"pie" | "doughnut">;
  setOptions: (chartOptions: ChartOptions<"pie" | "doughnut">) => void;
}

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
  const [legendPosition, setLegendPosition] = useState<LegendPosition>("right");
  const [offset, setOffset] = useState<number[]>([]);
  const [dataLabelDisplay, setDataLabelDisplay] = useState<boolean>(false);
  const [dataLabelAlign, setDataLabelAlign] = useState<AlignType>("center");
  const [dataLabelAnchor, setDataLabelAnchor] = useState<AnchorType>("center");
  const [dataLabelOffset, setDataLabelOffset] = useState<number>(0);
  const [dataLabelColor, setDataLabelColor] = useState<string>("#000000");
  const [dataLabelFormat, setDataLabelFormat] = useState<FormatType>("number");
  const [dataLabelPrefix, setDataLabelPrefix] = useState<string>("");
  const [dataLabelPostfix, setDataLabelPostfix] = useState<string>("");
  const [dataLabelDecimals, setDataLabelDecimals] = useState<number>(2);
  const [dataLabelDigits, setDataLabelDigits] = useState<number>(0);

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

    if (
      chartData?.labels?.length &&
      (!offset.length || offset.length !== chartData.labels.length)
    ) {
      // Create an array with zeros for each label
      const initialOffsets = Array(chartData.labels.length).fill(0);
      setOffset(initialOffsets);
    }

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

      if (!newOptions.plugins.datalabels) {
        newOptions.plugins.datalabels = {};
      }

      newOptions.plugins.datalabels = {
        ...newOptions.plugins.datalabels,
        display: dataLabelDisplay,
        align: dataLabelAlign,
        anchor: dataLabelAnchor,
        offset: dataLabelOffset,
        color: dataLabelColor,
        font: {
          weight: "bold",
          size: 12,
        },
        formatter: (value: number, context: any) => {
          let formattedValue: string | number = value;

          // 숫자 단위 적용
          let divider = 1;
          let unitSuffix = "";

          switch (dataLabelDigits) {
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
          switch (dataLabelFormat) {
            case "percent":
              const total = context.dataset.data.reduce(
                (sum: number, val: number) => sum + val,
                0
              );
              formattedValue = ((value / total) * 100).toFixed(
                dataLabelDecimals
              );
              if (!dataLabelPostfix && unitSuffix === "") {
                unitSuffix = "%";
              }
              break;
            case "currency":
              formattedValue = new Intl.NumberFormat("ko-KR", {
                style: "currency",
                currency: "KRW",
                minimumFractionDigits: dataLabelDecimals,
                maximumFractionDigits: dataLabelDecimals,
              }).format(formattedValue as number);
              // 이미 통화 형식에 포함된 경우 단위 접미사는 추가하지 않음
              unitSuffix = "";
              break;
            case "number":
              formattedValue = new Intl.NumberFormat("ko-KR", {
                minimumFractionDigits: dataLabelDecimals,
                maximumFractionDigits: dataLabelDecimals,
              }).format(formattedValue as number);
              break;
            default:
              formattedValue = (formattedValue as number).toFixed(
                dataLabelDecimals
              );
          }

          return `${dataLabelPrefix}${formattedValue}${unitSuffix}${dataLabelPostfix}`;
        },
      };

      // Update the chart options
      setOptions(newOptions);
    }

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
      const rotationDegrees = options.rotation;
      setRotation(rotationDegrees || 0);
    }

    // Initialize radius from options
    if (options?.radius !== undefined) {
      setRadius((options.radius as number) || 100);
    }
  }, []);

  const handleOffsetChange = (index: number, value: number) => {
    const newOffset = [...offset];
    newOffset[index] = value;
    setOffset(newOffset);

    // Update the chart data to apply offsets
    if (chartData && chartData.datasets && chartData.datasets.length > 0) {
      // Create a deep copy of the chart data
      const newChartData = { ...chartData };
      newChartData.datasets = [...chartData.datasets];

      // Clone the dataset we want to modify
      const newDataset = { ...newChartData.datasets[0] };

      // Create or update the offset property
      if (!newDataset.offset) {
        newDataset.offset = newOffset;
      } else {
        // If offset already exists, update it
        const currentOffset = Array.isArray(newDataset.offset)
          ? [...newDataset.offset]
          : Array(chartData.labels?.length || 0).fill(0);

        currentOffset[index] = value;
        newDataset.offset = currentOffset;
      }

      // Update the dataset in the chartData
      newChartData.datasets[0] = newDataset;

      // Set the updated chart data
      setChartData(newChartData);
    }
  };

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

  const handleChartOptionsChange = (
    updates: Partial<{
      titleText: string;
      titleDisplay: boolean;
      titlePosition: Position;
      legendDisplay: boolean;
      legendPosition: LegendPosition;
    }>
  ) => {
    // Create a new options object to avoid reference issues
    const newOptions = { ...options };

    // Ensure plugins object exists
    if (!newOptions.plugins) newOptions.plugins = {};

    // Update title options if those properties are in the updates
    if (
      updates.titleText !== undefined ||
      updates.titleDisplay !== undefined ||
      updates.titlePosition !== undefined
    ) {
      if (!newOptions.plugins.title) newOptions.plugins.title = {};

      if (updates.titleText !== undefined) {
        newOptions.plugins.title.text = updates.titleText;
      }

      if (updates.titleDisplay !== undefined) {
        newOptions.plugins.title.display = updates.titleDisplay;
      }

      if (updates.titlePosition !== undefined) {
        newOptions.plugins.title.position = updates.titlePosition;
      }
    }

    // Update legend options if those properties are in the updates
    if (
      updates.legendDisplay !== undefined ||
      updates.legendPosition !== undefined
    ) {
      if (!newOptions.plugins.legend) newOptions.plugins.legend = {};

      if (updates.legendDisplay !== undefined) {
        newOptions.plugins.legend.display = updates.legendDisplay;
      }

      if (updates.legendPosition !== undefined) {
        newOptions.plugins.legend.position = updates.legendPosition;
      }
    }

    // Apply the updated options
    setOptions(newOptions);
  };

  const handleDataLabelOptionsChange = (
    updates: Partial<{
      display: boolean;
      align: AlignType;
      anchor: AnchorType;
      offset: number;
      color: string;
      format: FormatType;
      prefix: string;
      postfix: string;
      decimals: number;
      digits: number;
    }>
  ) => {
    // Create a new options object to avoid reference issues
    const newOptions = { ...options };

    // Ensure plugins and datalabels objects exist
    if (!newOptions.plugins) newOptions.plugins = {};
    if (!newOptions.plugins.datalabels) newOptions.plugins.datalabels = {};

    // Update with new values
    newOptions.plugins.datalabels = {
      ...newOptions.plugins.datalabels,
      ...updates,
    };

    newOptions.plugins.datalabels.formatter = (value: number, context: any) => {
      let formattedValue: string | number = value;

      // 현재 상태와 업데이트를 합쳐서 사용
      const format =
        updates.format !== undefined ? updates.format : dataLabelFormat;
      const prefix =
        updates.prefix !== undefined ? updates.prefix : dataLabelPrefix;
      const postfix =
        updates.postfix !== undefined ? updates.postfix : dataLabelPostfix;
      const decimals =
        updates.decimals !== undefined ? updates.decimals : dataLabelDecimals;
      const digits =
        updates.digits !== undefined ? updates.digits : dataLabelDigits;

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
    };

    // Apply the updated options
    setOptions(newOptions);
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
            onOptionsChange={handleChartOptionsChange}
          />
        </Accordion.ItemContent>
      </Accordion.Item>
      <Accordion.Item value="data-label">
        <Accordion.ItemTrigger>
          <Span flex="1" fontWeight="medium" mb="1">
            데이터 레이블 옵션
          </Span>

          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent marginBottom="2">
          <DataLabelPlugin
            dataLabelDisplay={dataLabelDisplay}
            setDataLabelDisplay={setDataLabelDisplay}
            dataLabelAlign={dataLabelAlign}
            setDataLabelAlign={setDataLabelAlign}
            dataLabelAnchor={dataLabelAnchor}
            setDataLabelAnchor={setDataLabelAnchor}
            dataLabelOffset={dataLabelOffset}
            setDataLabelOffset={setDataLabelOffset}
            dataLabelColor={dataLabelColor}
            setDataLabelColor={setDataLabelColor}
            dataLabelFormat={dataLabelFormat}
            setDataLabelFormat={setDataLabelFormat}
            dataLabelPrefix={dataLabelPrefix}
            setDataLabelPrefix={setDataLabelPrefix}
            dataLabelPostfix={dataLabelPostfix}
            setDataLabelPostfix={setDataLabelPostfix}
            dataLabelDecimals={dataLabelDecimals}
            setDataLabelDecimals={setDataLabelDecimals}
            dataLabelDigits={dataLabelDigits}
            setDataLabelDigits={setDataLabelDigits}
            onOptionsChange={handleDataLabelOptionsChange}
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
      <Accordion.Item value="offset">
        <Accordion.ItemTrigger>
          <Span flex="1" fontWeight="medium" mb="1">
            오프셋
          </Span>

          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent marginBottom="2">
          <OffsetSlider
            chartData={chartData}
            offset={offset}
            onOffsetChange={handleOffsetChange}
          />
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default PieChartColor;
