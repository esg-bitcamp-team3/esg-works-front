"use client";

import {
  Table,
  Checkbox,
  ActionBar,
  Portal,
  Button,
  Kbd,
  Box,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { getEsgData } from "@/lib/api/get";
import { CategorizedESGDataList } from "@/lib/api/interfaces/categorizedEsgDataList";

interface TableContentProps {
  categoryIds: string[];
}

const TableContent = ({ categoryIds }: TableContentProps) => {
  // const [selection, setSelection] = useState<string[]>([]);
  const [editableData, setEditableData] = useState<CategorizedESGDataList[]>(
    []
  );
  useEffect(() => {
    Promise.all(categoryIds.map((id) => getEsgData(id)))
      .then((results) => {
        const valid = results.filter(Boolean) as CategorizedESGDataList[];
        // setCategorizedEsgData(valid);
        setEditableData(valid); // ← 수정용 상태에도 저장
      })
      .catch((err) => console.error("ESG data fetch error:", err));
  }, [categoryIds]);
  const [categorizedEsgData, setCategorizedEsgData] = useState<
    CategorizedESGDataList[]
  >([]);

  // 작년 기준으로 현재 연도 설정
  const currentYear = new Date().getFullYear() - 1;
  const [years, setYears] = useState<string[]>(
    Array.from({ length: 5 }, (_, i) => String(currentYear - i))
  );
  const handleAddColumn = () => {
    const nextYear = (Math.min(...years.map(Number)) - 1).toString(); // 가장 작은 연도보다 하나 더 이전
    if (years.includes(nextYear)) return; // 중복 방지

    // 모든 row의 데이터에도 해당 연도 추가
    const updatedData = editableData.map((item) => {
      const alreadyExists = item.esgNumberDTOList.some(
        (e) => e.year === nextYear
      );
      if (!alreadyExists) {
        item.esgNumberDTOList.push({
          categoryId: item.categoryDetailDTO.categoryId,
          corpId: "", // 필요하면 수정
          year: nextYear,
          value: 0,
        });
      }
      return item;
    });

    setYears([...years, nextYear]); // 연도 추가
    setEditableData([...updatedData]); // 데이터 업데이트
  };
  const handleRemoveColumn = (yearToRemove: string) => {
    const updatedYears = years.filter((y) => y !== yearToRemove);
    const updatedData = editableData.map((item) => {
      const newList = item.esgNumberDTOList.filter(
        (e) => e.year !== yearToRemove
      );
      return {
        ...item,
        esgNumberDTOList: newList,
      };
    });

    setYears(updatedYears);
    setEditableData(updatedData);
  };
  useEffect(() => {
    Promise.all(categoryIds.map((id) => getEsgData(id)))
      .then((results) => {
        const valid = results.filter(Boolean) as CategorizedESGDataList[];
        setCategorizedEsgData(valid);
      })
      .catch((err) => console.error("ESG data fetch error:", err));
  }, [categoryIds]);

  const rows = editableData.map((item, i) => {
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
        {/* <Table.Cell>
          <Checkbox.Root
            size="sm"
            aria-label="Select row"
            checked={selection.includes(categoryId)}
            onCheckedChange={(changes) => {
              setSelection((prev) =>
                changes.checked
                  ? [...prev, categoryId]
                  : prev.filter((id) => id !== categoryId)
              );
            }}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
          </Checkbox.Root>
        </Table.Cell> */}
        <Table.Cell>{categoryName}</Table.Cell>
        <Table.Cell textAlign={"center"}>{unitName}</Table.Cell>
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
      <Box
        overflowX="auto" // 반드시 X 방향 오토
        overflowY="auto"
        maxH="345px"
        w="100%"
        boxShadow="md"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
      >
        <Box minW={`${200 + years.length * 100}px`}>
          {" "}
          {/* 테이블 넓이 계산해서 보장 */}
          <Table.Root size="md" variant="outline" showColumnBorder>
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
                <Table.ColumnHeader w={51}>단위</Table.ColumnHeader>
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
                    </Box>
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>{rows}</Table.Body>
          </Table.Root>
        </Box>
      </Box>

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
