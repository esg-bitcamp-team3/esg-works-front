export interface ChartType {
  type: string;
  label: string;
  icons: React.ComponentType<any>;
}

export interface DataType {
  labels: string[];  // year
  datasets: DatasetType[];
}

export interface DatasetType {
  type: "bar" | "line" | "pie" | "radar" | "doughnut" | "scatter" | "bubble" | "polarArea";
  label: string;  // 카테고리 이름
  data: number[];
}
export interface ChartContentProps {
  categoryId: string[];
  selected: string;
  charts: {
    type: string;
    label: string;
    icons: React.ElementType;
  }[];
  // chartData: any; // or import the correct ChartData type if preferred
}
