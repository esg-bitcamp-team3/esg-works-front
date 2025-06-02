import {
  Box,
  Button,
  Flex,
  Icon,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useState } from "react";
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
} from "chart.js";

import {
  Bar,
  Line,
  Pie,
  Radar,
  Doughnut,
  Scatter,
  Bubble,
  PolarArea,
} from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend
);

interface ChartContentProps {
  selected: string[];
  charts: {
    type: string;
    label: string;
    icons: React.ElementType;
  }[];
  chartData: any; // or import the correct ChartData type if preferred
}

const ChartContent = ({ selected, charts, chartData }: ChartContentProps) => {
  const [selectedChartType, setSelectedChartType] = useState<string | null>(
    null
  );

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      justifyContent={{ base: "center", md: "space-between" }}
      alignItems={{ base: "flex-start", md: "center" }}
      width="100%"
      height="100%"
      gap={4}
      p="1"
    >
      <VStack
        gap={3}
        align="auto"
        width="100%"
        flex={{ base: "1", md: "1.2", lg: "1" }}
        overflow="auto"
        // maxHeight="310px"
        // minHeight={{ base: "30vh", md: "45vh", lg: "36vh" }}
        maxHeight={{ base: "30vh", md: "45vh", lg: "36vh" }}
        marginLeft={1}
        padding={3}
        borderRadius="md"
        outline={"1px solid #E2E8F0"}
      >
        {charts.map((chart) => (
          <Button
            key={chart.type}
            onClick={() => {
              console.log("선택된 차트:", chart.type, "데이터:", selected);
              setSelectedChartType(chart.type);
            }}
            variant="outline"
            colorScheme="blue"
            width="full"
            textAlign="left"
            justifyContent="flex-start"
            height="fit-content"
            p={3}
          >
            <Flex alignItems="center" gap={2}>
              <Icon
                as={chart.icons}
                // boxSize={{ base: "5", md: "4", lg: "5" }}
                boxSize="4"
              />
              <Text
                fontSize={{ base: "md", md: "sm", lg: "md" }}
                // fontSize="md"
                fontWeight="medium"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
              >
                {chart.label}
              </Text>
            </Flex>
          </Button>
        ))}
      </VStack>

      <VStack
        align={{ base: "flex-start", md: "center", lg: "flex-start" }}
        minHeight={{ base: "30vh", md: "45vh", lg: "36vh" }}
        maxHeight={{ base: "30vh", md: "45vh", lg: "36vh" }}
        flex="3"
        width="100%"
        textAlign={{ base: "left", md: "center" }}
        outline={"1px solid #E2E8F0"}
        padding={3}
        // justifyContent='center'
        // alignContent='center'
      >
        <Stack direction="row">
          <Text fontSize="lg" fontWeight="bold" color="#2F6EEA">
            선택된 지표:
          </Text>
          <Text>{selected.join(", ")}</Text>
        </Stack>
        {!selectedChartType ? (
          <Text fontSize="sm" color="gray.500">
            차트를 선택하여 해당 지표의 데이터를 시각화할 수 있습니다.
          </Text>
        ) : (
          <Box
            width="100%"
            height="30vh"
            justifyContent="center"
            alignContent="center"
            mt={4}
          >
            {chartData && chartData.labels && chartData.datasets ? (
              <>
                {(() => {
                  const filteredData = {
                    labels: chartData.labels,
                    datasets: chartData.datasets.filter(
                      (ds: { label: string }) => selected.includes(ds.label)
                    ),
                  };

                  if (filteredData.datasets.length === 0) {
                    return (
                      <Text fontSize="sm" color="red.500">
                        선택된 지표에 해당하는 차트 데이터가 없습니다.
                      </Text>
                    );
                  }

                  return (
                    <>
                      {selectedChartType === "Bar" && (
                        <Bar data={filteredData} />
                      )}
                      {selectedChartType === "Line" && (
                        <Line data={filteredData} />
                      )}
                      {selectedChartType === "Pie" && (
                        <Pie data={filteredData} />
                      )}
                      {selectedChartType === "Radar" && (
                        <Radar data={filteredData} />
                      )}
                      {selectedChartType === "Doughnut" && (
                        <Doughnut data={filteredData} />
                      )}
                      {selectedChartType === "Scatter" && (
                        <Scatter data={filteredData} />
                      )}
                      {selectedChartType === "Bubble" && (
                        <Bubble data={filteredData} />
                      )}
                      {selectedChartType === "PolarArea" && (
                        <PolarArea data={filteredData} />
                      )}
                    </>
                  );
                })()}
              </>
            ) : (
              <Text fontSize="sm" color="red.500">
                차트 데이터를 불러올 수 없습니다.
              </Text>
            )}
          </Box>
        )}
      </VStack>
    </Flex>
  );
};

export default ChartContent;
