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
import { ChartData } from "chart.js";

export const CutoutSlider = ({
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
export const RadiusSlider = ({
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

export const RotateSlider = ({
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

export type AlignType =
  | "start"
  | "center"
  | "end"
  | "right"
  | "left"
  | "bottom"
  | "top";
export type AnchorType = "start" | "center" | "end";
export type FormatType = "number" | "percent" | "currency";

export type FormatConfig = {
  type: FormatType;
  prefix: string;
  postfix: string;
  decimals: number;
  digits: number;
};

// Add FormatSelector component
export const FormatSelector = ({
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

export const BorderStyleOptions = ({
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

export const BarBorderStyleOptions = ({
  chartData,
  borderColors,
  setBorderColors,
  borderWidth,
  setBorderWidth,
  borderRadius,
  setBorderRadius,
  onOptionsChange,
}: {
  chartData: ChartData<"line" | "bar">;
  borderColors: Color[];
  setBorderColors: (color: Color[]) => void;
  borderWidth: number;
  setBorderWidth: (width: number) => void;
  borderRadius: number;
  setBorderRadius: (radius: number) => void;
  onOptionsChange: (
    updates: Partial<{
      borderColors: Color[];
      borderWidth: number;
      borderRadius: number;
    }>
  ) => void;
}) => {
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

  const handleBorderRadiusChange = (radius: number) => {
    setBorderRadius(radius);
    onOptionsChange({
      borderRadius: radius,
    });
  };

  return (
    <VStack width="100%" align="stretch" gap={2}>
      <VStack gap={2} align="stretch">
        {chartData.datasets?.map((dataset, index) => (
          <HStack key={`chart-color-${index}`}>
            <ColorPicker.Root
              size="2xs"
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
        <Text fontSize="xs">모서리 둥글기</Text>
        <HStack width="130px">
          <Slider.Root
            value={[borderRadius * 5]} // Scale to match the slider range
            onValueChange={(e) => handleBorderRadiusChange(e.value[0] / 5)}
            min={0}
            max={100}
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
            {borderRadius * 5}%
          </Text>
        </HStack>
      </HStack>
    </VStack>
  );
};

export type PointStyleType =
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

export const PointStyleOptions = ({
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

export const DataLabelPlugin = ({
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
        <Checkbox.Label fontSize="xs">값 표시</Checkbox.Label>
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
          onValueChange={(e) => handleColorChange(e.value.toString("rgba"))}
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

export type Position = "top" | "bottom" | "left" | "right";
export type LegendPosition = "top" | "bottom" | "left" | "right" | "chartArea";

export const PositionSelector = <T extends string>({
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

export const ChartPlugins = ({
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

export const TypeSelector = ({
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

export const BarStyleOptions = ({
  barThickness,
  setBarThickness,
  barPercentage,
  setBarPercentage,
  onOptionsChange,
}: {
  barThickness: number;
  setBarThickness: (thickness: number) => void;
  barPercentage: number;
  setBarPercentage: (percentage: number) => void;
  onOptionsChange: (
    updates: Partial<{
      barThickness: number;
      barPercentage: number;
    }>
  ) => void;
}) => {
  const handleBarThicknessChange = (thickness: number) => {
    setBarThickness(thickness);
    onOptionsChange({
      barThickness: thickness,
    });
  };
  const handleBarPercentageChange = (percentage: number) => {
    setBarPercentage(percentage);
    onOptionsChange({
      barPercentage: percentage,
    });
  };

  return (
    <VStack width="100%" align="stretch">
      <HStack justify="space-between" width="100%">
        <Text fontSize="xs">두께</Text>
        <HStack width="130px">
          <Slider.Root
            value={[barThickness]}
            onValueChange={(e) => handleBarThicknessChange(e.value[0])}
            min={0}
            max={100}
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
            {barThickness}px
          </Text>
        </HStack>
      </HStack>
      <HStack justify="space-between" width="100%">
        <Text fontSize="xs">퍼센트</Text>
        <HStack width="130px">
          <Slider.Root
            value={[barPercentage]}
            onValueChange={(e) => handleBarPercentageChange(e.value[0])}
            min={0}
            max={100}
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
            {barPercentage}%
          </Text>
        </HStack>
      </HStack>
    </VStack>
  );
};

export const FillToggle = ({
  fill,
  setFill,
  disabled = false,
}: {
  fill: boolean;
  setFill: (value: boolean) => void;
  disabled?: boolean;
}) => (
  <HStack align="center" justify="space-between" mt={2} mb={4} width="100%">
    <Checkbox.Root
      disabled={disabled}
      size="xs"
      checked={fill}
      onCheckedChange={(e) => setFill(!!e.checked)}
    >
      <Checkbox.HiddenInput />
      <Checkbox.Control />
      <Checkbox.Label fontSize="xs" color="gray.700">
        채우기
      </Checkbox.Label>
    </Checkbox.Root>
  </HStack>
);

export const OffsetSlider = ({
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
