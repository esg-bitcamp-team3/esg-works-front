import { getAllUnits, getMyCriteria } from "@/lib/api/get";
import { Criterion, Unit } from "@/lib/interface";
import {
  createListCollection,
  Portal,
  Select,
  Spinner,
} from "@chakra-ui/react";
import { use, useEffect, useMemo, useState } from "react";

interface UnitSelectorProps {
  value: string;
  onValueChange: (value: Unit) => void;
}

const UnitSelector = ({ value, onValueChange }: UnitSelectorProps) => {
  const [unitList, setUnitList] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getData = async () => {
    try {
      setIsLoading(true);
      const data = (await getAllUnits()) || [];
      setUnitList(data);
    } catch (error) {
      console.error("Error fetching units:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const unitCollection = useMemo(() => {
    return createListCollection({
      items: unitList.map((item) => ({
        label: item.description,
        value: item.unitId,
      })),
    });
  }, [unitList]);

  return (
    <Select.Root
      collection={unitCollection}
      size="xs"
      width="240px"
      value={[value]}
      onValueChange={(e) => {
        const selectedUnit = unitList.find(
          (unit) => unit.unitId === e.value[0]
        );
        if (selectedUnit) onValueChange(selectedUnit);
      }}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="단위를 선택하세요" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          {isLoading && (
            <Spinner size="xs" borderWidth="1.5px" color="fg.muted" />
          )}
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>{" "}
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {unitCollection.items.map((unit) => (
              <Select.Item item={unit} key={unit.value}>
                {unit.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
};

export default UnitSelector;
