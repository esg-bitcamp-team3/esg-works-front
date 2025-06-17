import { getMyCriteria } from "@/lib/api/get";
import { Criterion } from "@/lib/interface";
import { createListCollection, Select, Spinner } from "@chakra-ui/react";
import { use, useEffect, useMemo, useState } from "react";

interface CriterionSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const CriterionSelector = ({
  value,
  onValueChange,
}: CriterionSelectorProps) => {
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getData = async () => {
    try {
      setIsLoading(true);
      const data = (await getMyCriteria()) || [];
      setCriteria(data);
    } catch (error) {
      console.error("Error fetching criteria:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const criteriaCollection = useMemo(() => {
    return createListCollection({
      items: criteria.map((item) => ({
        label: item.criterionName,
        value: item.criterionId,
      })),
    });
  }, [criteria]);

  return (
    <Select.Root
      collection={criteriaCollection}
      size="sm"
      width="160px"
      defaultValue={["cri-01"]}
      value={[value]}
      onValueChange={(e) => onValueChange(e.value[0])}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="기준" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          {isLoading && (
            <Spinner size="xs" borderWidth="1.5px" color="fg.muted" />
          )}
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          {criteriaCollection.items.map((criterion) => (
            <Select.Item item={criterion} key={criterion.value}>
              {criterion.label}
              <Select.ItemIndicator />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
};

export default CriterionSelector;
