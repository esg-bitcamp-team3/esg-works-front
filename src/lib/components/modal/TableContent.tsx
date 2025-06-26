"use client";

import {
  Table,
  Checkbox,
  ActionBar,
  Portal,
  Button,
  Kbd,
  Box,
  Flex,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { getEsgData } from "@/lib/api/get";
import { CategorizedESGDataList } from "@/lib/api/interfaces/categorizedEsgDataList";

interface TableContentProps {
  categorizedEsgDataList: CategorizedESGDataList[];
  setCategorizedEsgDataList: (data: CategorizedESGDataList[]) => void;
  resetData: () => void; // 초기화 함수
}

const TableContent = ({
  categorizedEsgDataList,
  setCategorizedEsgDataList,
  resetData,
}: TableContentProps) => {
  // const [selection, setSelection] = useState<string[]>([]);
  // 작년 기준으로 현재 연도 설정
  const currentYear = new Date().getFullYear() - 1;
  const [years, setYears] = useState<string[]>(
    Array.from({ length: 5 }, (_, i) => String(currentYear - i))
  );

  const handleRemoveColumn = (yearToRemove: string) => {
    const updatedYears = years.filter((y) => y !== yearToRemove);

    // Also update categorizedEsgDataList to remove data for this year
    const updatedList = categorizedEsgDataList.map((item) => ({
      ...item,
      esgNumberDTOList: item.esgNumberDTOList.filter(
        (entry) => entry.year !== yearToRemove
      ),
    }));

    setYears(updatedYears);
    setCategorizedEsgDataList(updatedList);
  };

  const handleRemoveRow = async (categoryId: string) => {
    // 선택된 카테고리 ID로 필터링하여 데이터 제거
    const updatedData = categorizedEsgDataList.filter(
      (item) => item.categoryDetailDTO.categoryId !== categoryId
    );

    setCategorizedEsgDataList(updatedData);
  };

  const rows = categorizedEsgDataList.map((item, i) => {
    const categoryId = item.categoryDetailDTO.categoryId;
    const categoryName = item.categoryDetailDTO.categoryName;
    const unitName = item.categoryDetailDTO.unit?.unitName ?? "-";

    // year → value 맵
    const valueMap: Record<string, number> = {};
    item.esgNumberDTOList.forEach((entry) => {
      valueMap[entry.year] = entry.value;
    });

    return (
      <Table.Row key={categoryId}>
        <Table.Cell>
          <Flex alignItems="center" justifyContent="space-between">
            <Box>{categoryName}</Box>
            <Button
              size="xs"
              variant="ghost"
              colorScheme="gray"
              ml={1}
              onClick={() => handleRemoveRow(categoryId)}
              aria-label={`Remove ${categoryName} row`}
              minW="auto"
              p={0}
              h="auto"
            >
              ✕
            </Button>
          </Flex>
        </Table.Cell>
        <Table.Cell textAlign={"center"} color="gray.500" fontSize="xs">
          {unitName}
        </Table.Cell>
        {years.map((year) => {
          const yearIndex = item.esgNumberDTOList.findIndex(
            (e) => e.year === year
          );
          const value = item.esgNumberDTOList[yearIndex]?.value ?? "";

          return (
            <Table.Cell textAlign={"end"} key={`${categoryId}-${year}`}>
              {unitName === "원" ? value?.toLocaleString("ko-KR") : value}
            </Table.Cell>
          );
        })}
      </Table.Row>
    );
  });

  return (
    <>
      {/* <Box
        overflowX="auto" // 반드시 X 방향 오토
        overflowY="auto"
        maxH="345px"
        w="100%"
        boxShadow="md"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
      > */}
      <Box
        minW={`${200 + years.length * 100}px`}
        minHeight="300px"
        maxHeight="300px"
        overflow="auto"
      >
        <Flex justify="flex-end" mb={2}>
          <Button size="sm" colorScheme="blue" onClick={resetData}>
            초기화
          </Button>
        </Flex>
        {/* 테이블 넓이 계산해서 보장 */}
        <Table.Root size="sm" variant="outline" showColumnBorder mt={4}>
          <Table.Header>
            <Table.Row>
              {/* <Table.ColumnHeader w="6">
                  <Checkbox.Root
                    size="sm"
                    aria-label="Select all rows"
                    checked={
                      selection.length === categorizedEsgData.length
                        ? true
                        : selection.length > 0
                        ? "indeterminate"
                        : false
                    }
                    onCheckedChange={(changes) => {
                      setSelection(
                        changes.checked
                          ? categorizedEsgData.map(
                              (item) => item.categoryDetailDTO.categoryId
                            )
                          : []
                      );
                    }}
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                  </Checkbox.Root>
                </Table.ColumnHeader> */}
              <Table.ColumnHeader>지표</Table.ColumnHeader>
              <Table.ColumnHeader w={51} textAlign={"center"}>
                단위
              </Table.ColumnHeader>
              {years.map((year) => (
                <Table.ColumnHeader key={year} textAlign="end">
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                    gap="1"
                    w="100%"
                  >
                    {year}
                    <Button
                      size="xs"
                      variant="ghost"
                      colorScheme="gray"
                      ml={1}
                      onClick={() => handleRemoveColumn(year)}
                      aria-label={`Remove ${year} column`}
                      minW="auto"
                      p={0}
                      h="auto"
                    >
                      ✕
                    </Button>
                  </Box>
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>{rows}</Table.Body>
        </Table.Root>
      </Box>
      {/* </Box> */}

      {/* <ActionBar.Root open={selection.length > 0}>
        <Portal>
          <ActionBar.Positioner>
            <ActionBar.Content>
              <ActionBar.SelectionTrigger>
                {selection.length}개 선택됨
              </ActionBar.SelectionTrigger>
              <ActionBar.Separator />
              <Button variant="outline" size="sm">
                Delete <Kbd>⌫</Kbd>
              </Button>
              <Button variant="outline" size="sm">
                Share <Kbd>T</Kbd>
              </Button>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root> */}
    </>
  );
};

export default TableContent;
