import { ESGData } from "./esgData";

export interface ChartType {
  type: "bar" | "line" | "pie" | "doughnut" | "mixed";
  label: string;
  icons: React.ComponentType<any>;
}

// export type ChartDataset =
//   | {
//       type: "bar" | "line" | "pie" | "radar" | "doughnut" | "polarArea";
//       label: string;
//       data: number[];
//     }
//   | {
//       type: "scatter";
//       label: string;
//       data: { x: number; y: number }[];
//     }
//   | {
//       type: "bubble";
//       label: string;
//       data: { x: number; y: number; r: number }[];
//     };

export interface DatasetType {
  type?: "bar" | "line" | "pie" | "doughnut";
  label?: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];

  borderWidth?: number;
  hoverOffset?: number;
}

export interface DataType {
  labels?: string[]; // year
  datasets: DatasetType[];
  backgroudColor?: string;
}

export interface ChartContentProps {
  categoryId: string[];
  selected: string[];
  charts: {
    type: string;
    label: string;
    icons: React.ElementType;
  }[];
  // chartData: any; // or import the correct ChartData type if preferred
}

export interface Chart {
  chartId: string;
  corporationId: string;
  chartName: string;
  options: string;
  updatedAt: Date;
  updatedBy: string;
  createdAt: Date;
  createBy: string;
}

export interface DataSet {
  dataSetId: string;
  chartId: string;
  type: string;
  label: string;
  esgDataList: ESGData[];
  backgroundColor: string;
  borderColor: string;
  borderWidth: string;
  fill: string;
}

export interface DataSetMap {
  [key: string]: any;
}

export interface IChart {
  chart: Chart;
  dataSet: DataSet;
}

export interface ChartDetail {
  chartType: any;
  chartId: string;
  type: string;
  corporationId: string;
  chartName: string;
  dataSets: DataSetMap[];
  options: string;
  formatOptions: string; // JSON string (formatter 함수들과 관련 옵션들)
  labels: string[];
  updatedAt: Date;
  updatedBy: string;
  createdAt: Date;
  createBy: string;
  esgNumberDTOList?: Array<{
    year: string;
  }>;
}

export interface InteresrtChartDetail {
  interestChartId: string;
  chartId: string;
  chartDetail: ChartDetail;
  userId: string;
  checkTime: Date;
}

export interface InputChart {
  type: string; // "bar" | "line" | "pie" | "doughnut" | "mixed"
  chartName: string;
  options: string; // JSON string (순수한 옵션, 함수 제외)
  formatOptions: string; // JSON string (formatter 함수들과 관련 옵션들)
  labels: string[];
}

export interface InputDataSet {
  chartId: string;
  type: string;
  label: string;
  esgDataIdList: string[];
  backgroundColor: string;
  borderColor: string;
  borderWidth: string;
  fill: string; // Changed from boolean to string
  borderRadius?: string;
  barThickness?: string;
  barPercentage?: string;
  hoverOffset?: string;
  tension?: string;
  pointStyle?: string;
  pointRadius?: string;
  pointHoverRadius?: string;
  pointBackgroundColor?: string;
  pointBorderColor?: string;
  borderDash?: string; // JSON string of array
  rotation?: string;
  radius?: string;
  cutout?: string;
  offset?: string; // JSON string of array
}
