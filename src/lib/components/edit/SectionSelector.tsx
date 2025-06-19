import { getMyCriteria, getSectionsByCriterion } from "@/lib/api/get";
import { Criterion, Section } from "@/lib/interface";
import {
  Combobox,
  createListCollection,
  Portal,
  Select,
  Spinner,
  useFilter,
  useListCollection,
} from "@chakra-ui/react";
import { use, useEffect, useMemo, useState } from "react";

interface SectionSelectorProps {
  sectionList: Section[];
  setSectionList: (sections: Section[]) => void;
  criterionId: string;
  value: string;
  onValueChange: (value: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const SectionSelector = ({
  sectionList,
  setSectionList,
  criterionId,
  value,
  onValueChange,
  loading,
  setLoading,
}: SectionSelectorProps) => {
  const [searchValue, setSearchValue] = useState("");

  const getData = async () => {
    try {
      setLoading(true);
      const data = (await getSectionsByCriterion(criterionId)) || [];
      setSectionList(data);
    } catch (error) {
      console.error("Error fetching sections:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [criterionId]);

  const sectionItems = useMemo(() => {
    return sectionList.map((item) => ({
      label: item.sectionName,
      value: item.sectionId,
    }));
  }, [sectionList]);

  // Filter items based on search value
  const filteredItems = useMemo(() => {
    return sectionItems.filter((item) =>
      item.label.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [sectionItems, searchValue]);

  // Create collection from filtered items
  const collection = useMemo(
    () => createListCollection({ items: filteredItems }),
    [filteredItems]
  );

  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={(e) => setSearchValue(e.inputValue)}
      size="sm"
      width="320px"
      value={[value]}
      onValueChange={(e) => {
        onValueChange(e.value[0]);
      }}
      bg="white"
      openOnClick
    >
      <Combobox.Control>
        <Combobox.Input
          placeholder="검색어를 입력하세요"
          bg="white"
          borderColor="gray.200"
          borderWidth={"1px"}
          _focus={{ borderColor: "gray.400", boxShadow: "none" }}
        />
        <Combobox.IndicatorGroup>
          {loading && (
            <Spinner size="xs" borderWidth="1.5px" color="fg.muted" />
          )}
          <Combobox.ClearTrigger onClick={() => onValueChange("")} />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>검색어에 해당하는 항목이 없습니다.</Combobox.Empty>
            {filteredItems.map((item) => (
              <Combobox.Item item={item.value} key={item.value}>
                {item.label}
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  );
};

export default SectionSelector;
