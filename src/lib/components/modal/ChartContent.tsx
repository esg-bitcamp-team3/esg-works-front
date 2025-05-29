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
  Bar,
  Line,
  Pie,
  Radar,
  Doughnut,
} from "react-chartjs-2";

interface ChartContentProps {
  selected: string[];
  charts: {
    type: string;
    label: string;
    icons: React.ElementType;
  }[];
}


const ChartContent = ({ selected, charts }: ChartContentProps) => {
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
      >
         {/* {selectedChartType && (
          <Box width="100%" height="300px" mt={4}>
            {selectedChartType === "Bar" && <Bar data={filteredChartData} />}
            {selectedChartType === "Line" && <Line data={filteredChartData} />}
            {selectedChartType === "Pie" && <Pie data={filteredChartData} />}
            {selectedChartType === "Radar" && <Radar data={filteredChartData} />}
            {selectedChartType === "Doughnut" && <Doughnut data={filteredChartData} />}
          </Box>
        )} */}
    
        <Stack direction='row'>
          <Text fontSize="lg" fontWeight="bold" color="#2F6EEA">
            선택된 지표:
          </Text>
          <Text>{selected.join(", ")}</Text>
        </Stack>
        <Text fontSize="sm" color="gray.500">
          차트를 선택하여 해당 지표의 데이터를 시각화할 수 있습니다.
        </Text>
        {/* {selected.length > 0 && (
          <Box width="100%" height="200px" mt={4} bg="gray.100" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
            <Text fontSize="md" color="gray.700">차트 예시 영역 (선택된 차트에 따라 변경됨)</Text>
          </Box>
        )} */}
      </VStack>
    </Flex>
  );
};

export default ChartContent;
