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
  type: "bar" | "line" | "pie" | "radar" | "doughnut" | "scatter" | "bubble" | "polarArea";
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
}

export interface DataType {
  labels?: string[];  // year
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
