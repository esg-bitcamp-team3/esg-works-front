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
import { types } from "util";
import { Point, setPoint } from "slate";

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

const BorderStyleOptions = ({
  chartData,
  borderColors,
  setBorderColors,
  borderWidth,
  setBorderWidth,
  borderDash,
  setBorderDash,
  tension,
  setTension,
  onOptionsChange,
}: {
  chartData: ChartData<"line" | "bar">;
  borderColors: Color[];
  setBorderColors: (color: Color[]) => void;
  borderWidth: number;
  setBorderWidth: (width: number) => void;
  borderDash: number[];
  setBorderDash: (dash: number[]) => void;
  tension: number;
  setTension: (tension: number) => void;
  onOptionsChange: (
    updates: Partial<{
      borderColors: Color[];
      borderWidth: number;
      borderDash: number[];
      tension: number;
    }>
  ) => void;
}) => {
  const dashOptions = [
    { label: "실선", value: "solid", dash: [] },
    { label: "점선", value: "dotted", dash: [2, 2] },
    { label: "긴 점선", value: "dashed", dash: [6, 6] },
    { label: "대시 점선", value: "dashdot", dash: [6, 3, 2, 3] },
  ];

  const dashCollection = createListCollection({
    items: dashOptions,
  });

  const currentDashValue =
    dashOptions.find(
      (option) => JSON.stringify(option.dash) === JSON.stringify(borderDash)
    )?.value || "solid";

  const handleBorderColorChange = (index: number, color: Color) => {
    let newColors: Color[] = [...borderColors];
    newColors[index] = color;
    setBorderColors(newColors);
    onOptionsChange({
      borderColors: newColors,
    });
  };

  const handleBorderWidthChange = (width: number) => {
    setBorderWidth(width);
    onOptionsChange({
      borderWidth: width,
    });
  };

  const handleBorderDashChange = (dash: number[]) => {
    setBorderDash(dash);
    onOptionsChange({
      borderDash: dash,
    });
  };

  const handleTensionChange = (tension: number) => {
    setTension(tension);
    onOptionsChange({
      tension: tension,
    });
  };

  return (
    <VStack width="100%" align="stretch">
      <VStack gap={2} align="stretch">
        {chartData.datasets?.map((dataset, index) => (
          <HStack key={`chart-color-${index}`}>
            <ColorPicker.Root
              size="xs"
              maxW="200px"
              value={borderColors[index] || parseColor("#2F6EEA")}
              onValueChange={(e) => handleBorderColorChange(index, e.value)}
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
            <Text w="100%">{dataset.label as string}</Text>
          </HStack>
        ))}
      </VStack>
      <HStack justify="space-between" width="100%">
        <Text fontSize="xs">두께</Text>
        <HStack width="130px">
          <Slider.Root
            value={[borderWidth]}
            onValueChange={(e) => handleBorderWidthChange(e.value[0])}
            min={0}
            max={10}
            step={1}
            width="80px"
          >
            <Slider.Control>
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumbs />
            </Slider.Control>
          </Slider.Root>
          <Text fontSize="xs" width="30px" textAlign="right">
            {borderWidth}px
          </Text>
        </HStack>
      </HStack>
      <HStack justify="space-between" width="100%">
        <Text fontSize="xs">스타일</Text>
        <Select.Root
          collection={dashCollection}
          size="xs"
          width="100px"
          value={[currentDashValue]}
          onValueChange={(e) => {
            const selectedOption = dashOptions.find(
              (option) => option.value === e.value[0]
            );
            handleBorderDashChange(selectedOption?.dash || []);
          }}
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
              {dashCollection.items.map((item) => (
                <Select.Item item={item} key={item.value}>
                  {item.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
      </HStack>
      <HStack justify="space-between" width="100%">
        <Text fontSize="xs">곡선 부드러움</Text>
        <HStack width="130px">
          <Slider.Root
            value={[tension]}
            onValueChange={(e) => handleTensionChange(e.value[0])}
            min={0}
            max={1}
            step={0.1}
            width="80px"
          >
            <Slider.Control>
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumbs />
            </Slider.Control>
          </Slider.Root>
          <Text fontSize="xs" width="30px" textAlign="right">
            {tension.toFixed(1)}
          </Text>
        </HStack>
      </HStack>
    </VStack>
  );
};

type PointStyleType =
  | "circle"
  | "cross"
  | "crossRot"
  | "dash"
  | "line"
  | "rect"
  | "rectRounded"
  | "rectRot"
  | "star"
  | "triangle"
  | "false";

const PointStyleOptions = ({
  chartData,
  pointBackgroundColor,
  setPointBackgroundColor,
  pointBorderColor,
  setPointBorderColor,
  pointRadius,
  setPointRadius,
  pointStyle,
  setPointStyle,
  onPointOptionsChange,
}: {
  chartData: ChartData<"line" | "bar">;
  pointBackgroundColor: Color;
  setPointBackgroundColor: (color: Color) => void;
  pointBorderColor: Color;
  setPointBorderColor: (color: Color) => void;
  pointRadius: number;
  setPointRadius: (radius: number) => void;
  pointStyle: PointStyleType;
  setPointStyle: (style: PointStyleType) => void;
  onPointOptionsChange: (
    updates: Partial<{
      pointBackgroundColor: Color;
      pointBorderColor: Color;
      pointRadius: number;
      pointStyle: PointStyleType;
    }>
  ) => void;
}) => {
  const pointStyleOptions: Array<{ label: string; value: PointStyleType }> = [
    { label: "원", value: "circle" },
    { label: "십자", value: "cross" },
    { label: "십자 회전", value: "crossRot" },
    { label: "대시", value: "dash" },
    { label: "선", value: "line" },
    { label: "사각형", value: "rect" },
    { label: "둥근 사각형", value: "rectRounded" },
    { label: "회전된 사각형", value: "rectRot" },
    { label: "별", value: "star" },
    { label: "삼각형", value: "triangle" },
    { label: "표시 안함", value: "false" },
  ];
  const pointStyleCollection = createListCollection({
    items: pointStyleOptions,
  });

  const handlePointBackgroundColorChange = (color: Color) => {
    setPointBackgroundColor(color);
    onPointOptionsChange({
      pointBackgroundColor: color,
    });
  };

  const handlePointBorderColorChange = (color: Color) => {
    setPointBorderColor(color);
    onPointOptionsChange({
      pointBorderColor: color,
    });
  };

  const handlePointRadiusChange = (radius: number) => {
    setPointRadius(radius);
    onPointOptionsChange({
      pointRadius: radius,
    });
  };

  const handlePointStyleChange = (style: PointStyleType) => {
    setPointStyle(style);
    onPointOptionsChange({
      pointStyle: style,
    });
  };

  return (
    <VStack width="100%" align="stretch">
      <VStack gap={2} align="stretch">
        <HStack justify="space-between" width={"100%"} gap={10}>
          <HStack width="50%" justify={"start"}>
            <Text w="100%">배경색</Text>
            <ColorPicker.Root
              size="xs"
              maxW="200px"
              value={pointBackgroundColor || parseColor("#2F6EEA")}
              onValueChange={(e) => handlePointBackgroundColorChange(e.value)}
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
          <HStack justify="start" width="50%">
            <Text w="100%">테두리색</Text>
            <ColorPicker.Root
              size="xs"
              maxW="200px"
              value={pointBorderColor || parseColor("#000000")}
              onValueChange={(e) => handlePointBorderColorChange(e.value)}
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
        </HStack>
      </VStack>
      <HStack justify="space-between" width="100%">
        <Text fontSize="xs">크기</Text>
        <HStack width="130px">
          <Slider.Root
            value={[pointRadius]}
            onValueChange={(e) => handlePointRadiusChange(e.value[0])}
            min={0}
            max={10}
            step={1}
            width="80px"
          >
            <Slider.Control>
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumbs />
            </Slider.Control>
          </Slider.Root>
          <Text fontSize="xs" width="30px" textAlign="right">
            {pointRadius}px
          </Text>
        </HStack>
      </HStack>
      <HStack justify="space-between" width="100%">
        <Text fontSize="xs">스타일</Text>
        <Select.Root
          collection={pointStyleCollection}
          size="xs"
          width="100px"
          value={[pointStyle]}
          onValueChange={(e) => {
            const selectedOption = pointStyleCollection.items.find(
              (option) => option.value === e.value[0]
            );
            handlePointStyleChange(selectedOption?.value || "circle");
          }}
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
              {pointStyleCollection.items.map((item) => (
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

const TypeSelector = ({
  type,
  setType,
}: {
  type: "bar" | "line";
  setType: (type: "bar" | "line") => void;
}) => {
  const typeOptions: Array<{ label: string; value: "bar" | "line" }> = [
    { label: "막대 차트", value: "bar" },
    { label: "선 차트", value: "line" },
  ];

  const typeCollection = createListCollection({
    items: typeOptions,
  });
  return (
    <Select.Root
      key={type}
      size="xs"
      collection={typeCollection}
      value={[type]}
      onValueChange={(e) => setType(e.value[0] as "bar" | "line")}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select chart type" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          {typeOptions.map((option) => (
            <Select.Item item={option} key={option.value}>
              {option.label}
              <Select.ItemIndicator />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
};

interface ChartSettingsDrawerProps {
  chartData: ChartData<"line" | "bar">;
  setChartData: (data: ChartData<"line" | "bar">) => void;
  options: ChartOptions<"line" | "bar">;
  setOptions: (chartOptions: ChartOptions<"line" | "bar">) => void;
  onChartTypeChange?: () => void;
}

const MixedChartColor = ({
  chartData,
  setChartData,
  options,
  setOptions,
  onChartTypeChange,
}: ChartSettingsDrawerProps) => {
  const [selectedColors, setSelectedColors] = useState<Color[]>([]);
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
  const [types, setTypes] = useState<("bar" | "line")[]>([]);
  const [borderColors, setBorderColors] = useState<Color[]>([]);
  const [borderWidth, setBorderWidth] = useState<number>(1);
  const [borderDash, setBorderDash] = useState<number[]>([]);
  const [tension, setTension] = useState<number>(0.4);
  const [pointBackgroundColor, setPointBackgroundColor] = useState<Color>(
    parseColor("#2F6EEA")
  );
  const [pointBorderColor, setPointBorderColor] = useState<Color>(
    parseColor("#000000")
  );
  const [pointRadius, setPointRadius] = useState<number>(3);
  const [pointStyle, setPointStyle] = useState<PointStyleType>("circle");

  useEffect(() => {
    // Initialize selectedColors from all datasets
    if (chartData?.datasets?.length > 0) {
      const newSelectedColors: Color[] = [];

      chartData.datasets.forEach((dataset) => {
        let colorStr;

        // Extract color value from dataset
        if (dataset.backgroundColor) {
          if (typeof dataset.backgroundColor === "object") {
            colorStr =
              (dataset.backgroundColor as any)[0]?.toString() || "#000000";
          } else {
            colorStr = dataset.backgroundColor.toString();
          }
        } else {
          colorStr = `#${Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")}`;
        }

        // Validate and fix hex color format
        if (colorStr.startsWith("#")) {
          // Remove # for processing
          const hex = colorStr.substring(1);

          // Check if it's a valid 6-digit hex
          if (!/^[0-9A-F]{6}$/i.test(hex)) {
            // Fix invalid hex by padding or truncating
            const validHex = hex.padEnd(6, "0").substring(0, 6);
            colorStr = `#${validHex}`;
          }
        } else {
          // Not a hex color, use fallback
          colorStr = "#000000";
        }

        // Now parse the validated color
        const color = parseColor(colorStr);
        newSelectedColors.push(color);
      });

      setSelectedColors(newSelectedColors);

      setBorderColors(
        newSelectedColors.map((color) => parseColor(color.toString("hex")))
      );

      setPointBackgroundColor(newSelectedColors[0]);
      setPointBorderColor(newSelectedColors[0]);
      setPointStyle("circle");
    }

    // Initialize types array from datasets
    if (chartData?.datasets?.length > 0) {
      const newTypes = chartData.datasets.map(
        (dataset) => (dataset.type as "bar" | "line") || "bar"
      );
      setTypes(newTypes);
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
  }, []);

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
      const newDataset = { ...newChartData.datasets[index] };

      newDataset.backgroundColor = color.toString("hex");

      newChartData.datasets[index] = newDataset;

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

  const handleBorderOptionsChange = (
    updates: Partial<{
      borderColors: Color[];
      borderWidth: number;
      borderDash: number[];
      tension: number;
    }>
  ) => {
    if (chartData && chartData.datasets && chartData.datasets.length > 0) {
      // Create a deep copy of the chart data to avoid reference issues
      const newChartData = { ...chartData };
      newChartData.datasets = [...chartData.datasets].map((dataset, idx) => ({
        ...dataset,
      }));

      // Update all datasets with the border options
      newChartData.datasets.forEach((dataset, idx) => {
        // Update borderColors if provided
        if (dataset.type === "line") {
          if (updates.borderColors) {
            dataset.borderColor =
              updates.borderColors[idx]?.toString("hex") || dataset.borderColor;
          }

          // Update borderWidth if provided
          if (updates.borderWidth !== undefined) {
            dataset.borderWidth = updates.borderWidth;
          }

          // Update borderDash if provided
          if (updates.borderDash !== undefined) {
            dataset.borderDash = updates.borderDash;
          }

          // Update tension if provided (for line charts)
          if (updates.tension !== undefined && dataset.type === "line") {
            dataset.tension = updates.tension;
          }
        }
      });

      // Set the updated chart data
      setChartData(newChartData);
    }
  };

  const handlePointOptionsChange = (
    updates: Partial<{
      pointBackgroundColor: Color;
      pointBorderColor: Color;
      pointRadius: number;
      pointStyle: PointStyleType;
    }>
  ) => {
    if (chartData && chartData.datasets && chartData.datasets.length > 0) {
      // Create a deep copy of the chart data to avoid reference issues
      const newChartData = { ...chartData };
      newChartData.datasets = [...chartData.datasets].map((dataset, idx) => ({
        ...dataset,
      }));

      // Update all datasets with the point options
      newChartData.datasets.forEach((dataset, idx) => {
        // Update pointBackgroundColor if provided
        if (dataset.type === "line") {
          if (updates.pointBackgroundColor) {
            dataset.pointBackgroundColor =
              updates.pointBackgroundColor.toString("hex");
          }

          // Update pointBorderColor if provided
          if (updates.pointBorderColor) {
            dataset.pointBorderColor = updates.pointBorderColor.toString("hex");
          }

          // Update pointRadius if provided
          if (updates.pointRadius !== undefined) {
            dataset.pointRadius = updates.pointRadius;
          }

          // Update pointStyle if provided
          if (updates.pointStyle !== undefined) {
            dataset.pointStyle = updates.pointStyle;
          }
        }
      });

      // Set the updated chart data
      setChartData(newChartData);
    }
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

  const handleTypeChange = (index: number, type: "bar" | "line") => {
    const newChartData = { ...chartData };
    newChartData.datasets[index].type = type;
    setTypes((prevTypes) => {
      const newTypes = [...prevTypes];
      newTypes[index] = type;
      return newTypes;
    });
    setChartData(newChartData);
    onChartTypeChange?.();
  };

  return (
    <Accordion.Root
      collapsible
      multiple
      defaultValue={["a"]}
      variant="enclosed"
      size="sm"
      overflow={"auto"}
    >
      <Accordion.Item value="plugins">
        <Accordion.ItemTrigger>
          <Span flex="1" fontWeight="medium">
            차트 옵션
          </Span>

          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent pb={3}>
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
          <Span flex="1" fontWeight="medium">
            데이터 레이블 옵션
          </Span>

          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent pb={3}>
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
      <Accordion.Item value="chart-type">
        <Accordion.ItemTrigger>
          <Span flex="1" fontSize="sm" fontWeight="medium">
            차트 유형
          </Span>

          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent pb={3}>
          <VStack gap={2} align="stretch">
            {chartData.datasets?.map((dataset, index) => (
              <HStack key={`chart-type-${index}`}>
                <Text w="100%">{dataset.label as string}</Text>
                <TypeSelector
                  type={dataset.type || "bar"}
                  setType={(type) => {
                    handleTypeChange(index, type);
                  }}
                />
              </HStack>
            ))}
          </VStack>
        </Accordion.ItemContent>
      </Accordion.Item>
      <Accordion.Item value="chart">
        <Accordion.ItemTrigger>
          <Span flex="1" fontSize="sm" fontWeight="medium">
            차트 색상
          </Span>

          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent pb={3}>
          <VStack gap={2} align="stretch">
            {chartData.datasets?.map((dataset, index) => (
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
                <Text w="100%">{dataset.label as string}</Text>
              </HStack>
            ))}
          </VStack>
        </Accordion.ItemContent>
      </Accordion.Item>
      <Accordion.Item value="border-options">
        <Accordion.ItemTrigger>
          <Span flex="1" fontSize="sm" fontWeight="medium">
            테두리 옵션
          </Span>

          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent pb={3}>
          <BorderStyleOptions
            borderColors={borderColors}
            setBorderColors={setBorderColors}
            borderWidth={borderWidth}
            setBorderWidth={setBorderWidth}
            borderDash={borderDash}
            setBorderDash={setBorderDash}
            tension={tension}
            setTension={setTension}
            chartData={chartData}
            onOptionsChange={handleBorderOptionsChange}
          />
        </Accordion.ItemContent>
      </Accordion.Item>
      <Accordion.Item value="point-options">
        <Accordion.ItemTrigger>
          <Span flex="1" fontSize="sm" fontWeight="medium">
            포인트 옵션
          </Span>

          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent pb={3}>
          <PointStyleOptions
            pointBackgroundColor={pointBackgroundColor}
            setPointBackgroundColor={setPointBackgroundColor}
            pointBorderColor={pointBorderColor}
            setPointBorderColor={setPointBorderColor}
            pointRadius={pointRadius}
            setPointRadius={setPointRadius}
            pointStyle={pointStyle}
            setPointStyle={setPointStyle}
            chartData={chartData}
            onPointOptionsChange={handlePointOptionsChange}
          />
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default MixedChartColor;
