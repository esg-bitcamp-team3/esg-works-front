import { ChartData, ChartType } from "chart.js";
import { useDrag } from "react-dnd";

interface Props {
  chartType: string;
  children: React.ReactNode;
  data?: ChartData<"pie" | "bar" | "line" | "doughnut", number[], string>;
}

export default function DraggableChartIcon({
  chartType,
  children,
  data,
}: Props) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CHART_ICON",
    item: { chartType, data },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      // @ts-ignore
      ref={drag as React.Ref<HTMLDivElement>}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: "grab" }}
    >
      {children}
    </div>
  );
}
