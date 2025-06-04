import { useDrag } from "react-dnd";

interface Props {
  chartType: string;
  children: React.ReactNode;
}

export default function DraggableChartIcon({ chartType, children }: Props) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CHART_ICON",
    item: { chartType },
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
