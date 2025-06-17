import { getMyCriteria, getSectionsByCriterion } from "@/lib/api/get";
import { Criterion, Section } from "@/lib/interface";
import { createListCollection, Select, Spinner } from "@chakra-ui/react";
import { use, useEffect, useMemo, useState } from "react";

interface SectionSelectorProps {
  sectionList: Section[];
  setSectionList: (sections: Section[]) => void;
  criterionId: string;
  value: string;
  onValueChange: (value: string) => void;
}

const SectionSelector = ({
  sectionList,
  setSectionList,
  criterionId,
  value,
  onValueChange,
}: SectionSelectorProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const getData = async () => {
    try {
      setIsLoading(true);
      const data = (await getSectionsByCriterion(criterionId)) || [];
      setSectionList(data);
    } catch (error) {
      console.error("Error fetching sections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [criterionId]);

  const sectionCollection = useMemo(() => {
    return createListCollection({
      items: sectionList.map((item) => ({
        label: item.sectionName,
        value: item.sectionId,
      })),
    });
  }, [sectionList]);

  return (
    <Select.Root
      collection={sectionCollection}
      size="xs"
      width="160px"
      value={[value]}
      onValueChange={(e) => {
        onValueChange(e.value[0]);
      }}
    >
      <Select.HiddenSelect />

      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="전체" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          {isLoading && (
            <Spinner size="xs" borderWidth="1.5px" color="fg.muted" />
          )}
          <Select.ClearTrigger onClick={() => onValueChange("")} />
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          {sectionCollection.items.map((section) => (
            <Select.Item item={section} key={section.value}>
              {section.label}
              <Select.ItemIndicator />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
};

export default SectionSelector;
