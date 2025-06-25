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
import {
  AlignType,
  AnchorType,
  ChartPlugins,
  CutoutSlider,
  DataLabelPlugin,
  FormatType,
  LegendPosition,
  OffsetSlider,
  Position,
  RadiusSlider,
  RotateSlider,
} from "./StyleOptionSelectors";

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
  formatOptions: Record<string, Object>;
  setFormatOptions: (options: Record<string, Object>) => void;
}

const PieChartColor = ({
  chartData,
  setChartData,
  options,
  setOptions,
  formatOptions,
  setFormatOptions,
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
        newBackgroundColors[index] = color.toString("rgba");
        newDataset.backgroundColor = newBackgroundColors;
      } else {
        // If backgroundColor is not an array, make it one
        newDataset.backgroundColor = Array(chartData.labels?.length || 0)
          .fill(0)
          .map((_, i) =>
            i === index
              ? color.toString("rgba")
              : selectedColors[i]?.toString("rgba") || "#2F6EEA"
          );
      }

      // Update borderColor if it exists
      if (newDataset.borderColor) {
        if (Array.isArray(newDataset.borderColor)) {
          const newBorderColors = [...newDataset.borderColor];
          newBorderColors[index] = color.toString("rgba");
          newDataset.borderColor = newBorderColors;
        } else {
          newDataset.borderColor = Array(chartData.labels?.length || 0)
            .fill(0)
            .map((_, i) =>
              i === index
                ? color.toString("rgba")
                : selectedColors[i]?.toString("rgba") || "#2F6EEA"
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
      const format = updates.format ?? dataLabelFormat;
      const prefix = updates.prefix ?? dataLabelPrefix;
      const postfix = updates.postfix ?? dataLabelPostfix;
      const decimals = updates.decimals ?? dataLabelDecimals;
      const digits = updates.digits ?? dataLabelDigits;

      const newFormatOptions: Record<string, string | number | FormatType> = {
        format,
        prefix,
        postfix,
        decimals,
        digits,
      };

      // Update the format options state
      setFormatOptions({ ...formatOptions, ...newFormatOptions });

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
      bg="white"
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
      <Accordion.Item value="chart">
        <Accordion.ItemTrigger>
          <Span flex="1" fontSize="sm" fontWeight="medium">
            차트 색상
          </Span>

          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent pb={3}>
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
          <Span flex="1" fontWeight="medium">
            내부 반경
          </Span>

          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent pb={3}>
          <CutoutSlider cutout={cutout} setCutout={handleCutoutChange} />
        </Accordion.ItemContent>
      </Accordion.Item>
      <Accordion.Item value="radius">
        <Accordion.ItemTrigger>
          <Span flex="1" fontWeight="medium">
            반경
          </Span>

          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent pb={3}>
          <RadiusSlider radius={radius} setRadius={handleRadiusChange} />
        </Accordion.ItemContent>
      </Accordion.Item>
      <Accordion.Item value="rotate">
        <Accordion.ItemTrigger>
          <Span flex="1" fontWeight="medium">
            회전
          </Span>

          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent pb={3}>
          <RotateSlider rotation={rotation} setRotation={handleRotateChange} />
        </Accordion.ItemContent>
      </Accordion.Item>
      <Accordion.Item value="offset">
        <Accordion.ItemTrigger>
          <Span flex="1" fontWeight="medium">
            오프셋
          </Span>

          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent pb={3}>
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
