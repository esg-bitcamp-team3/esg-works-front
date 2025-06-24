"use client";

import { Table } from "@chakra-ui/react";
import { ChartDetail } from "@/lib/api/interfaces/chart";

interface Props {
  chartData: ChartDetail;
}

export default function TableChart({ chartData }: Props) {
  console.log("TableChart", chartData);
  if (!chartData || !chartData.dataSets || chartData.dataSets.length === 0) {
    return <div style={{ padding: 24 }}>데이터 없음</div>;
  }

  // 헤더(연도)는 첫 데이터셋 기준
  const headers = chartData.dataSets[0]?.esgDataList.map((item) => item.year);

  return (
    <Table.Root size="sm" variant="line">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>지표명</Table.ColumnHeader>
          {headers.map((year, idx) => (
            <Table.ColumnHeader key={idx}>{year}</Table.ColumnHeader>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {chartData.dataSets.map((dataset, i) => (
          <Table.Row key={i}>
            <Table.Cell>{dataset.label || `데이터셋 ${i + 1}`}</Table.Cell>
            {dataset.esgDataList.map((item, j) => (
              <Table.Cell key={j} textAlign="end">
                {item.value}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
