export interface ChartType {
  type: string;
  label: string;
  icons: React.ComponentType<any>;
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
