import { getMyCriteria, getSectionsByCriterion } from "@/lib/api/get";
import { Criterion, Section } from "@/lib/interface";
import { createListCollection, Select, Spinner } from "@chakra-ui/react";
import { use, useEffect, useMemo, useState } from "react";

interface YearSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const YearSelector = ({ value, onValueChange }: YearSelectorProps) => {
  const yearList = [
    { year: "2025", value: "2025" },
    { year: "2024", value: "2024" },
    { year: "2023", value: "2023" },
    { year: "2022", value: "2022" },
    { year: "2021", value: "2021" },
    { year: "2020", value: "2020" },
    { year: "2019", value: "2019" },
    { year: "2018", value: "2018" },
  ];

  const yearCollection = useMemo(() => {
    return createListCollection({
      items: yearList.map((item) => ({
        label: item.year,
        value: item.value,
      })),
    });
  }, [yearList]);

  return (
    <Select.Root
      collection={yearCollection}
      size="xs"
      width="160px"
      value={[value]}
      defaultValue={["2020"]}
      onValueChange={(e) => onValueChange(e.value[0])}
    >
      <Select.HiddenSelect />

      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="기준 연도" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          {yearCollection.items.map((year) => (
            <Select.Item item={year} key={year.value}>
              {year.label}
              <Select.ItemIndicator />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
};

export default YearSelector;
