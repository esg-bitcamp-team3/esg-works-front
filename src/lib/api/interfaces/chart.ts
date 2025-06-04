import { ESGData } from "./esgData";

export interface ChartType {
  type: string;
  label: string;
  icons: React.ComponentType<any>;
}

export interface DataType {
  labels: string[]; // year
  datasets: DatasetType[];
}

export interface DatasetType {
  type: string;
  label: string; // 카테고리 이름
  data: number[];
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
}
