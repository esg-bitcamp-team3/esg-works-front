import {
  Box,
  ColorPicker,
  HStack,
  parseColor,
  Text,
  VStack,
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
  ChartData,
  ChartOptions,
} from "chart.js";
import { Accordion, Span } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  AlignType,
  AnchorType,
  BarStyleOptions,
  BorderStyleOptions,
  ChartPlugins,
  DataLabelPlugin,
  FillToggle,
  FormatType,
  LegendPosition,
  PointStyleOptions,
  PointStyleType,
  Position,
  TypeSelector,
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
  chartData: ChartData<"line" | "bar">;
  setChartData: (data: ChartData<"line" | "bar">) => void;
  options: ChartOptions<"line" | "bar">;
  setOptions: (chartOptions: ChartOptions<"line" | "bar">) => void;
  onChartTypeChange?: () => void;
  formatOptions: Record<string, Object>;
  setFormatOptions: (options: Record<string, Object>) => void;
}

const MixedChartColor = ({
  chartData,
  setChartData,
  options,
  setOptions,
  onChartTypeChange,
  formatOptions,
  setFormatOptions,
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

  const [barThickness, setBarThickness] = useState<number>(50); // 기본 막대 두께
  const [barPercentage, setBarPercentage] = useState<number>(0.9);

  const [fill, setFill] = useState<boolean>(false);

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
        newSelectedColors.map((color) => parseColor(color.toString("rgba")))
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

      newDataset.backgroundColor = color.toString("rgba");

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
              updates.borderColors[idx]?.toString("rgba") ||
              dataset.borderColor;
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
              updates.pointBackgroundColor.toString("rgba");
          }

          // Update pointBorderColor if provided
          if (updates.pointBorderColor) {
            dataset.pointBorderColor =
              updates.pointBorderColor.toString("rgba");
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

  const handleBarChange = (
    updates: Partial<{
      barThickness: number;
      barPercentage: number;
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
        if (dataset.type === "bar") {
          if (updates.barThickness) {
            dataset.barThickness = updates.barThickness;
          }

          // Update barPercentage if provided
          if (updates.barPercentage !== undefined) {
            dataset.barPercentage = updates.barPercentage;
          }
        }
      });

      // Set the updated chart data
      setChartData(newChartData);
    }
  };

  function handleFillChange(value: boolean): void {
    setFill(value);
    const fallbackColor = "rgba(75, 192, 192, 0.3)";

    const newChartData = {
      ...chartData,
      datasets: chartData.datasets.map((dataset) => {
        return {
          ...dataset,
          fill: value,
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
      overflow={"auto"}
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
          <FillToggle fill={fill} setFill={handleFillChange} />
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
      <Accordion.Item value="barstyle" bg="white">
        <Accordion.ItemTrigger>
          <Span flex="1" fontWeight="medium">
            막대 스타일 설정
          </Span>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent pb={3}>
          <BarStyleOptions
            barThickness={barThickness}
            setBarThickness={setBarThickness}
            barPercentage={barPercentage}
            setBarPercentage={setBarPercentage}
            onOptionsChange={handleBarChange}
          />
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default MixedChartColor;
