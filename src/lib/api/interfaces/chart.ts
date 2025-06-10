import { ESGData } from "./esgData";

export interface ChartType {
  type: string;
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
  type: "bar" | "line" | "pie" | "doughnut" | "mix";
  label: string;
  data: number[];
  // backgroundColor?: string | string[];
  // borderColor?: string;
}

export interface DataType {
  labels?: string[]; // year
  datasets: DatasetType[];
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

export interface IChart {
  chart: Chart;
  dataSet: DataSet;
}

export interface ChartDetail {
  chartId: string;
  corporationId: string;
  chartName: string;
  dataSets: DataSet[];
  options: string;
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
